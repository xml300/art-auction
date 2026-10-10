import { getUserRole, getUsers } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { validateRequest, loginSchema } from "@/lib/validation";

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
      roleName = user.roleId === 1 ? "Artist" : "Collector";
    }

    const redirectPath = roleName === "Artist" ? "/artist-dashboard" : "/dashboard";

    const accessToken = signAccessToken({
      userId: user.id,
      roleId: user.roleId,
      username: user.username,
      profilePicture: user.profilePicture,
    });
    const refreshToken = signRefreshToken({
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
