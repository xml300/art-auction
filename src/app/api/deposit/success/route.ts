import { getUsers, updateTransaction, getTransactionByReference, updateUser } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { User } from "@/data/db";

export async function GET(request: NextRequest) {
    const [payload, error] = await getSession();
    const reference = request.nextUrl.searchParams.get('reference');
    const redirectUrl = new URL('/dashboard/deposit', "https://art-auction--hosting-72ffb.us-east4.hosted.app/");

    if (error || payload === null) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'User unauthorized', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    })
    const paymentData = await response.json();
    const transaction = getTransactionByReference(reference || "");

    if (paymentData.data.status !== 'success' && paymentData.data.amount * 0.01 !== transaction?.amount) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'Payment verification failed', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    if (transaction) {
        updateTransaction(transaction.id, [
            {columnName: 'status', value: 'completed'}
        ]);
        const user = getUsers(transaction.userId) as User;
        updateUser(transaction.userId, [
            {columnName: 'wallet', value: user.wallet + transaction.amount}
        ]);
        const response = NextResponse.redirect(redirectUrl);
        return response;
    }
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set('errors', 'Transaction not found', {
        maxAge: 10,
        path: '/'
    });
    return res;
}