import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById, getUsers, User, createTransaction, getBidsByUser, updateArtwork, createBid, updateUser } from '@/data/db';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const [payload, error] = await getSession();
    const artworkId = parseInt((await params).id);
    const formData = await request.formData();
    const redirectUrl = new URL("/dashboard/marketplace/place-bid/" + artworkId, "https://art-auction--hosting-72ffb.us-east4.hosted.app/");

    if (!formData.has('bidAmount')) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'Bid amount is required', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const bidAmount = parseFloat(formData.get("bidAmount")!.toString().replace(/[^0-9\.]/g, ""));

    if (error || payload === null) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'User unauthorized', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    const user = getUsers(payload.userId) as User;
    if (!user) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'User not found', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    if (isNaN(artworkId) || !bidAmount) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'Invalid request data', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const artwork = getArtworkById(artworkId);
    if (!artwork) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'Artwork not found', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    if (bidAmount <= artwork.currentBid) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'Bid amount must be higher than current bid', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const bid = getBidsByUser(user.id, { sortBy: 'bidTime', sortOrder: 'desc', where: [{ columnName: 'artworkId', value: artworkId }] }).at(0);
    let amount = bidAmount;
    if (bid) {
        amount = amount - bid.bidAmount;
    }

    if (amount > user.wallet) {
        const response = NextResponse.redirect(redirectUrl);
        response.cookies.set('errors', 'Insufficient funds in your auction deposit', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }
    const reference = `BID-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    createTransaction(user.id, reference, 'bid', 'wallet', amount, 'completed');
    createBid(artworkId, user.id, bidAmount);
    updateArtwork(artworkId, { columnName: 'currentBid', value: bidAmount });
    updateUser(user.id, [{columnName: 'wallet', value: user.wallet - amount}])
    const resp = NextResponse.redirect(redirectUrl);
    return resp;
}
