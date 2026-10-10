import { artworks, bids, permissions, roles, transactions, users, activities, watchlists, notifications, transactionTypeEnum, transactionStatusEnum, notificationTypeEnum } from "./db/schema";

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
export type TransactionType = typeof transactionTypeEnum.enumValues[number];
export type TransactionStatus = typeof transactionStatusEnum.enumValues[number];

export type Role = typeof roles.$inferSelect;

export type Permission = typeof permissions.$inferSelect;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type NotificationType = typeof notificationTypeEnum.enumValues[number];

export interface ResultType {
    artworks: Artwork;
    users?: User;
    bids?: Bid;
    relatedWorks?: Artwork;
}

export interface JoinedReturnType extends Artwork {
    artist?: User;
    bids?: Bid[];
    relatedWorks?: Artwork[];
}

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
