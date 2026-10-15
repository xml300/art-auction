import { db } from "@/data/db";
import { users, artworks, bids, transactions, ledgerAccounts, ledgerPostings, ledgerJournalEntries, auditLogs } from "@/db/schema";
import { eq, sql, desc, and, isNull, isNotNull, gt, lte, or, ilike } from "drizzle-orm";
import { Roles } from "@/enums";
import { Tx } from "./types";
import { Ledger } from "./ledger.model";

export interface AdminMetrics {
  users: {
    total: number;
    collectors: number;
    artists: number;
    admins: number;
  };
  auctions: {
    total: number;
    active: number;
    pendingSettlement: number;
    settled: number;
  };
  bids: {
    totalCount: number;
    totalVolume: number;
  };
  finance: {
    totalTransactionsVolume: number;
    totalTransactionsCount: number;
    userLiabilitiesKobo: number;
    userLiabilitiesNaira: number;
    escrowHeldKobo: number;
    escrowHeldNaira: number;
    platformRevenueKobo: number;
    platformRevenueNaira: number;
    ledgerBalanced: boolean;
    totalDebitsKobo: number;
    totalCreditsKobo: number;
  };
  recentAuditLogs: Array<{
    id: number;
    action: string;
    actorId: number | null;
    actorType: string;
    status: string;
    resourceType: string | null;
    resourceId: string | null;
    createdAt: Date;
    metadata: string | null;
  }>;
}

