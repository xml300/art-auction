import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const response =  NextResponse.redirect(new URL("/auth", request.nextUrl.origin));
    response.cookies.delete("auth");
    return response;
}