import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById, getUsers, createTransaction, getBidsByUser, updateArtwork, createBid, updateUser } from '@/data/queries';
import { JoinedReturnType, User } from '@/types';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const [payload, error] = await getSession();
    const artworkId = parseInt((await params).id);
    const formData = await request.formData();
    const redirectUrl = new URL("/dashboard/marketplace/place-bid/" + artworkId, process.env.SITE_BASE_URL || "");

    if (!formData.has('bidAmount')) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Bid amount is required', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const bidAmount = parseFloat(formData.get("bidAmount")!.toString().replace(/[^0-9\.]/g, ""));

    if (error || payload === null) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'User unauthorized', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    const user = await getUsers(payload.userId) as User;
    if (!user) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'User not found', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    if (isNaN(artworkId) || !bidAmount) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Invalid request data', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const artwork = await getArtworkById(artworkId) as JoinedReturnType;
    if (!artwork) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Artwork not found', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    if (artwork.currentBid && bidAmount <= artwork.currentBid) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Bid amount must be higher than current bid', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const bid = (await getBidsByUser(user.id, { sortBy: 'bidTime', sortOrder: 'desc', where: [{ columnName: 'artworkId', value: artworkId }] })).at(0);
    let amount = bidAmount;
    if (bid) {
        amount = amount - bid.bidAmount;
    }
    console.log(amount, bid, bidAmount)


    if (amount > user.wallet) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Insufficient funds in your auction deposit', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    const reference = `BID-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const transDescription = `Bid of $${bidAmount} placed on ${artwork.title}`;

    createTransaction(user.id, reference, transDescription, 'wallet', amount, 'completed');
    createBid(artworkId, user.id, bidAmount);
    updateArtwork(artworkId, { currentBid: bidAmount });
    updateUser(user.id, { wallet: user.wallet - amount });
    const resp = NextResponse.redirect(redirectUrl, { status: 303 });
    return resp;
}
