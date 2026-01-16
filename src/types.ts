import { artworks, bids, permissions, roles, transactions, users, activities, watchlists } from "./db/schema";

export enum Roles {
    Admin,
    Artist,
    Collector
}

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;

export type Bid = typeof bids.$inferSelect;
export type NewBid = typeof bids.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Role = typeof roles.$inferSelect;

export type Permission = typeof permissions.$inferSelect;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;


export interface CollectorProfile {
    name: string;
    username: string;
    firstName: string;
    surname: string;
    bio: string;
    email: string;
    wallet: number;
    profilePicture: string;
    socialMedia: {
        twitter?: string;
        instagram?: string;
    };
    stats: {
        artworksOwned: number;
        totalSpent: number;
        auctionsWon: number;
        watchlistItems: number;
        activeBids: number;
        avgBidAmount: number;
        memberSince: number; // In years
        successRate: number; // Percentage
    };
    ownedArtworks: Artwork[];
    watchlist: Artwork[];
    activity: Activity[];
}
