import { createUser, getUsers } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const accountType = formData.get('accountType')?.toString();
    const username = formData.get('username')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const redirectUrl = new URL('/auth', request.url);

    if (!accountType || !username || !email || !password) {
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'All fields are required.', {
            maxAge: 10, 
            path: '/',
        });
        return response;
    }

    try {
        const userType = parseInt(accountType);
        
        const existingUsers = await getUsers([
            { columnName: 'username', comparator: '=', value: username },
        ]);
        if (existingUsers.length > 0) {
            const response = NextResponse.redirect(redirectUrl, {status: 303});
            response.cookies.set('errors', 'Username already taken.', {
                maxAge: 10,
                path: '/',
            });
            return response;
        }

        const user = await createUser(email, username, password, userType);

        if(!user){
            const response = NextResponse.redirect(redirectUrl, {status: 303});
            response.cookies.set('errors', 'Failed to create account.', {
                maxAge: 10,
                path: '/',
            });
            return response;
        }

        const route = userType === 1 ? '/artist-dashboard' : '/dashboard';
        const response = NextResponse.redirect(new URL(route, process.env.SITE_BASE_URL || ""), {status: 303});
        response.cookies.set('auth', jwt.sign({ userId: user.id, roleId: user.roleId, username: user.username, profilePicture: user.profilePicture }, process.env.JWT_SECRET_KEY || "your_jwt_secret"), {
            maxAge: 1 * 60 * 60, 
            httpOnly: true,
            path: '/'
        });
        return response;
    } catch (error: unknown) {
        console.error(error);
        const response = NextResponse.redirect(redirectUrl, {status: 303});
        response.cookies.set('errors', 'Failed to create account.', {
            maxAge: 10,
            path: '/',
        });
        return response;
    }
}
