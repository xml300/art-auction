import { hash } from "crypto";
import { readFile, writeFile } from "@/lib/fileSys";
import { memoize, invalidateCacheByPrefix } from "@/lib/memoize";

const readJSON = memoize(async (tableName: string) => {
    const content = await readFile(`/json/${tableName.toLowerCase()}.json`);
    return content;
}, (tableName: string) => `json-${tableName.toLowerCase()}`);

function writeJSON(tableName: string, json: string) {
    const file = new File([json], `${tableName.toLowerCase()}.json`, {type: 'application/json'});
    writeFile(file);
    invalidateCacheByPrefix(`json-${tableName.toLowerCase()}`);
    console.log(file);
}


enum Roles {
    Admin,
    Artist,
    Collector
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    surname?: string;
    firstName?: string;
    profilePicture?: string;
    bio?: string;
    roleId: Roles;
    wallet: number;
    createdAt: number;
    updatedAt: number;
};

export interface CollectorProfile {
    name: string;
    username: string;
    firstName: string;
    surname: string;
    email: string;
    profilePicture: string;
    wallet: number;
    bio: string;
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


export interface Activity {
    id: number;
    userId: number;
    type: "bid" | "won" | "watchlist_add";
    artworkTitle: string;
    amount?: number;
    date: number;
}

export interface Watchlist {
    id: number;
    userId: number;
    artworkId: number;
    dateAdded: number;
}

export interface Role {
    id: number;
    name: string;
    description: string;
    permissions?: number[];
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
}

export type NullablePermission = Permission | null;

export interface Artwork {
    id: number;
    title: string;
    description: string;
    artistId: number;
    imageUrl: string;
    ownerId: number | null;
    artist?: User;
    bids?: Bid[];
    startingBid: number;
    currentBid: number;
    auctionEndTime: number;
    medium: string;
    dimensions: string;
    year: number;
}


export interface Bid {
    id: number;
    artworkId: number;
    bidderId: number;
    bidAmount: number;
    bidTime: number;
}

export interface Transaction {
    id: number;
    userId: number;
    referenceNumber: string;
    description: string;
    payType: string;
    amount: number;
    status: string;
    transactionTime: number;
}

export function hashValue(str: string) {
    return hash('sha256', str + "1djfdsnfjr3");
}

export async function createUser(email: string, username: string, password: string, roleId: Roles) {
    const users = await readJSON('users');
    const user: User = {
        id: users.length + 1,
        email,
        username,
        password: hashValue(password),
        roleId,
        wallet: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    users.push(user);
    writeJSON('users', JSON.stringify(users));
    return user;
};

export async function updateUser<K extends keyof User>(id: number, updates: { columnName: K, value: User[K] }[]): Promise<User | undefined> {
    const users: User[] = await readJSON('users');
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return undefined;
    }

    const updatedUser = {
        ...users[userIndex],
        updatedAt: Date.now()
    };

    for (const update of updates) {
        updatedUser[update.columnName] = update.value;
    }

    users[userIndex] = updatedUser;
    writeJSON('users', JSON.stringify(users));
    return updatedUser;
}

export async function updatePassword(id: number, newPassword: string): Promise<User | undefined> {
    const users: User[] = await readJSON('users');
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return undefined;
    }

    const updatedUser = { ...users[userIndex], password: hashValue(newPassword), updatedAt: Date.now() };
    users[userIndex] = updatedUser;
    writeJSON('users', JSON.stringify(users));
    return updatedUser;
}

export async function getUsersQuery(where: { columnName: string, comparator: '=' | '<' | '>', value: string }[]) {
    const users: User[] = await readJSON('users');
    return users.filter(user => {
        const conditions = where.map(obj => {
            if (user[obj.columnName as keyof User] === undefined) {
                return false;
            }

            switch (obj.comparator) {
                case '=':
                    return user[obj.columnName as keyof User] === obj.value;
                    break;
                case '>':
                    return user[obj.columnName as keyof User]! > obj.value;
                    break;
                case '<':
                    return user[obj.columnName as keyof User]! < obj.value;
                    break;
            }
        });
        return conditions.filter(cond => cond === true).length === where.length;
    });
}

export async function getUsers(id?: number): Promise<User | User[]> {
    const users = await readJSON('users');
    if (id) {
        return users.filter((user: User) => user.id === id)[0];
    }
    return users;
}

