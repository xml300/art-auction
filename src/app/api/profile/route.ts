import { getUsersProfile } from "@/data/db";
import { NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    const authCookie = request.cookies.get("auth")?.value || "";
    try {
        const payload = jwt.verify(authCookie, process.env.JWT_SECRET_KEY || '') as jwt.JwtPayload;
        console.log('Token is valid!');
        console.log('User data:', payload);

        const user = getUsersProfile(payload.id);
        if(user){
            return NextResponse.json(user);
        }
        return NextResponse.json({message: 'User not found'}, {status: 400});
    } catch (error) {
        
        if ((error as jwt.TokenExpiredError).name === 'TokenExpiredError') {
            console.error('Token has expired!')
        } else if ((error as jwt.JsonWebTokenError).name === 'JsonWebTokenError') {
            console.error('Token is invalid!');
        }
        return NextResponse.json({message: 'User unauthorized'}, {status: 401})
    }
}