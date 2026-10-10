import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById, getUser, createTransaction, getBids, getBidsByUser, updateArtwork, createBid, updateUser } from '@/data/queries';
import { JoinedReturnType } from '@/types';
import { getSession } from '@/lib/auth';
import { notifyUser } from '@/lib/notifications';
import { db } from '@/data/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const [session, error] = await getSession();
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

    if (error || session === null) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'User unauthorized', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    const user = await getUser(session.userId);
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
    const transDescription = `Bid of ₦${bidAmount.toLocaleString()} placed on ${artwork.title}`;

    // Fetch recent bids to identify previous highest bidder
    const previousBids = await getBids(artworkId, { sortBy: 'bidTime', sortOrder: 'desc' });
    const previousTopBid = previousBids.find(b => b.bidderId !== user.id);

    await db.transaction(async (tx) => {
        await createTransaction(user.id, reference, transDescription, 'bid_payment', amount.toFixed(2), 'completed', undefined, tx);
        await createBid(artworkId, user.id, bidAmount, tx);
        await updateArtwork(artworkId, { currentBid: bidAmount }, tx);
        await updateUser(user.id, { wallet: user.wallet - amount }, tx);
    });

    // Notify current user of successful bid placement
    notifyUser({
        userId: user.id,
        type: "system",
        title: "Bid Placed Successfully",
        body: `Your bid of ₦${bidAmount.toLocaleString()} on "${artwork.title}" is now active.`,
        data: { artworkId, targetUrl: `/dashboard/marketplace/place-bid/${artworkId}` },
        channels: ["in_app"],
    }).catch(err => console.error("Bid confirmation dispatch error:", err));

    // Notify previous top bidder that they have been outbid (via in-app & push)
    if (previousTopBid) {
        notifyUser({
            userId: previousTopBid.bidderId,
            type: "outbid",
            title: "Outbid Alert",
            body: `You have been outbid on "${artwork.title}". High bid is now ₦${bidAmount.toLocaleString()}.`,
            data: { artworkId, targetUrl: `/dashboard/marketplace/place-bid/${artworkId}` },
            channels: ["in_app", "push"],
        }).catch(err => console.error("Outbid dispatch error:", err));
    }

    const resp = NextResponse.redirect(redirectUrl, { status: 303 });
    return resp;
}
