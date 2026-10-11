import { db } from "@/data/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Activity } from "@/types";

import { Tx } from "./types";

export const Activities = {
  get: async (userId: number): Promise<Activity[]> => {
    const userActivities: Activity[] = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId));
    return userActivities;
  },

  create: async (
    userId: number,
    type: string,
    artworkTitle: string,
    amount: number,
    tx?: Tx
  ): Promise<Activity> => {
    const client = tx || db;
    const [newActivity] = await client
      .insert(activities)
      .values({
        userId,
        type,
        artworkTitle,
        amount,
      })
      .returning();
    return newActivity;
  },
};
