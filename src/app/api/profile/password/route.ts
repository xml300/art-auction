import { hashValue, updatePassword, getUsers } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/types";
import { getSession } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
    const [payload, error] = await getSession();
    const redirectURL = new URL('/dashboard/settings', process.env.SITE_BASE_URL || "");

    if (error || payload === null) {
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const userId = payload.userId;
    const body = await request.formData();
    const currentPassword = body.get('current_password')?.toString() || '';
    const newPassword = body.get('new_password')?.toString() || '';

    const user = await getUsers(userId) as User;

    if (!user || await bcrypt.compare(currentPassword, user.password)) {
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', 'Invalid current password', {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const updatedUser = await updatePassword(userId, newPassword);

    if (updatedUser) {
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('success', "Password updated successfully", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }
    const response = NextResponse.redirect(redirectURL, {status: 303});
    response.cookies.set('errors', "User not found or password update failed", {
        maxAge: 10,
        path: '/',
    });
    return response;
}
