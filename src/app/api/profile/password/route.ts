import { hashValue, getUser, updateUser } from "@/data/queries";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import bcrypt from "bcrypt";
import { validateRequest, passwordChangeSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const [session, authError] = await getSession();

  if (authError || !session) {
    return NextResponse.json(
      { success: false, error: authError || "User unauthorized" },
      { status: 401 }
    );
  }

  const validation = await validateRequest(request, passwordChangeSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { current_password, new_password } = validation.data;
  const userId = session.userId;

  try {
    const user = await getUser(userId);

    // FIXED: Properly verify current password using !bcrypt.compare
    if (!user || !(await bcrypt.compare(current_password, user.password))) {
      return NextResponse.json(
        { success: false, error: "Invalid current password" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashValue(new_password);
    const updatedUser = await updateUser(userId, { password: hashedPassword });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Password update error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while updating password" },
      { status: 500 }
    );
  }
}
