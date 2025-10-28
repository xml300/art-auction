import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    request.cookies.delete("auth");
    return NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
}