import { getArtworks } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const params = request.nextUrl.searchParams;
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');
    const isAuctionable = params.get('auction') === "true";
    const withArtist = params.get('artist') === "true";
    const withRelatedWorks = params.get('relatedWorks') === "true";
    const searchQuery = params.get('searchQuery') || undefined;
    const artistName = params.get('artistName') || undefined;
    const minBid = params.get('minBid') ? parseInt(params.get('minBid')!) : undefined;
    const maxBid = params.get('maxBid') ? parseInt(params.get('maxBid')!) : undefined;
    const minEndTime = params.get('minEndTime') ? parseInt(params.get('minEndTime')!) : undefined;
    const maxEndTime = params.get('maxEndTime') ? parseInt(params.get('maxEndTime')!) : undefined;

    const filterOptions = { 
        withArtist, 
        withRelatedWorks,
        isAuctionable,
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
