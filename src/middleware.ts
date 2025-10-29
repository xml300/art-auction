import { NextResponse, NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
    const authCookie = request.cookies.get("auth");
    if(!authCookie){
        return NextResponse.redirect(new URL("/auth", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*','/artist-dashboard/:path*'],
}
