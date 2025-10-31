import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
    const authCookie = request.cookies.get("auth");
    if(!authCookie){
        return NextResponse.redirect(new URL("/auth", "https://art-auction--hosting-72ffb.us-east4.hosted.app/"));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*','/artist-dashboard/:path*'],
}
