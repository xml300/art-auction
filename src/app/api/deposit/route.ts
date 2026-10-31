import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser, createTransaction } from "@/data/queries";
import { getBaseUrl, sanitizeReturnUrl } from "@/lib/paystack";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
    const baseUrl = getBaseUrl(req);
    const [session] = await getSession();

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        const redirectUrl = new URL('/dashboard/deposit', baseUrl);
        const res = NextResponse.redirect(redirectUrl, { status: 303 });
        res.cookies.set('errors', 'Invalid form data submission', { maxAge: 10, path: '/' });
        return res;
    }

    const returnUrlParam = formData.get('returnUrl')?.toString();
    const returnPath = sanitizeReturnUrl(returnUrlParam);
    const redirectUrl = new URL(returnPath, baseUrl);

    if (!session || !session.userId) {
        const loginUrl = new URL('/auth/login', baseUrl);
        const res = NextResponse.redirect(loginUrl, { status: 303 });
        res.cookies.set('errors', 'Session expired. Please log in.', { maxAge: 10, path: '/' });
        return res;
    }

    const rawAmount = formData.get('amount')?.toString();
    const parsedAmount = rawAmount ? Number(rawAmount) : NaN;

    if (!Number.isFinite(parsedAmount) || parsedAmount < 100) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Minimum deposit amount is ₦100.00', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    const amount = Math.floor(parsedAmount);

    try {
        const currentUser = await getUser(session.userId);
        if (!currentUser) {
            const response = NextResponse.redirect(redirectUrl, { status: 303 });
            response.cookies.set('errors', 'User account not found', {
                maxAge: 10,
                path: '/'
            });
            return response;
        }

        const paystackKey = process.env.PAYSTACK_SECRET_KEY;
        if (!paystackKey) {
            console.error("PAYSTACK_SECRET_KEY is not configured in environment variables");
            const response = NextResponse.redirect(redirectUrl, { status: 303 });
            response.cookies.set('errors', 'Payment system temporarily unavailable', {
                maxAge: 10,
                path: '/'
            });
            return response;
        }

        // Generate unique reference
        const referenceNumber = `DEP-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`;

        // Pre-create pending transaction record to bind reference to session.userId
        const amountInNaira = amount.toFixed(2);
        const formattedNaira = amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        await createTransaction(
            session.userId,
            referenceNumber,
            `Pending deposit of ₦${formattedNaira}`,
            "deposit",
            amountInNaira,
            "pending",
            undefined,
            undefined,
            "NGN"
        );

        // Audit log deposit initialization
        await logAuditEvent(req, {
            actorId: session.userId,
            actorType: "user",
            action: "deposit_initialized",
            resourceType: "transaction",
            resourceId: referenceNumber,
            status: "success",
            metadata: { amount, currency: "NGN", returnPath }
        });

        // Callback URL for Paystack
        const callbackUrl = `${baseUrl}/api/deposit/success`;

        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${paystackKey}`
            },
            body: JSON.stringify({
                email: currentUser.email,
                amount: amount * 100, // Paystack requires amount in kobo
                callback_url: callbackUrl,
                reference: referenceNumber,
                metadata: {
                    userId: session.userId,
                    returnUrl: returnPath,
                }
            })
        });

        const paymentData = await response.json();
        if (!response.ok || paymentData.status === false) {
            console.error("Paystack initialization failed:", paymentData);
            const errResponse = NextResponse.redirect(redirectUrl, { status: 303 });
            errResponse.cookies.set('errors', paymentData.message || 'Payment initialization failed', {
                maxAge: 10,
                path: '/'
            });
            return errResponse;
        }

        const authResponse = NextResponse.redirect(paymentData.data.authorization_url, { status: 303 });
        authResponse.cookies.set('deposit_return_url', returnPath, {
            maxAge: 3600,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        });
        return authResponse;
    } catch (error) {
        console.error("API Deposit error:", error);
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Internal server error processing deposit', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
}
