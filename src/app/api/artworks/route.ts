import { getArtworks } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const params = request.nextUrl.searchParams;
    const artworks = getArtworks();

    if(params.get('artist') === "true"){
        const artworks = getArtworks(undefined, {withArtist: true})
        return NextResponse.json({artworks});
    }
    return NextResponse.json({artworks});
}