export async function getUsersProfile(userId: number) {
    const user = await getUsers(userId) as User;
    const ownedArtworks = await getArtworks(userId);
    const watchlist = await getWatchlist(userId);
    const activity = await getActivity(userId);
    const { transactions } = await getTransactions(userId); // Destructure to get the transactions array

    const allBids = await readJSON('bids') as Bid[];
    const userBids = allBids.filter(bid => bid.bidderId === userId);
    const allArtworks = await readJSON('artworks') as Artwork[];

    const activeBidsCount = userBids.filter(bid => {
        const artwork = allArtworks.find(art => art.id === bid.artworkId);
        return artwork && artwork.auctionEndTime > Date.now();
    }).reduce((acc: Bid[], cur) => acc.find(bid => bid.artworkId === cur.artworkId) ? acc : [...acc, cur], []).length;

    const totalBidAmount = userBids.reduce((acc, bid) => acc + bid.bidAmount, 0);
    const avgBidAmount = userBids.length > 0 ? totalBidAmount / userBids.length : 0;

    const memberSinceYears = (Date.now() - user.createdAt) / (1000 * 60 * 60 * 24 * 365);

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
            totalSpent: transactions.filter((tran: Transaction) => tran.status == 'completed' && tran.description == 'bid').reduce((acc: number, tran: Transaction) => tran.amount + acc, 0),
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
    const roles: Role[] = await readJSON('roles');
    return roles.filter(role => role.id === id)[0];
}

async function getRolePermissions(id: number): Promise<NullablePermission[]> {
    const role: Role = await getRole(id);
    const permissions = await getPermissions() as Permission[];
    return role.permissions ? role.permissions.map(permId => permissions.find(permission => permission.id === permId) || null) : [];
}

export async function getUserRole(userId: number): Promise<Role> {
    const user = await getUsers(userId) as User;
    const role = await getRole(user.roleId) as Role;
    return role;
}

export async function getPermissions(id?: number) {
    const permissions: Permission[] = await readJSON('permissions');
    if (id) {
        return permissions.filter(permission => permission.id === id)[0]
    }
    return permissions;
}

export async function getUserPermissions(userId: number): Promise<NullablePermission[]> {
    const user = await getUsers(userId) as User;
    const permissions: NullablePermission[] = await getRolePermissions(user.roleId);
    return permissions;
}

export async function createArtwork(title: string, description: string, artistId: number, imageUrl: string, startingBid: number, auctionEndTime: Date, medium: string, dimensions: string, year: number): Promise<Artwork> {
    const artworks = await readJSON('artworks');
    const artwork: Artwork = {
        id: artworks.length + 1,
        title,
        description,
        artistId,
        imageUrl,
        startingBid,
        currentBid: 0,
        auctionEndTime: auctionEndTime.getTime(),
        ownerId: null,
        medium,
        dimensions,
        year,
    }
    artworks.push(artwork);
    writeJSON('artworks', JSON.stringify(artworks));
    return artwork;
}

export async function updateArtwork<K extends keyof Artwork>(id: number, update: { columnName: K, value: Artwork[K] }) {
    const artworks: Artwork[] = await readJSON('artworks');
    const artworkIndex = artworks.findIndex(artwork => artwork.id === id);
    if (artworkIndex === -1) {
        throw new Error('Artwork not found');
    }
    artworks[artworkIndex][update.columnName] = update.value;
    await writeJSON('artworks', JSON.stringify(artworks));
    return artworks[artworkIndex];
}

export async function getArtworkById(id: number, options?: { withBids?: boolean, withArtist?: boolean }): Promise<Artwork | undefined> {
    const artworks: Artwork[] = await readJSON('artworks');
    const resArtwork = artworks.filter(artwork => artwork.id === id)[0];
    if (options?.withBids) {
        const bids: Bid[] = await getBids(resArtwork.id);
        resArtwork.bids = bids;

    }
    if (options?.withArtist) {
        const artist = await getUsers(resArtwork.artistId) as User;
        resArtwork.artist = artist;
    }
    return resArtwork;
}

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
    let artworks: Artwork[] = await readJSON('artworks');

    if (options?.withBids) {
        artworks.forEach(async(artwork) => {
            const bids: Bid[] = await getBids(artwork.id);
            artwork.bids = bids;
        });
    }

    if (options?.withArtist) {
        artworks.forEach(async (artwork) => {
            const artist = await getUsers(artwork.artistId) as User;
            artwork.artist = artist;
        });
    }

    if (userId) {
        artworks = artworks.filter(artwork => artwork.ownerId === userId);
    } else {
        artworks = artworks.filter(artwork => artwork.ownerId === null);
    }

    if (options?.searchQuery) {
        artworks = artworks.filter(artwork =>
            artwork.title.toLowerCase().includes(options.searchQuery!.toLowerCase()) ||
            artwork.artist?.username.toLowerCase().includes(options.searchQuery!.toLowerCase())
        );
    }

    if (options?.artistName) {
        artworks = artworks.filter(artwork =>
            artwork.artist?.username.toLowerCase().includes(options.artistName!.toLowerCase())
        );
    }

    if (options?.minBid) {
        artworks = artworks.filter(artwork => artwork.currentBid >= options.minBid! || artwork.startingBid >= options.minBid!);
    }

    if (options?.maxBid) {
        artworks = artworks.filter(artwork => artwork.currentBid <= options.maxBid! || artwork.startingBid <= options.maxBid!);
    }

    if (options?.minEndTime) {
        artworks = artworks.filter(artwork => artwork.auctionEndTime >= options.minEndTime!);
    }

    if (options?.maxEndTime) {
        artworks = artworks.filter(artwork => artwork.auctionEndTime <= options.maxEndTime!);
    }

    if (options?.page && options?.limit) {
        const startIndex = (options.page - 1) * options.limit;
        const endIndex = startIndex + options.limit;
        return artworks.slice(startIndex, endIndex);
    }

    return artworks;
}

