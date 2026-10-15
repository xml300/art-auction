import { getArtworks, createArtwork } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Roles } from "@/enums";
import { validateRequest, createArtworkSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";

export async function GET(request: NextRequest){
    const params = request.nextUrl.searchParams;
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');
    const withArtist = params.get('artist') === "true";
    const withRelatedWorks = params.get('relatedWorks') === "true";
    const searchQuery = params.get('searchQuery') || undefined;
    const artistName = params.get('artistName') || undefined;
    const artistId = params.get('artistId') ? parseInt(params.get('artistId')!) : undefined;
    const minBid = params.get('minBid') ? parseInt(params.get('minBid')!) : undefined;
    const maxBid = params.get('maxBid') ? parseInt(params.get('maxBid')!) : undefined;
    const minEndTime = params.get('minEndTime') ? parseInt(params.get('minEndTime')!) : undefined;
    const maxEndTime = params.get('maxEndTime') ? parseInt(params.get('maxEndTime')!) : undefined;

    const filterOptions = { 
        artistId,
        withArtist, 
        withRelatedWorks,
        searchQuery, 
        artistName, 
        minBid, 
        maxBid, 
        minEndTime, 
        maxEndTime 
    };

    const allArtworks = await getArtworks(undefined, filterOptions);
    const paginatedArtworks = await getArtworks(undefined, { ...filterOptions, page, limit });
   
    return NextResponse.json({
        artworks: paginatedArtworks,
        totalArtworks: allArtworks.length,
        totalPages: Math.ceil(allArtworks.length / limit),
        currentPage: page,
        limit: limit,
    });
}

export async function POST(request: NextRequest) {
    const [session, authError] = await getSession();
    if (authError || !session) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (session.roleId !== Roles.Artist) {
        return NextResponse.json(
            { success: false, error: "Forbidden: Only registered artists can list artworks" },
            { status: 403 }
        );
    }

    const validation = await validateRequest(request, createArtworkSchema);
    if (!validation.success) {
        return validation.response;
    }

    const {
        title,
        description,
        imageUrl,
        startingBid,
        durationDays,
        medium,
        dimensions,
        year,
    } = validation.data;

    const auctionEndTime = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const artwork = await createArtwork(
        title,
        description || "",
        session.userId,
        imageUrl,
        startingBid,
        auctionEndTime,
        medium,
        dimensions,
        year
    );

    if (!artwork) {
        return NextResponse.json(
            { success: false, error: "Failed to create artwork listing" },
            { status: 500 }
        );
    }

    await logAuditEvent(request, {
        actorId: session.userId,
        actorType: "artist",
        action: "artwork.create",
        resourceType: "artwork",
        resourceId: String(artwork.id),
        status: "success",
        metadata: { title, startingBid, medium, auctionEndTime: auctionEndTime.toISOString() },
    });

    return NextResponse.json(
        {
            success: true,
            artwork,
            message: "Artwork listing created successfully",
        },
        { status: 201 }
    );
}
