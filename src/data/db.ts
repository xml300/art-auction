import { readFileSync, writeFileSync } from "fs";
import { hash } from "crypto";

function readJSON(tableName: string) {
    const content = readFileSync(`./src/data/json/${tableName.toLowerCase()}.json`, 'utf-8');
    return JSON.parse(content);
}

function writeJSON(tableName: string, json: string) {
    writeFileSync(`./src/data/json/${tableName.toLowerCase()}.json`, json);
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
    transactionTime: number;
}

export function hashValue(str: string) {
    return hash('sha256', str + "1djfdsnfjr3");
}

export function createUser(email: string, username: string, password: string, roleId: Roles): User {
    const users = readJSON('users');
    const user: User = {
        id: users.length + 1,
        email,
        username,
        password: hashValue(password),
        roleId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    users.push(user);
    writeJSON('users', JSON.stringify(users));
    return user;
};

export function updateUser<K extends keyof User>(id: number, updates: {columnName: K, value: User[K]}[]): User | undefined {
    const users: User[] = readJSON('users');
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return undefined;
    }

    const updatedUser = { 
        ...users[userIndex], 
        updatedAt: Date.now() 
    };

    for(const update of updates){
        updatedUser[update.columnName] = update.value;
    }

    users[userIndex] = updatedUser;
    writeJSON('users', JSON.stringify(users));
    return updatedUser;
}

export function updatePassword(id: number, newPassword: string): User | undefined {
    const users: User[] = readJSON('users');
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return undefined;
    }

    const updatedUser = { ...users[userIndex], password: hashValue(newPassword), updatedAt: Date.now() };
    users[userIndex] = updatedUser;
    writeJSON('users', JSON.stringify(users));
    return updatedUser;
}

export function getUsersQuery(where: { columnName: string, comparator: '=' | '<' | '>', value: string }[]) {
    const users: User[] = readJSON('users');
    return users.filter(user => {
        const conditions = where.map(obj => {
            if(user[obj.columnName as keyof User] === undefined){
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

export function getUsers(id?: number): User | User[] {
    const users = readJSON('users');
    if (id) {
        return users.filter((user: User) => user.id === id)[0];
    }
    return users;
}

export function getUsersProfile(userId: number) {
    const user = getUsers(userId) as User;
    const ownedArtworks = getArtworks(userId);
    const watchlist = getWatchlist(userId);
    const activity = getActivity(userId);
    const transactions = getTransactions(userId);
    
    const allBids = readJSON('bids') as Bid[];
    const userBids = allBids.filter(bid => bid.bidderId === userId);
    const allArtworks = readJSON('artworks') as Artwork[];

    const activeBidsCount = userBids.filter(bid => {
        const artwork = allArtworks.find(art => art.id === bid.artworkId);
        return artwork && artwork.auctionEndTime > Date.now();
    }).length;

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
        profilePicture: user.profilePicture || "/images/avatars/default.jpg",
        bio: user.bio || "No bio provided.",
        socialMedia: {
            twitter: "https://twitter.com/janedoe_art", 
            instagram: "https://instagram.com/janedoe_collection", 
        },
        stats: {
            artworksOwned: ownedArtworks.length,
            totalSpent:     transactions.reduce((acc, tran) => tran.amount + acc, 0), 
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

function getRole(id: number) {
    const roles: Role[] = readJSON('roles');
    return roles.filter(role => role.id === id)[0];
}

function getRolePermissions(id: number): NullablePermission[] {
    const role: Role = getRole(id);
    const permissions = getPermissions() as Permission[];
    return role.permissions ? role.permissions.map(permId => permissions.find(permission => permission.id === permId) || null) : [];
}

export function getUserRole(userId: number): Role {
    const user = getUsers(userId) as User;
    const role = getRole(user.roleId) as Role;
    return role;
}

export function getPermissions(id?: number) {
    const permissions: Permission[] = readJSON('permissions');
    if (id) {
        return permissions.filter(permission => permission.id === id)[0]
    }
    return permissions;
}

export function getUserPermissions(userId: number): NullablePermission[] {
    const user = getUsers(userId) as User;
    const permissions: NullablePermission[] = getRolePermissions(user.roleId);
    return permissions;
}

export function createArtwork(title: string, description: string, artistId: number, imageUrl: string, auctionEndTime: Date): Artwork {
    const artworks = readJSON('artworks');
    const artwork: Artwork = {
        id: 1,
        title,
        description,
        artistId,
        imageUrl,
        startingBid: 0,
        currentBid: 0,
        auctionEndTime: auctionEndTime.getUTCMilliseconds(),
        ownerId: null,
    }
    artworks.push(artwork);
    writeJSON('artworks', JSON.stringify(artworks));
    return artwork;
}

export function updateArtwork<K extends keyof Artwork>(id: number, update: { columnName: K, value: Artwork[K] }) {
    const artworks: Artwork[] = readJSON('artworks');
    const artworkIndex = artworks.findIndex(artwork => artwork.id === id);
    if (artworkIndex === -1) {
        throw new Error('Artwork not found');
    }
    artworks[artworkIndex][update.columnName] = update.value;
    writeJSON('artworks', JSON.stringify(artworks));
    return artworks[artworkIndex];
}

export function getArtworkById(id: number, options?: { withBids?: boolean, withArtist?: boolean }): Artwork {
    const artworks: Artwork[] = readJSON('artworks');
    const resArtwork = artworks.filter(artwork => artwork.id === id)[0];
    if (options?.withBids) {
        const bids: Bid[] = getBids(resArtwork.id);
        resArtwork.bids = bids;

    }
    if (options?.withArtist) {
        const artist = getUsers(resArtwork.artistId) as User;
        resArtwork.artist = artist;
    }
    return resArtwork;
}

export function getArtworks(userId?: number, options?: { withBids?: boolean, withArtist?: boolean, page?: number, limit?: number }): Artwork[] {
    let artworks: Artwork[] = readJSON('artworks');
    if (options?.withBids) {
        artworks.forEach(artwork => {
            const bids: Bid[] = getBids(artwork.id);
            artwork.bids = bids;
        });
    }
    if (options?.withArtist) {
        artworks.forEach(artwork => {
            const artist = getUsers(artwork.artistId) as User;
            artwork.artist = artist;
        });
    }
    if (userId) {
        artworks = artworks.filter(artwork => artwork.ownerId === userId);
    }
    if (options?.page && options?.limit) {
        const startIndex = (options.page - 1) * options.limit;
        const endIndex = startIndex + options.limit;
        return artworks.slice(startIndex, endIndex);
    }
    return artworks;
}

export function getBids(artworkId: number) {
    const bids: Bid[] = readJSON('bids');
    return bids.filter(bid => bid.artworkId === artworkId);
}

export function createBid(artworkId: number, bidderId: number, bidAmount: number): Bid {
    const bids = readJSON('bids');
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

export function getTransactions(userId?: number) {
    let transactions: Transaction[] = readJSON('transactions');
    if (userId) {
        transactions = transactions.filter(transaction => transaction.userId === userId);
    }
    return transactions;
}

export function getWatchlist(userId: number): Artwork[] {
    const watchlistItems: Watchlist[] = readJSON('watchlist');
    const userWatchlist = watchlistItems.filter(item => item.userId === userId);
    const artworks: Artwork[] = readJSON('artworks');
    return userWatchlist.map(item => artworks.find(artwork => artwork.id === item.artworkId)).filter(Boolean) as Artwork[];
}

export function getActivity(userId: number): Activity[] {
    const activities: Activity[] = readJSON('activities'); 
    return activities.filter(activity => activity.userId === userId);
}
