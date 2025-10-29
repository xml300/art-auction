import { createUser, getUsersQuery } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const accountType = formData.get('accountType')?.toString();
    const username = formData.get('username')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!accountType || !username || !email || !password) {
        const response = NextResponse.redirect(new URL('/auth?type=register', request.url));
        response.cookies.set('errors', 'All fields are required.', {
            maxAge: 10, 
            path: '/',
        });
        return response;
    }

    try {
        const userType = parseInt(accountType);
        
        const existingUsers = getUsersQuery([
            { columnName: 'username', comparator: '=', value: username },
        ]);
        if (existingUsers.length > 0) {
            const response = NextResponse.redirect(new URL('/auth', request.url));
            response.cookies.set('errors', 'Username already taken.', {
                maxAge: 10,
                path: '/',
            });
            return response;
        }

        const user = createUser(email, username, password, userType);

        const route = userType === 1 ? '/artist-dashboard' : '/dashboard';
        const response = NextResponse.redirect(new URL(route, request.url));
        response.cookies.set('auth', jwt.sign({ userId: user.id, roleId: user.roleId, username: user.username }, process.env.JWT_SECRET_KEY || "your_jwt_secret"), {
            maxAge: 1 * 60 * 60, 
            httpOnly: true,
            path: '/'
        });
        return response;
    } catch (error: unknown) {
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.cookies.set('errors', (error as Error).message || 'Failed to create account.', {
            maxAge: 10,
            path: '/',
        });
        return response;
    }
}
