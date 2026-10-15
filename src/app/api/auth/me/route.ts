import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUser, getUserRole } from "@/data/queries";
import { Roles } from "@/enums";

export const dynamic = "force-dynamic";

export async function GET() {
  const [session] = await getSession();

  try {
    const user = await getUser(session!.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    let roleName = "Collector";
    try {
      const role = await getUserRole(user.id);
      roleName = role.name;
    } catch {
      roleName = user.roleId === Roles.Admin ? "Admin" : user.roleId === Roles.Artist ? "Artist" : "Collector";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        userId: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId,
        roleName,
        wallet: user.wallet / 100,
        profilePicture: user.profilePicture || null,
        firstName: user.firstName,
        surname: user.surname,
        bio: user.bio,
      },
    });
  } catch (err) {
    console.error("Failed to fetch authenticated user:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