export const Admin = {
  /**
   * Aggregates platform-wide metrics for the Admin Dashboard overview.
   */
  getMetrics: async (): Promise<AdminMetrics> => {
    // 1. User stats
    const userStats = await db
      .select({
        total: sql<number>`count(*)::int`,
        collectors: sql<number>`count(case when ${users.roleId} = ${Roles.Collector} then 1 end)::int`,
        artists: sql<number>`count(case when ${users.roleId} = ${Roles.Artist} then 1 end)::int`,
        admins: sql<number>`count(case when ${users.roleId} = ${Roles.Admin} then 1 end)::int`,
      })
      .from(users);

    const u = userStats[0] || { total: 0, collectors: 0, artists: 0, admins: 0 };

    // 2. Artwork & Auction stats
    const now = new Date();
    const artworkStats = await db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(case when ${artworks.ownerId} is null and ${artworks.auctionEndTime} > ${now} then 1 end)::int`,
        pendingSettlement: sql<number>`count(case when ${artworks.ownerId} is null and ${artworks.auctionEndTime} <= ${now} then 1 end)::int`,
        settled: sql<number>`count(case when ${artworks.ownerId} is not null then 1 end)::int`,
      })
      .from(artworks);

    const a = artworkStats[0] || { total: 0, active: 0, pendingSettlement: 0, settled: 0 };

    // 3. Bid stats
    const bidStats = await db
      .select({
        totalCount: sql<number>`count(*)::int`,
        totalVolume: sql<number>`coalesce(sum(${bids.bidAmount}), 0)::int`,
      })
      .from(bids);

    const b = bidStats[0] || { totalCount: 0, totalVolume: 0 };

    // 4. Transaction volume
    const txStats = await db
      .select({
        totalCount: sql<number>`count(*)::int`,
        totalVolume: sql<number>`coalesce(sum(${transactions.amount}), 0)::float`,
      })
      .from(transactions)
      .where(eq(transactions.status, "completed"));

    const t = txStats[0] || { totalCount: 0, totalVolume: 0 };

    // 5. Ledger Financial Integrity & Aggregates
    let platformRevenueKobo = 0;
    try {
      const commAccount = await Ledger.getPlatformCommissionAccount();
      platformRevenueKobo = await Ledger.getAccountBalance(commAccount.id);
    } catch {
      platformRevenueKobo = 0;
    }

    const postingTotals = await db
      .select({
        totalDebits: sql<string>`coalesce(sum(case when ${ledgerPostings.direction} = 'debit' then ${ledgerPostings.amount} else 0 end), 0)`,
        totalCredits: sql<string>`coalesce(sum(case when ${ledgerPostings.direction} = 'credit' then ${ledgerPostings.amount} else 0 end), 0)`,
      })
      .from(ledgerPostings);

    const totalDebitsKobo = Number(postingTotals[0]?.totalDebits || 0);
    const totalCreditsKobo = Number(postingTotals[0]?.totalCredits || 0);
    const ledgerBalanced = totalDebitsKobo === totalCreditsKobo;

    // User liabilities (all available wallet balances in kobo)
    const walletSumResult = await db
      .select({
        totalWalletKobo: sql<number>`coalesce(sum(${users.wallet}), 0)::int`,
      })
      .from(users);

    const userLiabilitiesKobo = walletSumResult[0]?.totalWalletKobo || 0;

    // Escrow held (sum of credit balances in collector escrow accounts)
    const escrowSumResult = await db
      .select({
        totalEscrow: sql<string>`coalesce(sum(case when ${ledgerPostings.direction} = 'credit' then ${ledgerPostings.amount} else -${ledgerPostings.amount} end), 0)`,
      })
      .from(ledgerPostings)
      .innerJoin(ledgerAccounts, eq(ledgerPostings.accountId, ledgerAccounts.id))
      .where(sql`${ledgerAccounts.accountNumber} like 'liability:collector:escrow:%'`);

    const escrowHeldKobo = Math.max(0, Number(escrowSumResult[0]?.totalEscrow || 0));

    // 6. Recent Audit Logs
    const recentLogs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        actorId: auditLogs.actorId,
        actorType: auditLogs.actorType,
        status: auditLogs.status,
        resourceType: auditLogs.resourceType,
        resourceId: auditLogs.resourceId,
        createdAt: auditLogs.createdAt,
        metadata: auditLogs.metadata,
      })
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(8);

    return {
      users: {
        total: u.total,
        collectors: u.collectors,
        artists: u.artists,
        admins: u.admins,
      },
      auctions: {
        total: a.total,
        active: a.active,
        pendingSettlement: a.pendingSettlement,
        settled: a.settled,
      },
      bids: {
        totalCount: b.totalCount,
        totalVolume: b.totalVolume,
      },
      finance: {
        totalTransactionsVolume: t.totalVolume,
        totalTransactionsCount: t.totalCount,
        userLiabilitiesKobo,
        userLiabilitiesNaira: userLiabilitiesKobo / 100,
        escrowHeldKobo,
        escrowHeldNaira: escrowHeldKobo / 100,
        platformRevenueKobo,
        platformRevenueNaira: platformRevenueKobo / 100,
        ledgerBalanced,
        totalDebitsKobo,
        totalCreditsKobo,
      },
      recentAuditLogs: recentLogs,
    };
  },

  /**
   * Retrieves list of all users for admin user management with pagination and search.
   */
  getUsersList: async (params?: {
    search?: string;
    roleId?: number;
    page?: number;
    limit?: number;
  }) => {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (params?.roleId !== undefined) {
      conditions.push(eq(users.roleId, params.roleId));
    }

    if (params?.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      conditions.push(
        or(
          ilike(users.username, term),
          ilike(users.email, term),
          ilike(users.firstName, term),
          ilike(users.surname, term)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    const userList = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        surname: users.surname,
        roleId: users.roleId,
        wallet: users.wallet,
        profilePicture: users.profilePicture,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      users: userList.map((u) => ({
        ...u,
        walletNaira: u.wallet / 100,
      })),
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  },

  /**
   * Updates a user's role.
   */
  updateUserRole: async (userId: number, newRoleId: number, tx?: Tx) => {
    const client = tx || db;
    const [updated] = await client
      .update(users)
      .set({ roleId: newRoleId })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  },

  /**
   * Retrieves all artworks with bidding and settlement status for administration.
   */
  getAdminArtworks: async (params?: {
    status?: "all" | "active" | "pending_settlement" | "settled";
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;
    const now = new Date();

    const conditions = [];

    if (params?.status === "active") {
      conditions.push(and(isNull(artworks.ownerId), gt(artworks.auctionEndTime, now)));
    } else if (params?.status === "pending_settlement") {
      conditions.push(and(isNull(artworks.ownerId), lte(artworks.auctionEndTime, now)));
    } else if (params?.status === "settled") {
      conditions.push(isNotNull(artworks.ownerId));
    }

    if (params?.search && params.search.trim()) {
      conditions.push(ilike(artworks.title, `%${params.search.trim()}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(artworks)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    const results = await db
      .select({
        artwork: artworks,
        artist: {
          id: users.id,
          username: users.username,
          email: users.email,
        },
      })
      .from(artworks)
      .innerJoin(users, eq(artworks.artistId, users.id))
      .where(whereClause)
      .orderBy(desc(artworks.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      artworks: results.map((r) => ({
        ...r.artwork,
        artist: r.artist,
        isExpired: new Date(r.artwork.auctionEndTime) <= now,
        isSettled: r.artwork.ownerId !== null,
        isActive: r.artwork.ownerId === null && new Date(r.artwork.auctionEndTime) > now,
      })),
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  },

  /**
   * Retrieves ledger accounts summary and journal history for the financial oversight module.
   */
  getLedgerOverview: async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;

    const accounts = await db
      .select()
      .from(ledgerAccounts)
      .orderBy(ledgerAccounts.type, ledgerAccounts.name);

    // Compute balance for each account
    const accountsWithBalances = await Promise.all(
      accounts.map(async (acc) => {
        const balanceKobo = await Ledger.getAccountBalance(acc.id);
        return {
          ...acc,
          balanceKobo,
          balanceNaira: balanceKobo / 100,
        };
      })
    );

    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(ledgerJournalEntries);

    const totalCount = countResult[0]?.count || 0;

    const entries = await db
      .select()
      .from(ledgerJournalEntries)
      .orderBy(desc(ledgerJournalEntries.createdAt))
      .limit(limit)
      .offset(offset);

    // Load postings for each journal entry
    const entriesWithPostings = await Promise.all(
      entries.map(async (entry) => {
        const postings = await db
          .select({
            id: ledgerPostings.id,
            accountId: ledgerPostings.accountId,
            amount: ledgerPostings.amount,
            direction: ledgerPostings.direction,
            accountName: ledgerAccounts.name,
            accountNumber: ledgerAccounts.accountNumber,
          })
          .from(ledgerPostings)
          .innerJoin(ledgerAccounts, eq(ledgerPostings.accountId, ledgerAccounts.id))
          .where(eq(ledgerPostings.journalEntryId, entry.id));

        return {
          ...entry,
          postings,
        };
      })
    );

    return {
      accounts: accountsWithBalances,
      journalEntries: entriesWithPostings,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    };
  },
};
