import { getArtworks } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const params = request.nextUrl.searchParams;
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');
    const withArtist = params.get('artist') === "true";

    const allArtworks = getArtworks(undefined, { withArtist });
    const paginatedArtworks = getArtworks(undefined, { withArtist, page, limit });

    return NextResponse.json({
        artworks: paginatedArtworks,
        totalArtworks: allArtworks.length,
        totalPages: Math.ceil(allArtworks.length / limit),
        currentPage: page,
        limit: limit,
    });
}
