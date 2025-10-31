import { getUserRole, getUsersQuery, hashValue } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";



export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    const Url = process.env.SITE_BASE_URL || "";


    if (!username || !password) {
        const response = NextResponse.redirect(new URL('/auth', Url));
        response.cookies.set('errors', 'Username and password are required.', {
            maxAge: 10, 
            path: '/',
        });
        return response;
    }

    const user = (await getUsersQuery([
        { columnName: 'username', comparator: '=', value: username },
        { columnName: 'password', comparator: '=', value: hashValue(password) }
    ]))[0];

    if (!user) {
        const response = NextResponse.redirect(new URL('/auth', Url));
        response.cookies.set('errors', 'Invalid username or password.', {
            maxAge: 10, 
            path: '/',
        });
        return response;
    }

    const role = await getUserRole(user.id);
    const path = role.name === 'Artist' ? '/artist-dashboard' : '/dashboard';
    const response = NextResponse.redirect(new URL(path, Url));
    response.cookies.set('auth', jwt.sign({ userId: user.id, roleId: user.roleId, username: user.username }, process.env.JWT_SECRET_KEY || "your_jwt_secret"), {
        maxAge: 1 * 60 * 60, 
        httpOnly: true,
        path: '/'
    });
    return response;
}
