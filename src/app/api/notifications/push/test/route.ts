import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { notifyUser } from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function POST() {
  const [session] = await getSession();

  const result = await notifyUser({
    userId: session!.userId,
    type: "system",
    title: "Artsyl Test Notification",
    body: "Your web push alert integration is working properly!",
    data: {
      targetUrl: "/dashboard",
    },
    channels: ["in_app", "push"],
  });

  return NextResponse.json({
    success: true,
    deliveredPushes: result.pushDeliveredCount,
    message:
      result.pushDeliveredCount > 0
        ? `Test notification dispatched to ${result.pushDeliveredCount} device(s).`
        : "In-app notification created. (No active push devices subscribed yet).",
  });
}
