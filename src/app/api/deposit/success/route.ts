import { updateTransaction, createTransaction, getTransactionByReference, recordLedgerDeposit } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/data/db";
import { notifyUser } from "@/lib/notifications";

export async function GET(request: NextRequest) {
    const [session] = await getSession();
    const reference = request.nextUrl.searchParams.get('reference');
    const redirectUrl = new URL('/dashboard/deposit', process.env.SITE_BASE_URL || "");

    if (!reference) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Transaction reference is required', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    // Prevent duplicate processing if reference was already completed
    const existingTx = await getTransactionByReference(reference);
    if (existingTx && existingTx.status === 'completed') {
        return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    });
    const paymentData = await res.json();
    if (!paymentData.data || paymentData.data.status !== 'success') {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Payment verification failed', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    // Paystack returns amount in kobo (e.g., 500,000 kobo for ₦5,000)
    const amountInKobo = Math.round(Number(paymentData.data.amount));
    const amountInNaira = (amountInKobo / 100).toFixed(2);
    const formattedNaira = (amountInKobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    await db.transaction(async (tx) => {
        let transaction = existingTx;
        if (!transaction) {
            transaction = await createTransaction(
                session.userId,
                paymentData.data.reference,
                `Deposit of ₦${formattedNaira}`,
                "deposit",
                amountInNaira,
                "completed",
                undefined,
                tx
            );
        } else {
            await updateTransaction(transaction.id, {
                status: 'completed',
                amount: amountInNaira,
                description: `Deposit of ₦${formattedNaira}`
            }, tx);
        }

        // Authoritative Double-Entry Ledger Posting:
        // Debit: asset:gateway:paystack | Credit: liability:collector:available:{userId}
        await recordLedgerDeposit(
            {
                userId: session.userId,
                amountKobo: amountInKobo,
                reference: paymentData.data.reference,
                idempotencyKey: `DEP-LEDGER-${paymentData.data.reference}`,
            },
            tx
        );
    });

    notifyUser({
        userId: session.userId,
        type: "deposit_success",
        title: "Deposit Successful",
        body: `Your deposit of ₦${formattedNaira} has been credited to your wallet.`,
        data: { targetUrl: "/dashboard/deposit" },
        channels: ["in_app", "push"],
    }).catch(err => console.error("Deposit notification error:", err));

    const response = NextResponse.redirect(redirectUrl, { status: 303 });
    return response;
}