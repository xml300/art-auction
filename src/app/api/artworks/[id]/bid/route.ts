import { NextRequest, NextResponse } from 'next/server';
import { createBid, getArtworkById, getUsers, User, updateArtwork } from '@/data/db';
import * as jwt from 'jsonwebtoken';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authCookie = request.cookies.get("auth")?.value || "";
    const artworkId = parseInt((await params).id);
    const { amount } = await request.json();

    console.log(artworkId, amount);

    try {
        const payload = jwt.verify(authCookie, process.env.JWT_SECRET_KEY || '') as jwt.JwtPayload;
        const user = getUsers(payload.id) as User;
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }
        if (isNaN(artworkId) || !amount) {
            return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
        }
        const artwork = getArtworkById(artworkId);
        if (!artwork) {
            return NextResponse.json({ message: 'Artwork not found' }, { status: 404 });
        }

        if (amount <= artwork.currentBid) {
            return NextResponse.json({ message: 'Bid amount must be higher than current bid' }, { status: 400 });
        }
        const newBid = createBid(artworkId, user.id, amount);
        updateArtwork(artworkId, {columnName: 'currentBid', value: amount});
        return NextResponse.json(newBid, { status: 201 });
    } catch (error) {
        if ((error as jwt.TokenExpiredError).name === 'TokenExpiredError') {
            console.error('Token has expired!')
        } else if ((error as jwt.JsonWebTokenError).name === 'JsonWebTokenError') {
            console.error('Token is invalid!');
        }
        return NextResponse.json({ message: 'User unauthorized' }, { status: 401 })
    }
}
