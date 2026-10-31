import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getTransactionByReference } from "@/data/queries";
import { getBaseUrl, sanitizeReturnUrl, fulfillPaystackDeposit } from "@/lib/paystack";

export async function GET(request: NextRequest) {
    const baseUrl = getBaseUrl(request);
    const [session] = await getSession();
    const reference = request.nextUrl.searchParams.get('reference');
    const returnUrlCookie = request.cookies.get('deposit_return_url')?.value;
    const finalPath = sanitizeReturnUrl(returnUrlCookie);
    const redirectUrl = new URL(finalPath, baseUrl);

    // Build redirect helper that guarantees clearing the temporary return url cookie
    const buildRedirect = (errorMessage?: string) => {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.delete('deposit_return_url');
        if (errorMessage) {
            response.cookies.set('errors', errorMessage, {
                maxAge: 10,
                path: '/'
            });
        }
        return response;
    };

    if (!session || !session.userId) {
        return buildRedirect('Session expired. Please log in.');
    }

    if (!reference) {
        return buildRedirect('Transaction reference is required');
    }

    try {
        // Prevent duplicate processing or hijacking
        const existingTx = await getTransactionByReference(reference);

        // Security check: ensure reference belongs to the currently logged in user
        if (existingTx && existingTx.userId !== session.userId) {
            console.error(`Security alert: User ${session.userId} attempted to verify transaction ${reference} belonging to user ${existingTx.userId}`);
            return buildRedirect('Unauthorized transaction reference');
        }

        // If reference is already completed (e.g. processed by webhook or previous callback), redirect cleanly
        if (existingTx && existingTx.status === 'completed') {
            return buildRedirect();
        }

        const paystackKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackKey) {
            console.error("PAYSTACK_SECRET_KEY is not configured in environment variables");
            return buildRedirect('Payment system temporarily unavailable');
        }

        // Verify with Paystack API
        const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${paystackKey}`
            }
        });

        const paymentData = await res.json();
        if (!res.ok || !paymentData.data || paymentData.data.status !== 'success') {
            return buildRedirect('Payment verification failed or payment was cancelled');
        }

        // Verify currency
        if (paymentData.data.currency !== 'NGN') {
            return buildRedirect(`Invalid transaction currency: ${paymentData.data.currency}`);
        }

        // Verify metadata userId if present
        const metadataUserId = paymentData.data.metadata?.userId;
        if (metadataUserId && Number(metadataUserId) !== session.userId) {
            console.error(`Metadata userId mismatch: expected ${session.userId}, found ${metadataUserId}`);
            return buildRedirect('Unauthorized transaction reference');
        }

        const amountInKobo = Math.round(Number(paymentData.data.amount));

        // Authoritative atomic fulfillment (ledger, transaction status, notifications, audit log)
        await fulfillPaystackDeposit({
            reference: paymentData.data.reference,
            amountInKobo,
            userId: session.userId,
            req: request,
        });

        return buildRedirect();
    } catch (error) {
        console.error("Deposit callback error:", error);
        return buildRedirect('An unexpected error occurred while verifying your deposit');
    }
}
