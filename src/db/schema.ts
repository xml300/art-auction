import { pgTable, integer, varchar, timestamp, primaryKey, serial, decimal, pgEnum, boolean } from "drizzle-orm/pg-core";


export const transactionStatusEnum = pgEnum('transaction_status_enum', ["pending", "completed", "failed", "refunded"]);
export const transactionTypeEnum = pgEnum('transaction_type_enum', ["deposit", "withdrawal", "bid_payment", "refund", "platform_fee"]);
export const notificationTypeEnum = pgEnum('notification_type_enum', ["outbid", "auction_won", "auction_ending_soon", "deposit_success", "watchlist_reminder", "system"]);

const timestamps = {
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date())
};

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    surname: varchar('surname', { length: 255 }),
    firstName: varchar('first_name', { length: 255 }),
    bio: varchar('bio', { length: 255 }),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    roleId: integer('role_id').references(() => roles.id).notNull(),
    wallet: integer('wallet').default(0).notNull(),
    profilePicture: varchar('profile_picture', { length: 255 }),
    ...timestamps
});

const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    description: varchar('description', { length: 255 }),
    ...timestamps
});

const userRoles = pgTable('user_roles', {
    userId: integer('user_id').references(() => users.id).notNull(),
    roleId: integer('role_id').references(() => roles.id).notNull(),
    ...timestamps
});

const permissions = pgTable('permissions', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 255 }),
    ...timestamps
});

const rolePermissions = pgTable('role_permissions', {
    roleId: integer('role_id').references(() => roles.id).notNull(),
    permissionId: integer('permission_id').references(() => permissions.id).notNull(),
    ...timestamps
}, (table) => ({
    pk: primaryKey(table.roleId, table.permissionId)
}));

const artworks = pgTable('artworks', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }),
    imageUrl: varchar('image_url', { length: 500 }).notNull(),
    startingBid: integer('starting_bid').notNull(),
    currentBid: integer('current_bid').default(0),
    auctionEndTime: timestamp('auction_end_time').notNull(),
    artistId: integer('artist_id').references(() => users.id).notNull(),
    ownerId: integer('owner_id').references(() => users.id),
    medium: varchar('medium', { length: 50 }).notNull(),
    dimensions: varchar('dimensions', { length: 50 }).notNull(),
    year: integer('year').notNull(),
    ...timestamps
});

const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    transRef: varchar('trans_ref', { length: 255 }).notNull().unique(),
    artworkId: integer('artwork_id').references(() => artworks.id),
    userId: integer('user_id').references(() => users.id).notNull(),
    bidId: integer('bid_id').references(() => bids.id),
    sellerId: integer('seller_id').references(() => users.id),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    description: varchar('description', { length: 255 }),
    type: transactionTypeEnum('type').notNull(),
    status: transactionStatusEnum('status').notNull(), 
    currency: varchar('currency', { length: 10 }).notNull().default('USD').notNull(),
    ...timestamps
});

const bids = pgTable('bids', {
    id: serial('id').primaryKey(),
    artworkId: integer('artwork_id').references(() => artworks.id).notNull(),
    bidderId: integer('bidder_id').references(() => users.id).notNull(),
    bidAmount: integer('bid_amount').notNull(),
    bidTime: timestamp('bid_time').defaultNow(),
    ...timestamps
});

const activities = pgTable('activities', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    artworkTitle: varchar('artwork_title', { length: 255 }).notNull(),
    amount: integer('amount').notNull(),
    ...timestamps
});

const watchlists = pgTable('watchlists', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    artworkId: integer('artwork_id').references(() => artworks.id).notNull(),
    ...timestamps
});

const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    type: notificationTypeEnum('type').notNull().default('system'),
    title: varchar('title', { length: 255 }).notNull(),
    message: varchar('message', { length: 1000 }).notNull(),
    data: varchar('data', { length: 1000 }),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at'),
    ...timestamps
});

const pushSubscriptions = pgTable('push_subscriptions', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    endpoint: varchar('endpoint', { length: 1000 }).notNull().unique(),
    p256dh: varchar('p256dh', { length: 500 }).notNull(),
    auth: varchar('auth', { length: 500 }).notNull(),
    userAgent: varchar('user_agent', { length: 500 }),
    ...timestamps
});

export { users, roles, userRoles, permissions, rolePermissions, artworks, transactions, bids, activities, watchlists, notifications, pushSubscriptions };