import { db } from "@/data/db";
import { notifications } from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { Notification, NewNotification, NotificationType } from "@/types";

export interface NotificationFilterOptions {
  unreadOnly?: boolean;
  limit?: number;
  offset?: number;
}

export const Notifications = {
  create: async (
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, unknown>
  ): Promise<Notification | undefined> => {
    const serializedData = data ? JSON.stringify(data) : null;
    const [created] = await db
      .insert(notifications)
      .values({
        userId,
        type,
        title,
        message,
        data: serializedData,
        isRead: false,
      } as NewNotification)
      .returning();
    return created;
  },

  getAll: async (
    userId: number,
    options?: NotificationFilterOptions
  ): Promise<Notification[]> => {
    const conditions = [eq(notifications.userId, userId)];

    if (options?.unreadOnly) {
      conditions.push(eq(notifications.isRead, false));
    }

    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;

    return await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
      .offset(offset);
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return Number(result?.count ?? 0);
  },

  markAsRead: async (
    id: number,
    userId: number
  ): Promise<Notification | undefined> => {
    const [updated] = await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();

    return updated;
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: new Date(),
      })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  },

  delete: async (id: number, userId: number): Promise<boolean> => {
    const result = await db
      .delete(notifications)
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning();

    return result.length > 0;
  },
};
