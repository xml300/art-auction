import { getUserRole, getUsers } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { validateRequest, loginSchema } from "@/lib/validation";
import { logAuditEvent } from "@/lib/audit";
import { Roles } from "@/enums";

export async function POST(request: NextRequest) {
  const validation = await validateRequest(request, loginSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { username, password } = validation.data;

  try {
    const matchedUsers = await getUsers([
      { columnName: "username", comparator: "=", value: username },
    ]);
    const user = matchedUsers.at(0);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await logAuditEvent(request, {
        actorId: user?.id ?? null,
        actorType: "guest",
        action: "auth.login.failed",
        resourceType: "user",
        resourceId: username,
        status: "failure",
        metadata: { attemptedUsername: username, reason: "invalid_credentials" },
      });

      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    let roleName = "Collector";
    try {
      const role = await getUserRole(user.id);
      roleName = role.name;
    } catch {
      roleName = user.roleId === Roles.Artist ? "Artist" : "Collector";
    }

    await logAuditEvent(request, {
      actorId: user.id,
      actorType: roleName.toLowerCase(),
      action: "auth.login.success",
      resourceType: "user",
      resourceId: String(user.id),
      status: "success",
      metadata: { roleName },
    });

    const redirectPath = roleName === "Artist" ? "/artist-dashboard" : "/dashboard";

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

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      redirectUrl: redirectPath,
      user: {
        userId: user.id,
        username: user.username,
        roleId: user.roleId,
        roleName,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
