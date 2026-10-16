import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser } from "@/data/queries";


export async function POST(req: NextRequest) {
    const [session] = await getSession();
    const formData = await req.formData();
    const returnUrlParam = formData.get('returnUrl')?.toString();
    const returnPath = returnUrlParam && returnUrlParam.startsWith('/') ? returnUrlParam : '/dashboard/deposit';
    const redirectUrl = new URL(returnPath, req.nextUrl.origin);
    const userId = session!.userId;
    const amount = parseInt(formData.get('amount')!.toString());

    if (typeof amount !== "number" || amount <= 0) {
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Invalid deposit amount', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    try {
        const currentUser = await getUser(userId);
        if (!currentUser) {
            const response = NextResponse.redirect(redirectUrl, {status: 303});
            response.cookies.set('errors', 'User not found', {
                maxAge: 10,
                path: '/'
            });
            return response;
        }
        // Create a transaction record
        const referenceNumber = `DEP-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            },
            body: JSON.stringify({
                email: currentUser.email,
                amount: amount * 100,
                callback_url: `${req.nextUrl.origin}/api/deposit/success`,
                reference: referenceNumber
            })
        });
        const paymentData = await response.json();
        if (paymentData.status === false) {
            const response = NextResponse.redirect(redirectUrl, {status: 303});
            response.cookies.set('errors', 'Payment initialization failed', {
                maxAge: 10,
                path: '/'
            });
            return response;
        }
        const authResponse = NextResponse.redirect(paymentData.data.authorization_url, {status: 303});
        if (returnUrlParam && returnUrlParam.startsWith('/')) {
            authResponse.cookies.set('deposit_return_url', returnUrlParam, {
                maxAge: 3600,
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
            });
        }
        return authResponse;
    } catch (error) {
        console.error("API Deposit error:", error);
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Internal server error', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
}
