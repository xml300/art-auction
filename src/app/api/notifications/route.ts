import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/data/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const [session] = await getSession();

  const { searchParams } = request.nextUrl;
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const [items, unreadCount] = await Promise.all([
      getNotifications(session!.userId, { unreadOnly, limit, offset }),
      getUnreadNotificationsCount(session!.userId),
    ]);

    return NextResponse.json({
      notifications: items,
      unreadCount,
    });
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const [session] = await getSession();

  const { searchParams } = request.nextUrl;
  const markAll = searchParams.get("all") === "true";

  try {
    if (markAll) {
      await markAllNotificationsAsRead(session!.userId);
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    const body = await request.json().catch(() => ({}));
    const id = body.id ? parseInt(body.id) : null;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    const updated = await markNotificationAsRead(id, session!.userId);
    if (!updated) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification: updated });
  } catch (err) {
    console.error("Failed to update notification:", err);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const [session] = await getSession();

  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id ? parseInt(body.id) : null;

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
    }

    const deleted = await deleteNotification(id, session!.userId);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Failed to delete notification:", err);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
