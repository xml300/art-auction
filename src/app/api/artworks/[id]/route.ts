import { NextRequest, NextResponse } from "next/server";
import { getArtworkById } from "@/data/queries";

export async function GET(request: NextRequest, { params }: {params: Promise<{id: string}>}) {
    const searchParams = request.nextUrl.searchParams;
    const withArtist = searchParams.get('artist') === "true";
    const withRelatedWorks = searchParams.get('relatedWorks') === "true";
    const withBids = searchParams.get('bids') === "true";
    const id = parseInt((await params).id);
    const artwork = await getArtworkById(id, { withArtist, withRelatedWorks, withBids });

    return NextResponse.json({artwork: artwork});
}