import bcrypt from "bcrypt";
import { db } from "./db";
import { activities, artworks, bids, permissions, rolePermissions, roles, transactions, users, watchlists } from "@/db/schema";
import { eq, gte, isNull, like, lte, or, getTableColumns, asc, desc, and, SQLWrapper, gt, lt, sql } from "drizzle-orm";
import { User, Roles, Artwork, Bid, Transaction, Activity, Role, Permission, CollectorProfile, NewTransaction, ResultType, JoinedReturnType, TransactionType, TransactionStatus } from "@/types";
import { alias } from "drizzle-orm/pg-core";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function hashValue(str: string) {
    return await bcrypt.hash(str, 12);
}

export async function createUser(email: string, username: string, password: string, roleId: Roles) {
    const userData = {
        email,
        username,
        password: await hashValue(password),
        roleId,
        wallet: 0
    }
    const [user] = await db.insert(users).values(userData).returning();
    if (!user) {
        return null;
    }
    return user;
};

export async function updateUser<K extends keyof User>(id: number, updates: { [key in K]: User[key] }, tx?: Tx) {
    const [updatedUser] = tx ? await tx.update(users).set(updates).where(eq(users.id, id)).returning() : await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser;
}

export async function getUser(id: number, tx?: Tx) {
    const [user] = tx ? await tx.select().from(users).where(eq(users.id, id)) : await db.select().from(users).where(eq(users.id, id));
    return user;
}

export async function getUsers(where?: { columnName: string, comparator: '=' | '<' | '>', value: string }[]): Promise<User[]> {
    let conditions: SQLWrapper[] = [];

    if (where) {
        conditions = where.map((obj) => {
            const columns = getTableColumns(users);
            const column = columns[obj.columnName as keyof typeof columns];
            if (!column) return null;
            switch (obj.comparator) {
                case "=":
                    return eq(column, obj.value);
                case ">":
                    return gt(column, obj.value);
                case "<":
                    return lt(column, obj.value);
                default:
                    return null;
            }
        }).filter((c) => c !== null);
    }

    const getUsers = await db.select().from(users).where(or(...conditions));
    return getUsers;
}
 

export async function getUsersProfile(userId: number | null) {
    if (!userId) return null;

    const user = await getUser(userId);
    const ownedArtworks = await getArtworks(userId);
    const watchlistRaw = await getWatchlist(userId);
    const watchlist = watchlistRaw.map(w => w.artworks).filter((a): a is Artwork => a !== null);
    const activity = await getActivity(userId);
    const { transactions } = await getTransactions(userId); // Destructure to get the transactions array

    if (!user) {
        return null;
    }

    const userBids = (await db.select({
        numAuctions: sql<number>`COUNT(DISTINCT ${bids.artworkId})`,
        activeBids: sql<number>`COUNT(DISTINCT CASE WHEN ${artworks.auctionEndTime} > ${new Date()} THEN ${bids.artworkId} END)`,
        totalAmount: sql<number>`SUM(${bids.bidAmount})`,
        avgAmount: sql<number>`AVG(${bids.bidAmount})`
    })
    .from(bids)
    .leftJoin(artworks, eq(bids.artworkId, artworks.id))
    .where(eq(bids.bidderId, userId))
    ).at(0);


    const activeBidsCount = userBids?.activeBids;
    const avgBidAmount = userBids?.avgAmount;
    const memberSinceYears = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // const uniqueBiddedArtworks = new Set(userBids.map(bid => bid.artworkId));
    const totalAuctionsParticipated = userBids?.numAuctions || 0;
    const successRate = totalAuctionsParticipated > 0 ? (ownedArtworks.length / totalAuctionsParticipated) * 100 : 0;


    const profileData: CollectorProfile = {
        name: `${user.firstName || ''} ${user.surname || ''}`.trim(),
        username: user.username,
        firstName: user.firstName || "",
        surname: user.surname || "",
        email: user.email,
        profilePicture: user.profilePicture || "/logo.png",
        bio: user.bio || "No bio provided.",
        wallet: user.wallet,
        socialMedia: {
            twitter: "https://twitter.com/janedoe_art",
            instagram: "https://instagram.com/janedoe_collection",
        },
        stats: {
            artworksOwned: ownedArtworks.length,
            totalSpent: transactions.filter((tran: Transaction) => tran.status == 'completed' && tran.description == 'bid').reduce((acc: number, tran: Transaction) => parseFloat(tran.amount) + acc, 0),
            auctionsWon: ownedArtworks.length,
            watchlistItems: watchlist.length,
            activeBids: activeBidsCount || 0,
            avgBidAmount: avgBidAmount || 0,
            memberSince: parseFloat(memberSinceYears.toFixed(1)),
            successRate: parseFloat(successRate.toFixed(1)),
        },
        ownedArtworks: ownedArtworks,
        watchlist: watchlist,
        activity: activity
    };
    return profileData;
}

