import crypto from "crypto";
import { NextRequest } from "next/server";
import { db } from "@/data/db";
import { updateTransaction, createTransaction, getTransactionByReference, recordLedgerDeposit, getUser } from "@/data/queries";
import { notifyUser } from "@/lib/notifications";
import { logAuditEvent } from "@/lib/audit";

/**
 * Resolves the canonical base URL of the site, taking reverse proxies,
 * container ports, and configured environment variables into account.
 */
export function getBaseUrl(req?: NextRequest): string {
  if (process.env.SITE_BASE_URL) {
    return process.env.SITE_BASE_URL.replace(/\/+$/, "");
  }
  if (req) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    if (forwardedHost) {
      return `${forwardedProto}://${forwardedHost}`;
    }
    return req.nextUrl.origin;
  }
  return "http://localhost:3000";
}

/**
 * Prevents open redirect attacks by ensuring return URLs are strictly relative paths
 * and cannot be protocol-relative (e.g. '//attacker.com').
 */
export function sanitizeReturnUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "/dashboard/deposit";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\")) {
    return trimmed;
  }
  return "/dashboard/deposit";
}

/**
 * Verifies the Paystack webhook HMAC-SHA512 signature.
 */
export function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || !signature) return false;
  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

/**
 * Executes authoritative, idempotent double-entry ledger deposit settlement,
 * updates the transaction record, logs security audit entries, and dispatches user notifications.
 */
export async function fulfillPaystackDeposit({
  reference,
  amountInKobo,
  userId,
  req,
}: {
  reference: string;
  amountInKobo: number;
  userId?: number;
  req?: NextRequest;
}) {
  const existingTx = await getTransactionByReference(reference);

  // If already completed (processed earlier by callback or webhook), exit idempotently
  if (existingTx && existingTx.status === "completed") {
    return { success: true, duplicate: true, transaction: existingTx };
  }

  const targetUserId = existingTx?.userId || userId;
  if (!targetUserId) {
    throw new Error(`Cannot determine user for transaction reference ${reference}`);
  }

  const targetUser = await getUser(targetUserId);
  if (!targetUser) {
    throw new Error(`User ${targetUserId} not found for transaction reference ${reference}`);
  }

  const amountInNaira = (amountInKobo / 100).toFixed(2);
  const formattedNaira = (amountInKobo / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  await db.transaction(async (tx) => {
    if (existingTx) {
      await updateTransaction(
        existingTx.id,
        {
          status: "completed",
          amount: amountInNaira,
          description: `Deposit of ₦${formattedNaira}`,
        },
        tx
      );
    } else {
      await createTransaction(
        targetUserId,
        reference,
        `Deposit of ₦${formattedNaira}`,
        "deposit",
        amountInNaira,
        "completed",
        undefined,
        tx,
        "NGN"
      );
    }

    // Double-Entry Ledger Posting:
    // Debit:  asset:gateway:paystack
    // Credit: liability:collector:available:{userId}
    await recordLedgerDeposit(
      {
        userId: targetUserId,
        amountKobo: amountInKobo,
        reference,
        idempotencyKey: `DEP-LEDGER-${reference}`,
      },
      tx
    );

    if (req) {
      await logAuditEvent(
        req,
        {
          actorId: targetUserId,
          actorType: "user",
          action: "deposit_settled",
          resourceType: "transaction",
          resourceId: reference,
          status: "success",
          metadata: {
            amountKobo: amountInKobo,
            amountNaira: amountInNaira,
            gateway: "paystack",
          },
        },
        tx
      );
    }
  });

  // Trigger push and in-app notifications
  notifyUser({
    userId: targetUserId,
    type: "deposit_success",
    title: "Deposit Successful",
    body: `Your deposit of ₦${formattedNaira} has been credited to your wallet.`,
    data: { targetUrl: "/dashboard/deposit" },
    channels: ["in_app", "push"],
  }).catch((err) => console.error("Deposit notification error:", err));

  return { success: true, duplicate: false };
}
