import webpush from "web-push";
import { getPushSubscriptionsByUser, deletePushSubscriptionByEndpoint } from "@/data/queries";
import { DbPushSubscription } from "@/types";

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || "mailto:admin@artsyl.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

export async function sendPushNotification(
  subscription: DbPushSubscription,
  payload: PushPayload
): Promise<boolean> {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.p256dh,
      auth: subscription.auth,
    },
  };

  const payloadString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || "/logo.png",
    badge: payload.badge || "/logo.png",
    data: payload.data || {},
  });

  try {
    await webpush.sendNotification(pushSubscription, payloadString);
    return true;
  } catch (error: any) {
    // 410 Gone or 404 Not Found indicates client unsubscribed / expired
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log(`Pruning expired push subscription: ${subscription.endpoint}`);
      await deletePushSubscriptionByEndpoint(subscription.endpoint);
    } else {
      console.error("Web Push delivery failed:", error?.message || error);
    }
    return false;
  }
}

export async function sendPushToUser(
  userId: number,
  payload: PushPayload
): Promise<number> {
  const subscriptions = await getPushSubscriptionsByUser(userId);
  if (subscriptions.length === 0) return 0;

  const results = await Promise.all(
    subscriptions.map((sub) => sendPushNotification(sub, payload))
  );

  return results.filter(Boolean).length;
}
