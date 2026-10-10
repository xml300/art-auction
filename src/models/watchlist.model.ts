import { db } from "@/data/db";
import { watchlists, artworks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const Watchlists = {
  get: async (userId: number) => {
    const watchlistItems = await db
      .select()
      .from(watchlists)
      .leftJoin(artworks, eq(watchlists.artworkId, artworks.id))
      .where(eq(watchlists.userId, userId));
    return watchlistItems;
  },
};
