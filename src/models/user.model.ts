import bcrypt from "bcrypt";
import { db } from "@/data/db";
import { users, roles, rolePermissions, permissions, bids, artworks } from "@/db/schema";
import { eq, or, gt, lt, sql, getTableColumns, SQL } from "drizzle-orm";
import { User, Roles, Role, Permission, CollectorProfile, Artwork, Transaction } from "@/types";
import { Tx } from "./types";
import { Artworks } from "./artwork.model";
import { Watchlists } from "./watchlist.model";
import { Activities } from "./activity.model";
import { Transactions } from "./transaction.model";

export const Users = {
  hashPassword: async (str: string): Promise<string> => {
    return await bcrypt.hash(str, 12);
  },

  create: async (
    email: string,
    username: string,
    password: string,
    roleId: Roles
  ): Promise<User | null> => {
    const userData = {
      email,
      username,
      password: await Users.hashPassword(password),
      roleId,
      wallet: 0,
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user || null;
  },

  update: async <K extends keyof User>(
    id: number,
    updates: { [key in K]: User[key] },
    tx?: Tx
  ): Promise<User> => {
    const [updatedUser] = tx
      ? await tx.update(users).set(updates).where(eq(users.id, id)).returning()
      : await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updatedUser;
  },

  get: async (id: number, tx?: Tx) => {
    const [user] = tx
      ? await tx.select().from(users).where(eq(users.id, id))
      : await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  getAll: async (
    where?: { columnName: string; comparator: "=" | "<" | ">"; value: string }[]
  ): Promise<User[]> => {
    let conditions: SQL[] = [];

    if (where) {
      conditions = where
        .map((obj) => {
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
        })
        .filter((c): c is SQL => c !== null);
    }

    const matchedUsers = conditions.length > 0
      ? await db.select().from(users).where(or(...conditions))
      : await db.select().from(users);

    return matchedUsers;
  },

  getRole: async (userId: number): Promise<Role> => {
    const user = await Users.get(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    const selectedRoles = await db
      .select()
      .from(roles)
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .where(eq(roles.id, user.roleId));

    if (selectedRoles.length === 0) throw new Error(`Role for user ${userId} not found`);

    const role = selectedRoles.reduce((acc: (Role & { permissions: number[] }) | null, row) => {
      const { roles: roleRow, role_permissions } = row;
      if (!acc) {
        return { ...roleRow, permissions: role_permissions ? [role_permissions.permissionId] : [] };
      }
      if (role_permissions) {
        acc.permissions.push(role_permissions.permissionId);
      }
      return acc;
    }, null);

    return role as Role;
  },

  getPermissions: async (id?: number): Promise<Permission[] | Permission | undefined> => {
    const query = db.select().from(permissions);
    if (id) {
      return (await query.where(eq(permissions.id, id))).at(0);
    }
    return await query;
  },

  getUserPermissions: async (userId: number) => {
    const user = await Users.get(userId);
    if (!user) return [];

    const selectedRoles = await db
      .select()
      .from(roles)
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .where(eq(roles.id, user.roleId));

    const role = selectedRoles.reduce((acc: (Role & { permissions: number[] }) | null, row) => {
      const { roles: roleRow, role_permissions } = row;
      if (!acc) {
        return { ...roleRow, permissions: role_permissions ? [role_permissions.permissionId] : [] };
      }
      if (role_permissions) {
        acc.permissions.push(role_permissions.permissionId);
      }
      return acc;
    }, null);

    if (!role) return [];

    const allPermissions = (await Users.getPermissions()) as Permission[];
    return role.permissions
      ? role.permissions.map((permId) => allPermissions.find((p) => p.id === permId) || null)
      : [];
  },

  getProfile: async (userId: number | null): Promise<CollectorProfile | null> => {
    if (!userId) return null;

    const user = await Users.get(userId);
    if (!user) return null;

    const ownedArtworks = await Artworks.getAll(userId);
    const watchlistRaw = await Watchlists.get(userId);
    const watchlist = watchlistRaw.map((w) => w.artworks).filter((a): a is Artwork => a !== null);
    const activity = await Activities.get(userId);
    const { transactions } = await Transactions.get(userId);

    const userBids = (
      await db
        .select({
          numAuctions: sql<number>`COUNT(DISTINCT ${bids.artworkId})`,
          activeBids: sql<number>`COUNT(DISTINCT CASE WHEN ${artworks.auctionEndTime} > ${new Date()} THEN ${bids.artworkId} END)`,
          totalAmount: sql<number>`SUM(${bids.bidAmount})`,
          avgAmount: sql<number>`AVG(${bids.bidAmount})`,
        })
        .from(bids)
        .leftJoin(artworks, eq(bids.artworkId, artworks.id))
        .where(eq(bids.bidderId, userId))
    ).at(0);

    const activeBidsCount = userBids?.activeBids;
    const avgBidAmount = userBids?.avgAmount;
    const memberSinceYears = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
    const totalAuctionsParticipated = userBids?.numAuctions || 0;
    const successRate = totalAuctionsParticipated > 0 ? (ownedArtworks.length / totalAuctionsParticipated) * 100 : 0;

    const profileData: CollectorProfile = {
      name: `${user.firstName || ""} ${user.surname || ""}`.trim(),
      username: user.username,
      firstName: user.firstName || "",
      surname: user.surname || "",
      email: user.email,
      profilePicture: user.profilePicture || "/logo.png",
      bio: user.bio || "No bio provided.",
      wallet: user.wallet / 100,
      socialMedia: {
        twitter: "https://twitter.com/janedoe_art",
        instagram: "https://instagram.com/janedoe_collection",
      },
      stats: {
        artworksOwned: ownedArtworks.length,
        totalSpent: transactions
          .filter((tran: Transaction) => tran.status === "completed" && (tran.type === "bid_payment" || tran.description === "bid"))
          .reduce((acc: number, tran: Transaction) => parseFloat(tran.amount) + acc, 0),
        auctionsWon: ownedArtworks.length,
        watchlistItems: watchlist.length,
        activeBids: activeBidsCount || 0,
        avgBidAmount: avgBidAmount || 0,
        memberSince: parseFloat(memberSinceYears.toFixed(1)),
        successRate: parseFloat(successRate.toFixed(1)),
      },
      ownedArtworks,
      watchlist,
      activity,
    };

    return profileData;
  },
};
