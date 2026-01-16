import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createTransaction, getUsers } from "@/data/queries";
import { User } from "@/types";

export async function POST(req: NextRequest) {
    const [session, error] = await getSession();
    const redirectUrl = new URL('/dashboard/deposit', req.nextUrl.origin);
    if (error || !session) {
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Unauthorized', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const userId = session.userId;
    const formData = await req.formData();
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
        const currentUser = await getUsers(userId) as User;
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
        createTransaction(userId, referenceNumber, `Deposit of $${amount.toFixed(2)}`, "Wallet Deposit", amount, "pending");
        return NextResponse.redirect(paymentData.data.authorization_url, {status: 303});
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
