import { createNotification } from "@/data/queries";
import { sendPushToUser } from "@/lib/webpush";
import { NotificationType, Notification } from "@/types";

export interface NotifyUserOptions {
  userId: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels?: Array<"in_app" | "push">;
}

export interface NotifyUserResult {
  inAppNotification?: Notification;
  pushDeliveredCount: number;
}

/**
 * Unified notification dispatcher across in-app center and native Web Push.
 */
export async function notifyUser({
  userId,
  type,
  title,
  body,
  data = {},
  channels = ["in_app", "push"],
}: NotifyUserOptions): Promise<NotifyUserResult> {
  let inAppNotification: Notification | undefined = undefined;
  let pushDeliveredCount = 0;

  // 1. In-App Notification (Database)
  if (channels.includes("in_app")) {
    try {
      inAppNotification = await createNotification(
        userId,
        type,
        title,
        body,
        data
      );
    } catch (err) {
      console.error(`Failed to create in-app notification for user ${userId}:`, err);
    }
  }

  // 2. Native Web Push (VAPID)
  if (channels.includes("push")) {
    try {
      pushDeliveredCount = await sendPushToUser(userId, {
        title,
        body,
        icon: "/logo.png",
        badge: "/logo.png",
        data: {
          type,
          ...data,
        },
      });
    } catch (err) {
      console.error(`Failed to send web push to user ${userId}:`, err);
    }
  }

  return { inAppNotification, pushDeliveredCount };
}
