import { getUsersProfile, updateUser } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; 
import { writeFile } from "@/lib/fileSys";

export const dynamic = "force-dynamic";

export async function GET() {
    const [session] = await getSession();
    const user = await getUsersProfile(session!.userId);
    if (user) {
        return NextResponse.json(user);
    }

    return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
    );
}

async function saveFile(file: File, userId: number){
    if(!file || file.size <= 0){
        return "";
    }
    const filePath = `uploads/${userId}/`;
    const path = await writeFile(file, filePath, userId);
    if(!path){
        return "";
    }
    return path;
}

export async function POST(request: NextRequest) {
    const [session] = await getSession();
    const isJson = request.headers.get("accept")?.includes("application/json");
    const redirectURL = new URL('/dashboard/settings', request.url);
    const userId = session!.userId;
    const body = await request.formData();
    const profilePicture = body.get('profile_picture') as unknown as File;

    const surname = body.get('surname')?.toString();
    const firstName = body.get('first_name')?.toString();
    const userName = body.get('username')?.toString();
    const email = body.get('email')?.toString();
    const bio = body.get('about_you')?.toString();

    if(!surname || !firstName || !userName || !email || !bio){
        if (isJson) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('errors', 'All fields are required', { maxAge: 10, path: '/' });
        return response;
    }

    const savedPath = profilePicture instanceof File && profilePicture.size > 0 
        ? await saveFile(profilePicture, userId) 
        : undefined;

    const updatedUser = await updateUser(userId, {
        profilePicture: savedPath || null,
        surname: surname,
        firstName: firstName,
        username: userName,
        email: email,
        bio: bio
    });

    if (updatedUser) {
        if (isJson) {
            return NextResponse.json({ success: true, message: "Profile updated successfully" });
        }
        const response = NextResponse.redirect(redirectURL, {status: 303});
        response.cookies.set('success', "Profile updated successfully", { maxAge: 10, path: '/' });
        return response;
    }

    if (isJson) {
        return NextResponse.json({ success: false, error: "User not found or update failed" }, { status: 500 });
    }
    const response = NextResponse.redirect(redirectURL, {status: 303});
    response.cookies.set('errors', "User not found or update failed", { maxAge: 10, path: '/' });
    return response;
}
