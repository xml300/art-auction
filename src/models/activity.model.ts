import { db } from "@/data/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Activity } from "@/types";

export const Activities = {
  get: async (userId: number): Promise<Activity[]> => {
    const userActivities: Activity[] = await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId));
    return userActivities;
  },
};
