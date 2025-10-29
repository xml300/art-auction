import * as jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface Payload {
    userId: number;
    roleId: number; 
    username: string;
    iat: number;
}

export async function getSession(): Promise<[ Payload | null, string | null]> {
    const authCookie = (await cookies()).get("auth")?.value || "";
    try {
        const payload = jwt.verify(authCookie, process.env.JWT_SECRET_KEY || '') as Payload;
        return [payload, null];
    } catch (error) {
        if ((error as jwt.TokenExpiredError).name === 'TokenExpiredError') {
            console.error('Token has expired!')
        } else if ((error as jwt.JsonWebTokenError).name === 'JsonWebTokenError') {
            console.error('Token is invalid!');
        }
        return  [null, 'User unauthorized'];
    }
}
