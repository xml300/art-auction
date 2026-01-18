import { hash } from "crypto";
import { db } from "./db";
import { activities, artworks, bids, permissions, rolePermissions, roles, transactions, users, watchlists } from "@/db/schema";
import { eq, gte, isNull, like, lte, or, getTableColumns, asc, desc, and, SQLWrapper } from "drizzle-orm";
import { User, Roles, Artwork, Bid, Transaction, Activity, Role, Permission, CollectorProfile, NewTransaction, ResultType, JoinedReturnType } from "@/types";

export function hashValue(str: string) {
    return hash('sha256', str + "1djfdsnfjr3");
}

export async function createUser(email: string, username: string, password: string, roleId: Roles) {
    const userData = {
        email,
        username,
        password: hashValue(password),
        roleId,
        wallet: 0
    }
    const [user] = await db.insert(users).values(userData).returning();
    if (!user) {
        return null;
    }
    return user;
};

export async function updateUser<K extends keyof User>(id: number, updates: { [key in K]: User[key] }) {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser;
}

export async function updatePassword(id: number, newPassword: string) {
    const [updatedUser] = await db.update(users).set({ password: hashValue(newPassword) }).where(eq(users.id, id)).returning();
    return updatedUser;
}

export async function getUsersQuery(where: { columnName: string, comparator: '=' | '<' | '>', value: string }[]) {
    const conditions = where.map((obj) => {
        const columns = getTableColumns(users);
        const column = columns[obj.columnName as keyof typeof columns];
        if (!column) return null;
        switch (obj.comparator) {
            case "=":
                return eq(column, obj.value);
            case ">":
                return gte(column, obj.value);
            case "<":
                return lte(column, obj.value);
            default:
                return null;
        }
    }).filter((c) => c !== null);

    const getUsers = await db.select().from(users).where(or(...conditions));
    return getUsers;
}

export async function getUsers(id?: number): Promise<User[] | User | null> {
    const query = db.select().from(users);
    if (id) {
        const [user] = await query.where(eq(users.id, id));
        if (!user) return null;
        return user;
    }
    return await query;
}

export async function getUsersProfile(userId: number | null) {
    if (!userId) return null;

    const user = await getUsers(userId) as User | null;
    const ownedArtworks = await getArtworks(userId);
    const watchlistRaw = await getWatchlist(userId);
    const watchlist = watchlistRaw.map(w => w.artworks).filter((a): a is Artwork => a !== null);
    const activity = await getActivity(userId);
    const { transactions } = await getTransactions(userId); // Destructure to get the transactions array

    if (!user) {
        return null;
    }

    const userBids = await db.select().from(bids).where(eq(bids.bidderId, userId));
    const allArtworks = await db.select().from(artworks);

    const activeBidsCount = userBids.filter(bid => {
        const artwork = allArtworks.find(art => art.id === bid.artworkId);
        return artwork && artwork.auctionEndTime > new Date(Date.now());
    }).reduce((acc: Bid[], cur: Bid) => acc.find(bid => bid.artworkId === cur.artworkId) ? acc : [...acc, cur], []).length;

    const totalBidAmount = userBids.reduce((acc: number, bid: Bid) => acc + bid.bidAmount, 0);
    const avgBidAmount = userBids.length > 0 ? totalBidAmount / userBids.length : 0;

    const memberSinceYears = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);

    const uniqueBiddedArtworks = new Set(userBids.map(bid => bid.artworkId));
    const totalAuctionsParticipated = uniqueBiddedArtworks.size;
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
            totalSpent: transactions.filter((tran: Transaction) => tran.status == 'completed' && tran.description == 'bid').reduce((acc: number, tran: Transaction) => tran.finalAmount + acc, 0),
            auctionsWon: ownedArtworks.length,
            watchlistItems: watchlist.length,
            activeBids: activeBidsCount,
            avgBidAmount: parseFloat(avgBidAmount.toFixed(2)),
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
    const user = await getUsers(userId) as User;
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
    const user = await getUsers(userId) as User;
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

export async function updateArtwork<K extends keyof Artwork>(id: number, update: { [key in K]: Artwork[K] }) {
    const updatedArtwork = (await db.update(artworks).set(update).where(eq(artworks.id, id)).returning()).at(0);
    return updatedArtwork;
}

