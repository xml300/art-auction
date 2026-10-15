import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { getNotifications, getUnreadNotificationsCount } from "@/data/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const [session] = await getSession();
  const userId = session!.userId;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;

      const sendData = async () => {
        if (isClosed) return;
        try {
          const [items, count] = await Promise.all([
            getNotifications(userId, { limit: 10 }),
            getUnreadNotificationsCount(userId),
          ]);
          const payload = JSON.stringify({ notifications: items, unreadCount: count });
          controller.enqueue(encoder.encode(`event: update\ndata: ${payload}\n\n`));
        } catch {
          // ignore transient poll errors
        }
      };

      // Send initial snapshot
      await sendData();

      // Poll periodically for live updates
      const interval = setInterval(async () => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }
        await sendData();
      }, 10000);

      // Heartbeat every 15s to keep connection alive
      const pingInterval = setInterval(() => {
        if (isClosed) {
          clearInterval(pingInterval);
          return;
        }
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          isClosed = true;
          clearInterval(pingInterval);
          clearInterval(interval);
        }
      }, 15000);

      request.signal.addEventListener("abort", () => {
        isClosed = true;
        clearInterval(interval);
        clearInterval(pingInterval);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
