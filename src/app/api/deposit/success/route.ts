import { getUser, updateTransaction, createTransaction, updateUser } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const [session, error] = await getSession();
    const reference = request.nextUrl.searchParams.get('reference');
    const redirectUrl = new URL('/dashboard/deposit', process.env.SITE_BASE_URL || "");

    if (error || session === null) {
        const response = NextResponse.redirect(redirectUrl, {status: 303});
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
    const transaction = await createTransaction(session.userId, paymentData.data.reference, `Deposit of ₦${paymentData.data.amount.toLocaleString()}`, "Wallet Deposit", paymentData.data.amount, "pending");
    if(!paymentData.data){
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Payment verification failed', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    if(!transaction){
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Transaction not found', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    if (paymentData.data.status !== 'success' && paymentData.data.amount * 0.01 !== transaction.finalAmount) {
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Payment verification failed', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    updateTransaction(transaction.id, {
        status: 'completed'
    });
    const user = await getUser(transaction.buyerId);
    updateUser(transaction.buyerId, {
            wallet: user.wallet + transaction.finalAmount
        });
    const response = NextResponse.redirect(redirectUrl, {status: 303});
    return response;
}