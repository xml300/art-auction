import { getUsersProfile, hashValue, updateUser } from "@/data/db";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { writeFileSync } from "fs";

export async function GET() {
    const [payload, error] = await getSession();

    if (error || payload === null) {
        const response = NextResponse.json({});
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const user = getUsersProfile(payload.userId);
    if (user) {
        return NextResponse.json(user);
    }
    const response = NextResponse.json({});
    response.cookies.set('errors', 'User not found', {
        maxAge: 10,
        path: '/',
    });
    return response;
}

async function saveFile(file: File){
    if(file.size <= 0){
        return "";
    }
    const filename = hashValue(Array.from({length: 10}).map((_) => Math.random() * 500 + 100).join('')) + file.name.split('.').at(-1);
    writeFileSync(`./public/uploads/${filename}`, Buffer.from(await file.arrayBuffer()));
    return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
    const [payload, error] = await getSession();
    const redirectURL = new URL('/dashboard/settings', request.nextUrl.origin);

    if (error || payload === null) {
        const response = NextResponse.redirect(redirectURL);
        response.cookies.set('errors', error || "", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }

    const userId = payload.userId;
    const body = await request.formData();
    const profilePicture = body.get('profile_picture') as unknown as File;
    const surname = body.get('surname')?.toString();
    const firstName = body.get('first_name')?.toString();
    const userName = body.get('username')?.toString();
    const email = body.get('email')?.toString();
    const bio = body.get('about_yout')?.toString();

    const savedPath = await saveFile(profilePicture);


    const updatedUser = updateUser(userId, [
        { columnName: 'profilePicture', value: savedPath },
        { columnName: 'surname', value: surname },
        { columnName: 'firstName', value: firstName },
        { columnName: 'username', value: userName },
        { columnName: 'email', value: email },
        { columnName: 'bio', value: bio }
    ]);

    if (updatedUser) {
        const response = NextResponse.redirect(redirectURL);
        response.cookies.set('success', "Profile updated successfully", {
            maxAge: 10,
            path: '/',
        });
        return response;
    }
    const response = NextResponse.redirect(redirectURL);
    response.cookies.set('errors', "User not found or update failed", {
        maxAge: 10,
        path: '/',
    });
    return response;
}
