import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const response =  NextResponse.redirect(new URL("/auth","https://art-auction--hosting-72ffb.us-east4.hosted.app/"));
    response.cookies.delete("auth");
    return response;
}