export async function getBids<K extends keyof Bid>(artworkId: number, options?:{sortBy?: K, sortOrder?: 'asc' | 'desc', where?: {columnName: K, value: Bid[K]}[]}) {
    let bids: Bid[] = await readJSON('bids');
     if (options && options.sortBy) {
        bids = bids.sort((a, b) => {
            if (options.sortOrder === 'asc' && options.sortBy) {
                return a[options.sortBy] > b[options.sortBy] ? 1 : -1;
            } else {
                return a[options.sortBy as keyof Bid] < b[options.sortBy as keyof Bid] ? 1 : -1;
            }
        });
    }
   if(options && options.where){
        for(const update of options.where){
            bids = bids.filter(bid => bid[update.columnName] === update.value);
        }
    }
    return bids.filter(bid => bid.artworkId === artworkId);
}

export async function getBidsByUser<K extends keyof Bid>(bidderId: number, options?: { sortBy?: keyof Bid, sortOrder?: 'asc' | 'desc', where?:{columnName: K, value: Bid[K]}[] }): Promise<Bid[]> {
    let bids: Bid[] = await readJSON('bids');
    if (options && options.sortBy) {
        bids = bids.sort((a, b) => {
            if (options.sortOrder === 'asc' && options.sortBy) {
                return a[options.sortBy] > b[options.sortBy] ? 1 : -1;
            } else {
                return a[options.sortBy as keyof Bid] < b[options.sortBy as keyof Bid] ? 1 : -1;
            }
        });
    }

    if(options && options.where){
        for(const update of options.where){
            bids = bids.filter(bid => bid[update.columnName] === update.value);
        }
    }
    return bids.filter(bid => bid.bidderId === bidderId);
}

export async function createBid(artworkId: number, bidderId: number, bidAmount: number): Promise<Bid> {
    const bids = await readJSON('bids');
    const bid: Bid = {
        id: bids.length + 1,
        artworkId,
        bidderId,
        bidAmount,
        bidTime: Date.now(),
    };
    bids.push(bid);
    writeJSON('bids', JSON.stringify(bids));
    return bid;
}

export async function updateTransaction<K extends keyof Transaction>(id: number, updates: {columnName: K, value: Transaction[K]}[]){
    const transactions: Transaction[] = await readJSON('transactions');
    const transaction = transactions.find(tx => tx.id === id);
    if (!transaction) return;

    updates.forEach(update => {
        transaction[update.columnName] = update.value;
    });

    writeJSON('transactions', JSON.stringify(transactions));
}

export async function getTransactions(userId?: number, options?: { sortBy?: keyof Transaction, sortOrder?: 'asc' | 'desc', page?: number, limit?: number }): Promise<{ transactions: Transaction[], totalCount: number }> {
    let transactions: Transaction[] = await readJSON('transactions');
    if (userId) {
        transactions = transactions.filter(transaction => transaction.userId === userId);
    }
    if (options && options.sortBy) {
        transactions = transactions.sort((a, b) => {
            if (options.sortOrder === 'asc' && options.sortBy) {
                return a[options.sortBy] > b[options.sortBy] ? 1 : -1;
            } else {
                return a[options.sortBy as keyof Transaction] < b[options.sortBy as keyof Transaction] ? 1 : -1;
            }
        });
    }

    const totalCount = transactions.length;

    if (options?.page && options?.limit) {
        const startIndex = (options.page - 1) * options.limit;
        const endIndex = startIndex + options.limit;
        transactions = transactions.slice(startIndex, endIndex);
    }

    return { transactions, totalCount };
}

export async function getTransactionByReference(referenceNumber: string): Promise<Transaction | undefined> {
    const transactions: Transaction[] = await readJSON('transactions');
    return transactions.find(transaction => transaction.referenceNumber === referenceNumber);
}

export async function createTransaction(userId: number, referenceNumber: string, description: string, payType: string, amount: number, status: string): Promise<Transaction> {
    const transactions = await readJSON('transactions');
    const transaction: Transaction = {
        id: transactions.length + 1,
        userId,
        referenceNumber,
        description,
        payType,
        amount,
        status,
        transactionTime: Date.now(),
    };
    transactions.push(transaction);
    writeJSON('transactions', JSON.stringify(transactions));
    return transaction;
}


export async function getWatchlist(userId: number): Promise<Artwork[]> {
    const watchlistItems: Watchlist[] = await readJSON('watchlist');
    const userWatchlist = watchlistItems.filter(item => item.userId === userId);
    const artworks: Artwork[] = await readJSON('artworks');
    return userWatchlist.map(item => artworks.find(artwork => artwork.id === item.artworkId)).filter(Boolean) as Artwork[];
}

export async function getActivity(userId: number): Promise<Activity[]> {
    const activities: Activity[] = await readJSON('activities');
    return activities.filter(activity => activity.userId === userId);
}
