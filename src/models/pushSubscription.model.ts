import { db } from "@/data/db";
import { pushSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DbPushSubscription, NewDbPushSubscription } from "@/types";

export const PushSubscriptions = {
  createOrUpdate: async (
    userId: number,
    endpoint: string,
    p256dh: string,
    auth: string,
    userAgent?: string
  ): Promise<DbPushSubscription> => {
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, endpoint));

    if (existing.length > 0) {
      const [updated] = await db
        .update(pushSubscriptions)
        .set({
          userId,
          p256dh,
          auth,
          userAgent: userAgent || null,
          updatedAt: new Date(),
        })
        .where(eq(pushSubscriptions.endpoint, endpoint))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(pushSubscriptions)
      .values({
        userId,
        endpoint,
        p256dh,
        auth,
        userAgent: userAgent || null,
      } as NewDbPushSubscription)
      .returning();
    return created;
  },

  getByUserId: async (userId: number): Promise<DbPushSubscription[]> => {
    return await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));
  },

  deleteByEndpoint: async (endpoint: string): Promise<boolean> => {
    const res = await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, endpoint))
      .returning();
    return res.length > 0;
  },

  deleteByUserId: async (userId: number): Promise<void> => {
    await db
      .delete(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, userId));
  },
};