async function getRole(id: number) {
    const selectedRoles = await db.select().from(roles).leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId)).where(eq(roles.id, id));
    if (selectedRoles.length === 0) return null;

    const role = selectedRoles.reduce((acc: Role & { permissions: number[] } | null, row) => {
        const { roles, role_permissions } = row;
        if (!acc) {
            return { ...roles, permissions: role_permissions ? [role_permissions.permissionId] : [] }
        }
        if (role_permissions) {
            acc.permissions.push(role_permissions.permissionId);
        }
        return acc;
    }, null);

    return role;
}

async function getRolePermissions(id: number) {
    const role = await getRole(id);
    if (!role) return [];

    const permissions = await getPermissions() as Permission[];
    return role.permissions ? role.permissions.map(permId => permissions.find(permission => permission.id === permId) || null) : [];
}

export async function getUserRole(userId: number): Promise<Role> {
    const user = await getUser(userId);
    const role = await getRole(user.roleId) as Role;
    return role;
}

export async function getPermissions(id?: number): Promise<Permission[] | Permission | undefined> {
    const query = db.select().from(permissions);
    if (id) {
        return (await query.where(eq(permissions.id, id))).at(0);
    }
    return await query;
}

export async function getUserPermissions(userId: number) {
    const user = await getUser(userId);
    const permissions = await getRolePermissions(user.roleId);
    return permissions;
}

export async function createArtwork(title: string, description: string, artistId: number, imageUrl: string, startingBid: number, auctionEndTime: Date, medium: string, dimensions: string, year: number): Promise<Artwork | undefined> {
    const artworkData = {
        title,
        description,
        artistId,
        imageUrl,
        startingBid,
        currentBid: 0,
        auctionEndTime: auctionEndTime,
        ownerId: null,
        medium,
        dimensions,
        year,
    }
    const artwork = (await db.insert(artworks).values(artworkData).returning()).at(0);
    return artwork;
}

export async function updateArtwork<K extends keyof Artwork>(id: number, update: { [key in K]: Artwork[K] }, tx?: Tx) {
    const [updatedArtwork] = tx ? await tx.update(artworks).set(update).where(eq(artworks.id, id)).returning() : await db.update(artworks).set(update).where(eq(artworks.id, id)).returning();
    return updatedArtwork;
}

export async function getArtworkById(id: number, options?: { withBids?: boolean, withArtist?: boolean, withRelatedWorks?: boolean }) {
    const query = db.select().from(artworks).where(eq(artworks.id, id));
    if (!options?.withBids && !options?.withArtist && !options?.withRelatedWorks) return await query;

    if (options?.withBids || options?.withArtist || options?.withRelatedWorks) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let q: any = query;
        if (options?.withRelatedWorks) {
            const relatedWorks = alias(artworks, 'relatedWorks');
            q = q.leftJoin(relatedWorks, eq(relatedWorks.artistId, artworks.artistId));
        }
        if (options?.withArtist) {
            q = q.leftJoin(users, eq(users.id, artworks.artistId));
        }
        if (options?.withBids) {
            q = q.leftJoin(bids, eq(bids.artworkId, artworks.id));
        }

        const rows = await q as ResultType[];
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

        return result;
    }
}

//TODO
export async function getArtworks(userId?: number, options?: {
    withBids?: boolean,
    withArtist?: boolean,
    withRelatedWorks?: boolean,
    isAuctionable?: boolean,
    page?: number,
    limit?: number,
    searchQuery?: string,
    artistName?: string,
    minBid?: number,
    maxBid?: number,
    minEndTime?: number,
    maxEndTime?: number
}): Promise<Artwork[]> {
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
        conditions.push(or(gte(artworks.currentBid, options.minBid!), gte(artworks.startingBid, options.minBid!)));
    }

    if (options?.maxBid) {
        conditions.push(or(lte(artworks.currentBid, options.maxBid!), lte(artworks.startingBid, options.maxBid!)));
    }

    if (options?.minEndTime) {
        conditions.push(gte(artworks.auctionEndTime, new Date(options.minEndTime!)));
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
            conditions.push(like(users.username, `%${options.artistName!}%`));
        }
        if (options?.searchQuery) {
            conditions.push(or(like(artworks.title, '%' + options.searchQuery! + '%'), like(users.username, '%' + options.searchQuery! + '%')));
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
    const rows = await q.where(and(...conditions)) as ResultType[];

    const aggregated = rows.reduce((acc: Map<number, JoinedReturnType>, row: ResultType) => {
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
    }, new Map<number, JoinedReturnType>());

    const artworks_: Artwork[] = Array.from(aggregated.values());

    return artworks_.slice(offset, offset + limit);
}