export async function getArtworkById(id: number, options?: { withBids?: boolean, withArtist?: boolean }) {
    const query = db.select().from(artworks).where(eq(artworks.id, id));
    if (!options?.withBids && !options?.withArtist) return await query;

    if (options?.withBids || options?.withArtist) {
        const q = options.withArtist ?
            options.withBids ?
                query.leftJoin(users, eq(users.id, artworks.artistId)).leftJoin(bids, eq(bids.artworkId, artworks.id)) :
                query.leftJoin(users, eq(users.id, artworks.artistId)) :
            options.withBids ?
                query.leftJoin(bids, eq(bids.artworkId, artworks.id)) :
                query;

        const rows = await q as ResultType[];
        if (!rows || rows.length === 0) return undefined;


        const result = rows.reduce((acc: JoinedReturnType | null, row: ResultType) => {
            const artwork = row.artworks;
            const bid = row.bids;
            const artist = row.users;

            if (!acc) {
                acc = { ...artwork };
                if (options?.withArtist) acc.artist = artist;
                if (options?.withBids) acc.bids = bid ? [bid] : [];
            } else if (options?.withBids && bid) {
                acc.bids?.push(bid);
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
    let startIndex = 0;
    let endIndex = -1;


    const conditions = [];
    if (userId) {
        conditions.push(eq(artworks.ownerId, userId));
    } else {
        conditions.push(isNull(artworks.ownerId));
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
        startIndex = (options.page - 1) * options.limit;
        endIndex = startIndex + options.limit;
    }

    if (!options?.withBids && !options?.withArtist) {
        const rows = await query.where(and(...conditions));
        return endIndex === -1 ? rows.slice(startIndex) : rows.slice(startIndex, endIndex);
    }



    if (options?.withArtist) {
        if (options?.artistName) {
            conditions.push(like(users.username, `%${options.artistName!}%`));
        }
        if (options?.searchQuery) {
            conditions.push(or(like(artworks.title, '%' + options.searchQuery! + '%'), like(users.username, '%' + options.searchQuery! + '%')));
        }
    }

    const q = options.withBids ?
        options.withArtist ?
            query.leftJoin(bids, eq(bids.artworkId, artworks.id)).leftJoin(users, eq(users.id, artworks.artistId)) :
            query.leftJoin(bids, eq(bids.artworkId, artworks.id)) :
        options.withArtist ?
            query.leftJoin(users, eq(users.id, artworks.artistId)) :
            query;
    const rows = await q.where(and(...conditions)) as ResultType[];

    const aggregated = rows.reduce((acc: Map<number, JoinedReturnType>, row: ResultType) => {
        const artwork = row.artworks;
        const bid = row.bids;
        const artist = row.users;

        if (!acc.has(artwork.id)) {
            const artworkItem: JoinedReturnType = { ...artwork };
            if (options?.withArtist) artworkItem.artist = artist;
            if (options?.withBids) artworkItem.bids = bid ? [bid] : [];
            acc.set(artwork.id, artworkItem);
        } else if (options?.withBids && bid) {
            acc.get(artwork.id)!.bids!.push(bid);
        }
        return acc;
    }, new Map<number, JoinedReturnType>());

    const artworks_: Artwork[] = Array.from(aggregated.values());

    return endIndex === -1 ? artworks_.slice(startIndex) : artworks_.slice(startIndex, endIndex);
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
            const column =  columns[update.columnName as keyof typeof columns];
            if (column) {
                conditions.push(eq(column, update.value as SQLWrapper | number | Date));
            }
        }
    }
    return await query.where(and(...conditions));
}

export async function createBid(artworkId: number, bidderId: number, bidAmount: number) {
    const bid = {
        artworkId,
        bidderId,
        bidAmount,
        bidTime: new Date(),
    };
    const [newBid] = await db.insert(bids).values(bid).returning();
    if (newBid) {
        await db.update(artworks).set({ currentBid: bidAmount }).where(eq(artworks.id, artworkId));
    }
    return newBid;
}

export async function updateTransaction<K extends keyof Transaction>(id: number, updates: { [key in K]: Transaction[K] }) {
    await db.update(transactions).set(updates).where(eq(transactions.id, id));
}

export async function getTransactions(userId?: number, options?: { sortBy?: keyof Transaction, sortOrder?: 'asc' | 'desc', page?: number, limit?: number }): Promise<{ transactions: Transaction[], totalCount: number }> {
    let query = db.select().from(transactions).$dynamic();
    let startIndex = 0;
    let endIndex = -1;

    if (userId) {
        query = query.where(eq(transactions.buyerId, userId));
    }
    if (options && options.sortBy) {
        const columns = getTableColumns(transactions);
        const column = columns[options.sortBy as keyof typeof columns];
        if (options.sortOrder === 'asc')
            query = query.orderBy(asc(column));
        else
            query = query.orderBy(desc(column));
    }
    const trxns = await query;
    const totalCount = trxns.length;
    if (options?.page && options?.limit) {
        startIndex = (options.page - 1) * options.limit;
        endIndex = startIndex + options.limit;
    }
    return { transactions: endIndex === -1 ? trxns.slice(startIndex) : trxns.slice(startIndex, endIndex), totalCount };
}

export async function getTransactionByReference(referenceNumber: string): Promise<Transaction | undefined> {
    const [transactions_] = await db.select().from(transactions).where(eq(transactions.transRef, referenceNumber));
    return transactions_;
}

export async function createTransaction(userId: number, referenceNumber: string, description: string, payType: string, amount: number, status: string, artworkId?: number) {
    const transaction: NewTransaction = {
        buyerId: userId,
        transRef: referenceNumber,
        description,
        type: payType,
        finalAmount: amount,
        status,
        transactionTime: new Date(),
    };
    if (artworkId) transaction.artworkId = artworkId;

    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
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