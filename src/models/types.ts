import { db } from "@/data/db";
import { Bid } from "@/types";

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface ArtworkFilterOptions {
  withBids?: boolean;
  withArtist?: boolean;
  withRelatedWorks?: boolean;
  isAuctionable?: boolean;
  page?: number;
  limit?: number;
  searchQuery?: string;
  artistName?: string;
  minBid?: number;
  maxBid?: number;
  minEndTime?: number;
  maxEndTime?: number;
}

export interface ArtworkDetailsOptions {
  withBids?: boolean;
  withArtist?: boolean;
  withRelatedWorks?: boolean;
}

export interface BidQueryOptions<K extends keyof Bid = keyof Bid> {
  sortBy?: K;
  sortOrder?: "asc" | "desc";
  where?: { columnName: K; value: Bid[K] }[];
}

export interface TransactionQueryOptions {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
