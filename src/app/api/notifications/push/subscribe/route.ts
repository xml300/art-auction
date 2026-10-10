import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  savePushSubscription,
  deletePushSubscriptionByEndpoint,
} from "@/data/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json({ error: "VAPID public key not configured" }, { status: 500 });
  }
  return NextResponse.json({ publicKey });
}

export async function POST(request: NextRequest) {
  const [session, error] = await getSession();
  if (error || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription payload (endpoint and keys required)" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || undefined;

    const saved = await savePushSubscription(
      session.userId,
      endpoint,
      keys.p256dh,
      keys.auth,
      userAgent
    );

    return NextResponse.json({
      success: true,
      subscriptionId: saved.id,
      message: "Push subscription registered successfully",
    });
  } catch (err) {
    console.error("Failed to save push subscription:", err);
    return NextResponse.json(
      { error: "Failed to save push subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const [session, error] = await getSession();
  if (error || !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint string is required to unsubscribe" },
        { status: 400 }
      );
    }

    const deleted = await deletePushSubscriptionByEndpoint(endpoint);
    return NextResponse.json({ success: deleted });
  } catch (err) {
    console.error("Failed to delete push subscription:", err);
    return NextResponse.json(
      { error: "Failed to delete push subscription" },
      { status: 500 }
    );
  }
}
