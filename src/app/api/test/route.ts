import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = NextResponse.json({message: "Hello", request: new URL("/", request.url)});
    return response;
}