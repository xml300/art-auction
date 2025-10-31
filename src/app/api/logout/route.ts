import { NextResponse } from "next/server";

export async function POST(){
    const response =  NextResponse.redirect(new URL("/auth",process.env.SITE_BASE_URL || ""), {status: 303});
    response.cookies.delete("auth");
    return response;
}