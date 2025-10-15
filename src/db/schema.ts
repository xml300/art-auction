import { pgTable, integer, varchar, timestamp, primaryKey } from "drizzle-orm/pg-core";

const timestamps = {
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
};

const users = pgTable('users', {
    id: integer().primaryKey(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 100}).notNull(),
    password: varchar({length: 255}).notNull(),
    roleId: integer().references(() => roles.id).notNull(),
    ...timestamps
});

const roles = pgTable('roles', {
    id: integer().primaryKey(),
    name: varchar({length: 50}).notNull(),
    description: varchar({length: 255}),
    ...timestamps
});

const permissions = pgTable('permissions', {
    id: integer().primaryKey(),
    name: varchar({length: 50}).notNull(),
    slug: varchar({length: 50}).notNull().unique(),
    description: varchar({length: 255}),
    ...timestamps
});

const rolePermissions = pgTable('role_permissions', {
    roleId: integer().references(() => roles.id).notNull(),
    permissionId: integer().references(() => permissions.id).notNull(),
    ...timestamps
}, (table) => ({
    pk: primaryKey(table.roleId, table.permissionId)
}));

const artworks = pgTable('artworks', {
    id: integer().primaryKey(),
    title: varchar({length: 255}).notNull(),
    description: varchar({length: 1000}),
    imageUrl: varchar({length: 500}).notNull(),
    startingBid: integer().notNull(),
    currentBid: integer().default(0),
    auctionEndTime: timestamp().notNull(),
    artistId: integer().references(() => users.id).notNull(),
    ...timestamps
});

const transactions = pgTable('transactions', {
    id: integer().primaryKey(),
    artworkId: integer().references(() => artworks.id).notNull(),
    buyerId: integer().references(() => users.id).notNull(),
    finalAmount: integer().notNull(),
    description: varchar({length: 1000}),
    transactionTime: timestamp().defaultNow(),
    ...timestamps
});

const bids = pgTable('bids', {
    id: integer().primaryKey(),
    artworkId: integer().references(() => artworks.id).notNull(),
    bidderId: integer().references(() => users.id).notNull(),
    bidAmount: integer().notNull(),
    bidTime: timestamp().defaultNow(),
    ...timestamps
});

export { users, roles, permissions, rolePermissions, artworks, transactions, bids };