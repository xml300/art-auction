import { db } from "@/data/db";
import { artworks, bids, users } from "@/db/schema";
import { eq, gte, isNull, like, lte, or, asc, and } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { Artwork, ResultType, JoinedReturnType } from "@/types";
import { Tx, ArtworkFilterOptions, ArtworkDetailsOptions } from "./types";

export const Artworks = {
  create: async (
    title: string,
    description: string,
    artistId: number,
    imageUrl: string,
    startingBid: number,
    auctionEndTime: Date,
    medium: string,
    dimensions: string,
    year: number
  ): Promise<Artwork | undefined> => {
    const artworkData = {
      title,
      description,
      artistId,
      imageUrl,
      startingBid,
      currentBid: 0,
      auctionEndTime,
      ownerId: null,
      medium,
      dimensions,
      year,
    };
    const [artwork] = await db.insert(artworks).values(artworkData).returning();
    return artwork;
  },

  update: async <K extends keyof Artwork>(
    id: number,
    update: { [key in K]: Artwork[K] },
    tx?: Tx
  ) => {
    const [updatedArtwork] = tx
      ? await tx.update(artworks).set(update).where(eq(artworks.id, id)).returning()
      : await db.update(artworks).set(update).where(eq(artworks.id, id)).returning();
    return updatedArtwork;
  },

  getById: async (
    id: number,
    options?: ArtworkDetailsOptions
  ): Promise<JoinedReturnType | Artwork | undefined> => {
    const query = db.select().from(artworks).where(eq(artworks.id, id));
    if (!options?.withBids && !options?.withArtist && !options?.withRelatedWorks) {
      const [art] = await query;
      return art;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = query;
    if (options?.withRelatedWorks) {
      const relatedWorks = alias(artworks, "relatedWorks");
      q = q.leftJoin(relatedWorks, eq(relatedWorks.artistId, artworks.artistId));
    }
    if (options?.withArtist) {
      q = q.leftJoin(users, eq(users.id, artworks.artistId));
    }
    if (options?.withBids) {
      q = q.leftJoin(bids, eq(bids.artworkId, artworks.id));
    }

    const rows = (await q) as ResultType[];
    if (!rows || rows.length === 0) return undefined;

    const result = rows.reduce((acc: JoinedReturnType | null, row: ResultType) => {
      const artwork = row.artworks;
      const bid = row.bids;
      const relatedWork = row.relatedWorks;
      const artist = row.users;

      if (!acc) {
        acc = { ...artwork };
        if (options?.withArtist) acc.artist = artist;
        if (options?.withBids) acc.bids = bid ? [bid] : [];
        if (options?.withRelatedWorks) acc.relatedWorks = relatedWork ? [relatedWork] : [];
      } else if (options?.withBids && bid) {
        acc.bids?.push(bid);
      } else if (options?.withRelatedWorks && relatedWork && acc.relatedWorks!.length < 5) {
        acc.relatedWorks?.push(relatedWork);
      }
      return acc;
    }, null);

    return result ?? undefined;
  },

  getAll: async (
    userId?: number,
    options?: ArtworkFilterOptions
  ): Promise<Artwork[]> => {
    const query = db.select().from(artworks).orderBy(asc(artworks.title));
    let limit = 150;
    let offset = 0;

    const conditions = [];
    if (userId) {
      conditions.push(eq(artworks.ownerId, userId));
    } else {
      conditions.push(isNull(artworks.ownerId));
    }

    if (options?.isAuctionable) {
      conditions.push(gte(artworks.auctionEndTime, new Date()));
    }

    if (options?.minBid) {
      conditions.push(
        or(gte(artworks.currentBid, options.minBid), gte(artworks.startingBid, options.minBid))
      );
    }

    if (options?.maxBid) {
      conditions.push(
        or(lte(artworks.currentBid, options.maxBid), lte(artworks.startingBid, options.maxBid))
      );
    }

    if (options?.minEndTime) {
      conditions.push(gte(artworks.auctionEndTime, new Date(options.minEndTime)));
    }

    if (options?.maxEndTime) {
      conditions.push(lte(artworks.auctionEndTime, new Date(options.maxEndTime)));
    }

    if (options?.page && options?.limit) {
      limit = options.limit;
      offset = (options.page - 1) * options.limit;
    }

    if (!options?.withBids && !options?.withArtist && !options?.withRelatedWorks) {
      return await query.where(and(...conditions)).limit(limit).offset(offset);
    }

    if (options?.withArtist) {
      if (options?.artistName) {
        conditions.push(like(users.username, `%${options.artistName}%`));
      }
      if (options?.searchQuery) {
        conditions.push(
          or(
            like(artworks.title, `%${options.searchQuery}%`),
            like(users.username, `%${options.searchQuery}%`)
          )
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q: any = query;
    if (options.withBids) {
      q = q.leftJoin(bids, eq(bids.artworkId, artworks.id));
    }
    if (options.withArtist) {
      q = q.leftJoin(users, eq(users.id, artworks.artistId));
    }
    if (options.withRelatedWorks) {
      q = q.leftJoin(artworks, eq(artworks.artistId, users.id));
    }
    const rows = (await q.where(and(...conditions))) as ResultType[];

    const aggregated = rows.reduce(
      (acc: Map<number, JoinedReturnType>, row: ResultType) => {
        const artwork = row.artworks;
        const bid = row.bids;
        const artist = row.users;

        if (!acc.has(artwork.id)) {
          const artworkItem: JoinedReturnType = { ...artwork };
          if (options.withArtist) artworkItem.artist = artist;
          if (options.withBids) artworkItem.bids = bid ? [bid] : [];
          acc.set(artwork.id, artworkItem);
        } else if (options.withBids && bid) {
          acc.get(artwork.id)!.bids!.push(bid);
        }
        return acc;
      },
      new Map<number, JoinedReturnType>()
    );

    const artworks_: Artwork[] = Array.from(aggregated.values());
    return artworks_.slice(offset, offset + limit);
  },
};
