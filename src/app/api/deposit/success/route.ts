import { getUser, updateTransaction, createTransaction, updateUser } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/data/db";

export async function GET(request: NextRequest) {
    const [session, error] = await getSession();
    const reference = request.nextUrl.searchParams.get('reference');
    const redirectUrl = new URL('/dashboard/deposit', process.env.SITE_BASE_URL || "");

    if (error || session === null) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'User unauthorized', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    })
    const paymentData = await res.json();
    if (!paymentData.data || paymentData.data.status !== 'success') {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Payment verification failed', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

 

    await db.transaction(async (tx) => {
        const transaction = await createTransaction(session.userId, paymentData.data.reference, `Deposit of ₦${paymentData.data.amount.toLocaleString()}`, "deposit", paymentData.data.amount, "pending", undefined, tx);
     
        await updateTransaction(transaction.id, {
            status: 'completed'
        }, tx);
        const user = await getUser(transaction.userId, tx);
        await updateUser(transaction.userId, {
            wallet: user.wallet + parseFloat(transaction.amount)
        }, tx);
    });
    const response = NextResponse.redirect(redirectUrl, { status: 303 });
    return response;
}