import { db } from "@/data/db";
import { activities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Activity, NewActivity } from "@/types";
import { Tx } from "./types";

export interface CreateActivityInput {
  userId: number;
  type: string;
  artworkId?: number | null;
  artworkTitle?: string | null;
  amount?: number | null;
}

export const Activities = {
  get: async (
    userId: number,
    options?: { limit?: number; offset?: number }
  ): Promise<Activity[]> => {
    let query = db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt))
      .$dynamic();

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return await query;
  },

  create: async (
    input: CreateActivityInput | number,
    typeOrTx?: string | Tx,
    artworkTitle?: string | null,
    amount?: number | null,
    txArg?: Tx,
    artworkIdArg?: number | null
  ): Promise<Activity> => {
    let activityData: NewActivity;
    let client: Tx | typeof db = db;

    if (typeof input === "object") {
      activityData = {
        userId: input.userId,
        type: input.type,
        artworkId: input.artworkId ?? null,
        artworkTitle: input.artworkTitle ?? null,
        amount: input.amount ?? null,
      };
      if (typeOrTx && typeof typeOrTx !== "string") {
        client = typeOrTx;
      }
    } else {
      activityData = {
        userId: input,
        type: typeof typeOrTx === "string" ? typeOrTx : "",
        artworkTitle: artworkTitle ?? null,
        amount: amount ?? null,
        artworkId: artworkIdArg ?? null,
      };
      if (txArg) {
        client = txArg;
      }
    }

    const [newActivity] = await client
      .insert(activities)
      .values(activityData)
      .returning();

    return newActivity;
  },
};
