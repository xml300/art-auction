import { NextRequest, NextResponse } from "next/server";
import { getArtworkById } from "@/data/db";

export async function GET(request: NextRequest, { params }: {params: Promise<{id: string}>}) {
    const searchParams = request.nextUrl.searchParams;
    const withArtist = searchParams.get('artist') === "true";
    const id = parseInt((await params).id);
    const artwork = await getArtworkById(id, { withArtist });

    return NextResponse.json({artwork: artwork});
}