export async function getBids<K extends keyof Bid>(artworkId: number, options?: { sortBy?: K, sortOrder?: 'asc' | 'desc', where?: { columnName: K, value: Bid[K] }[] }) {
    let query = db.select().from(bids).$dynamic();
    if (options && options.sortBy && options.sortOrder) {
        if (options.sortOrder === 'asc') {
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
}

export async function getBidsByUser<K extends keyof Bid>(bidderId: number, options?: { sortBy?: keyof Bid, sortOrder?: 'asc' | 'desc', where?: { columnName: K, value: Bid[K] }[] }): Promise<Bid[]> {
    let query = db.select().from(bids).$dynamic();
    if (options && options.sortBy && options.sortOrder) {
        if (options.sortOrder === 'asc')
            query = query.orderBy(asc(bids[options.sortBy]));
        else
            query = query.orderBy(desc(bids[options.sortBy]));
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
}

export async function createBid(artworkId: number, bidderId: number, bidAmount: number, tx?: Tx) {
    const bid = {
        artworkId,
        bidderId,
        bidAmount,
        bidTime: new Date(),
    };
    const [newBid] = tx ? await tx.insert(bids).values(bid).returning() : await db.insert(bids).values(bid).returning();
    return newBid;
}

export async function updateTransaction<K extends keyof Transaction>(id: number, updates: { [key in K]: Transaction[K] }, tx?: Tx) {
    if (tx) {
        await tx.update(transactions).set(updates).where(eq(transactions.id, id));
    } else {
        await db.update(transactions).set(updates).where(eq(transactions.id, id));
    }
}

export async function getTransactions(userId?: number, options?: { sortBy?: keyof Transaction, sortOrder?: 'asc' | 'desc', page?: number, limit?: number }): Promise<{ transactions: Transaction[], totalCount: number }> {
    let query = db.select().from(transactions).$dynamic();
    let offset = 0;
    let limit = 150;

    if (userId) {
        query = query.where(eq(transactions.userId, userId));
    }
    if (options && options.sortBy) {
        const columns = getTableColumns(transactions);
        const column = columns[options.sortBy as keyof typeof columns];
        if (options.sortOrder === 'asc')
            query = query.orderBy(asc(column));
        else
            query = query.orderBy(desc(column));
    }
    if (options?.page && options?.limit) {
        limit = options.limit;
        offset = (options.page - 1) * options.limit;
    }

    const totalCountRes = await db.select({ count: sql<number>`count(*)` }).from(transactions).where(userId ? eq(transactions.userId, userId) : sql`true`);
    const totalCount = Number(totalCountRes[0]?.count || 0);

    const trxns = await query.limit(limit).offset(offset);
   
    return { transactions: trxns, totalCount };
}

export async function getTransactionByReference(referenceNumber: string): Promise<Transaction | undefined> {
    const [transactions_] = await db.select().from(transactions).where(eq(transactions.transRef, referenceNumber));
    return transactions_;
}

export async function createTransaction(userId: number, referenceNumber: string, description: string, payType: TransactionType, amount: string, status: TransactionStatus, artworkId?: number, tx?: Tx) {
    const transaction: NewTransaction = {
        userId,
        transRef: referenceNumber,
        description,
        type: payType,
        amount,
        status
    };
    if (artworkId) transaction.artworkId = artworkId;

    const [newTransaction] = tx ? await tx.insert(transactions).values(transaction).returning() : await db.insert(transactions).values(transaction).returning();
    return newTransaction;
}


export async function getWatchlist(userId: number) {
    const watchlistItems = await db.select().from(watchlists).leftJoin(artworks, eq(watchlists.artworkId, artworks.id)).where(eq(watchlists.userId, userId));
    return watchlistItems;
}

export async function getActivity(userId: number): Promise<Activity[]> {
    const userActivities: Activity[] = await db.select().from(activities).where(eq(activities.userId, userId));
    return userActivities;
}