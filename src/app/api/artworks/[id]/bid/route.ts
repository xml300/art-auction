import { NextRequest, NextResponse } from 'next/server';
import { getArtworkById, getUser, createTransaction, getBids, updateArtwork, createBid, recordLedgerBidHold, recordLedgerBidRelease, createActivity } from '@/data/queries';
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
    // Fetch recent bids to identify previous highest bidder
    const previousBids = await getBids(artworkId, { sortBy: 'bidTime', sortOrder: 'desc' });
    const highestBid = previousBids[0];

    // Determine amount to pay: if user is raising their own active top bid, only pay difference; otherwise pay full bid
    let amountToPayNaira = bidAmount;
    if (highestBid && highestBid.bidderId === user.id) {
        amountToPayNaira = bidAmount - highestBid.bidAmount;
    }

    const amountToPayKobo = Math.round(amountToPayNaira * 100);

    if (amountToPayKobo > user.wallet) {
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        response.cookies.set('errors', 'Insufficient funds in your auction deposit', {
            maxAge: 10,
            path: '/'
        });
        return response;
    }

    const reference = `BID-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const transDescription = `Bid of ₦${bidAmount.toLocaleString()} placed on ${artwork.title}`;

    await db.transaction(async (tx) => {
        await createTransaction(user.id, reference, transDescription, 'bid_payment', amountToPayNaira.toFixed(2), 'completed', artworkId, tx);
        await createBid(artworkId, user.id, bidAmount, tx);
        await updateArtwork(artworkId, { currentBid: bidAmount }, tx);
        await createActivity(
            {
                userId: user.id,
                type: 'bid',
                artworkId,
                artworkTitle: artwork.title,
                amount: bidAmount,
            },
            tx
        );

        // Double-Entry Ledger: Lock funds into Escrow Hold
        // Debit: liability:collector:available:{userId} | Credit: liability:collector:escrow:{userId}
        await recordLedgerBidHold(
            {
                userId: user.id,
                amountKobo: amountToPayKobo,
                artworkId,
                reference,
                idempotencyKey: `HOLD-LEDGER-${reference}`,
            },
            tx
        );

        // If another collector was the highest bidder, release their escrow hold back to available balance
        if (highestBid && highestBid.bidderId !== user.id) {
            const previousBidder = await getUser(highestBid.bidderId, tx);
            if (previousBidder) {
                const refundKobo = Math.round(highestBid.bidAmount * 100);
                const refundRef = `REF-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
                const refundDesc = `Refund for outbid on ${artwork.title}`;
                await createTransaction(previousBidder.id, refundRef, refundDesc, 'refund', highestBid.bidAmount.toFixed(2), 'completed', artworkId, tx);

                // Double-Entry Ledger: Release funds from Escrow back to Available
                // Debit: liability:collector:escrow:{previousBidderId} | Credit: liability:collector:available:{previousBidderId}
                await recordLedgerBidRelease(
                    {
                        userId: previousBidder.id,
                        amountKobo: refundKobo,
                        artworkId,
                        reference: refundRef,
                        idempotencyKey: `REL-LEDGER-${refundRef}`,
                    },
                    tx
                );
            }
        }
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

    // Notify previous top bidder that they have been outbid and their funds refunded
    if (highestBid && highestBid.bidderId !== user.id) {
        notifyUser({
            userId: highestBid.bidderId,
            type: "outbid",
            title: "Outbid Alert & Refund",
            body: `You have been outbid on "${artwork.title}". Your bid of ₦${highestBid.bidAmount.toLocaleString()} has been refunded to your wallet.`,
            data: { artworkId, targetUrl: `/dashboard/marketplace/place-bid/${artworkId}` },
            channels: ["in_app", "push"],
        }).catch(err => console.error("Outbid dispatch error:", err));
    }

    const resp = NextResponse.redirect(redirectUrl, { status: 303 });
    return resp;
}
