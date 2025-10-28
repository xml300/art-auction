import { getUserRole, getUsersQuery, hashValue } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";



export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (!username || !password) {
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.cookies.set('errors', 'Username and password are required.', {
            maxAge: 10, 
            path: '/',
        });
        return response;
    }

    const user = getUsersQuery([
        { columnName: 'username', comparator: '=', value: username },
        { columnName: 'password', comparator: '=', value: hashValue(password) }
    ])[0];

    if (!user) {
        const response = NextResponse.redirect(new URL('/auth?type=login', request.url));
        response.cookies.set('errors', 'Invalid username or password.', {
            maxAge: 10, 
            path: '/',
        });
        return response;
    }

    const role = getUserRole(user.roleId);
    const path = role.name === 'Artist' ? '/artist-dashboard' : '/dashboard'; 
    const response = NextResponse.redirect(new URL(path, request.url));
    response.cookies.set('auth', jwt.sign({ userId: user.id, roleId: user.roleId, username: user.username }, process.env.JWT_SECRET_KEY || "your_jwt_secret"), {
        maxAge: 1 * 60 * 60, 
        httpOnly: true,
        path: '/'
    });
    return response;
}
