import { createUser, getUsers } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { validateRequest, registerSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";
import { Roles } from "@/enums";

export async function POST(request: NextRequest) {
  const validation = await validateRequest(request, registerSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { username, email, password, accountType } = validation.data;

  try {
    // Check if username is already taken
    const existingByUsername = await getUsers([
      { columnName: "username", comparator: "=", value: username },
    ]);
    if (existingByUsername.length > 0) {
      return NextResponse.json(
        { success: false, error: "Username is already taken." },
        { status: 409 }
      );
    }

    // Check if email is already taken
    const existingByEmail = await getUsers([
      { columnName: "email", comparator: "=", value: email },
    ]);
    if (existingByEmail.length > 0) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = await createUser(email, username, password, accountType);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Failed to create account." },
        { status: 500 }
      );
    }

    await logAuditEvent(request, {
      actorId: user.id,
      actorType: accountType === Roles.Artist ? "artist" : "collector",
      action: "auth.register.success",
      resourceType: "user",
      resourceId: String(user.id),
      status: "success",
      metadata: { username: user.username, email: user.email, roleId: user.roleId },
    });

    const redirectPath = accountType === Roles.Artist ? "/artist-dashboard" : "/dashboard";

    const accessToken = await signAccessToken({
      userId: user.id,
      roleId: user.roleId,
      username: user.username,
      profilePicture: user.profilePicture,
    });
    const refreshToken = await signRefreshToken({
      userId: user.id,
      roleId: user.roleId,
      username: user.username,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Account registered successfully",
        redirectUrl: redirectPath,
        user: {
          userId: user.id,
          username: user.username,
          email: user.email,
          roleId: user.roleId,
        },
      },
      { status: 201 }
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error: unknown) {
    console.error("Register route error:", error);
    const pgError = error as { code?: string; detail?: string; message?: string };
    if (pgError.code === "23505") {
      const detail = (pgError.detail || pgError.message || "").toLowerCase();
      if (detail.includes("email")) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      if (detail.includes("username")) {
        return NextResponse.json(
          { success: false, error: "Username is already taken." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Username or email is already taken." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
