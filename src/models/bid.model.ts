import { db } from "@/data/db";
import { bids } from "@/db/schema";
import { eq, asc, desc, and, getTableColumns, SQLWrapper } from "drizzle-orm";
import { Bid } from "@/types";
import { Tx } from "./types";

export const Bids = {
  get: async <K extends keyof Bid>(
    artworkId: number,
    options?: {
      sortBy?: K;
      sortOrder?: "asc" | "desc";
      where?: { columnName: K; value: Bid[K] }[];
    }
  ) => {
    let query = db.select().from(bids).$dynamic();
    if (options && options.sortBy && options.sortOrder) {
      if (options.sortOrder === "asc") {
        query = query.orderBy(asc(bids[options.sortBy]));
      } else {
        query = query.orderBy(desc(bids[options.sortBy]));
      }
    }

    const conditions = [eq(bids.artworkId, artworkId)];

    if (options && options.where) {
      for (const update of options.where) {
        const columns = getTableColumns(bids);
        const column = columns[update.columnName as keyof typeof columns];
        if (column) {
          conditions.push(eq(column, update.value as SQLWrapper | number | Date));
        }
      }
    }
    return await query.where(and(...conditions));
  },

  getByUser: async <K extends keyof Bid>(
    bidderId: number,
    options?: {
      sortBy?: keyof Bid;
      sortOrder?: "asc" | "desc";
      where?: { columnName: K; value: Bid[K] }[];
    }
  ): Promise<Bid[]> => {
    let query = db.select().from(bids).$dynamic();
    if (options && options.sortBy && options.sortOrder) {
      if (options.sortOrder === "asc") {
        query = query.orderBy(asc(bids[options.sortBy]));
      } else {
        query = query.orderBy(desc(bids[options.sortBy]));
      }
    }

    const conditions = [eq(bids.bidderId, bidderId)];

    if (options && options.where) {
      for (const update of options.where) {
        const columns = getTableColumns(bids);
        const column = columns[update.columnName as keyof typeof columns];
        if (column) {
          conditions.push(eq(column, update.value as SQLWrapper | number | Date));
        }
      }
    }
    return await query.where(and(...conditions));
  },

  create: async (artworkId: number, bidderId: number, bidAmount: number, tx?: Tx) => {
    const bid = {
      artworkId,
      bidderId,
      bidAmount,
      bidTime: new Date(),
    };
    const [newBid] = tx
      ? await tx.insert(bids).values(bid).returning()
      : await db.insert(bids).values(bid).returning();
    return newBid;
  },
};
