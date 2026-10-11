import { db } from "@/data/db";
import { ledgerAccounts, ledgerJournalEntries, ledgerPostings, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import {
  LedgerAccount,
  LedgerAccountType,
  LedgerPostingDirection,
  LedgerEntryType,
  LedgerJournalEntry,
} from "@/types";
import { Tx } from "./types";

export interface PostingInput {
  accountId: number;
  amount: number; // in kobo, strictly positive
  direction: LedgerPostingDirection;
}

export interface JournalEntryInput {
  idempotencyKey: string;
  entryType: LedgerEntryType;
  reference: string;
  description: string;
  metadata?: Record<string, unknown>;
  postings: PostingInput[];
}

export const Ledger = {
  /**
   * Fetch an account by its unique account number.
   */
  getAccount: async (accountNumber: string, tx?: Tx): Promise<LedgerAccount | undefined> => {
    const client = tx || db;
    const [account] = await client
      .select()
      .from(ledgerAccounts)
      .where(eq(ledgerAccounts.accountNumber, accountNumber));
    return account;
  },

  /**
   * Retrieve an existing ledger account or create it idempotently.
   */
  getOrCreateAccount: async (
    accountNumber: string,
    type: LedgerAccountType,
    name: string,
    userId?: number | null,
    tx?: Tx
  ): Promise<LedgerAccount> => {
    const client = tx || db;
    const existing = await Ledger.getAccount(accountNumber, tx);
    if (existing) return existing;

    const [created] = await client
      .insert(ledgerAccounts)
      .values({
        accountNumber,
        type,
        name,
        userId: userId || null,
        currency: "NGN",
      })
      .onConflictDoNothing({ target: ledgerAccounts.accountNumber })
      .returning();

    if (created) return created;

    const retry = await Ledger.getAccount(accountNumber, tx);
    if (!retry) throw new Error(`Failed to initialize ledger account: ${accountNumber}`);
    return retry;
  },

  getCollectorAvailableAccount: async (userId: number, tx?: Tx) => {
    return Ledger.getOrCreateAccount(
      `collector:available:${userId}`,
      "liability",
      `Collector ${userId} Available Balance`,
      userId,
      tx
    );
  },

  getCollectorEscrowAccount: async (userId: number, tx?: Tx) => {
    return Ledger.getOrCreateAccount(
      `collector:escrow:${userId}`,
      "liability",
      `Collector ${userId} Auction Escrow Hold`,
      userId,
      tx
    );
  },

  getArtistPayableAccount: async (artistId: number, tx?: Tx) => {
    return Ledger.getOrCreateAccount(
      `artist:payable:${artistId}`,
      "liability",
      `Artist ${artistId} Payable Earnings`,
      artistId,
      tx
    );
  },

  getGatewayPaystackAccount: async (tx?: Tx) => {
    return Ledger.getOrCreateAccount(
      "asset:gateway:paystack",
      "asset",
      "Paystack Gateway Clearing Account",
      null,
      tx
    );
  },

  getPlatformCommissionAccount: async (tx?: Tx) => {
    return Ledger.getOrCreateAccount(
      "revenue:platform:commission",
      "revenue",
      "Platform Auction Commission Revenue",
      null,
      tx
    );
  },

  /**
   * Calculates the authoritative balance of a ledger account from its immutable postings.
   * - Asset / Expense: Debits - Credits
   * - Liability / Revenue / Equity: Credits - Debits
   * Balance is always in KOBO.
   */
  getAccountBalance: async (accountId: number, tx?: Tx): Promise<number> => {
    const client = tx || db;
    const [account] = await client
      .select()
      .from(ledgerAccounts)
      .where(eq(ledgerAccounts.id, accountId));

    if (!account) throw new Error(`Ledger account ${accountId} not found`);

    const result = await client
      .select({
        debits: sql<string>`COALESCE(SUM(CASE WHEN ${ledgerPostings.direction} = 'debit' THEN ${ledgerPostings.amount} ELSE 0 END), 0)`,
        credits: sql<string>`COALESCE(SUM(CASE WHEN ${ledgerPostings.direction} = 'credit' THEN ${ledgerPostings.amount} ELSE 0 END), 0)`,
      })
      .from(ledgerPostings)
      .where(eq(ledgerPostings.accountId, accountId));

    const debits = Number(result[0]?.debits || 0);
    const credits = Number(result[0]?.credits || 0);

    if (account.type === "asset" || account.type === "expense") {
      return debits - credits;
    }
    return credits - debits;
  },

  /**
   * Retrieves live available & escrow balances for a user directly from the ledger.
   */
  getUserBalances: async (userId: number, tx?: Tx) => {
    const availableAccount = await Ledger.getCollectorAvailableAccount(userId, tx);
    const escrowAccount = await Ledger.getCollectorEscrowAccount(userId, tx);

    const availableKobo = await Ledger.getAccountBalance(availableAccount.id, tx);
    const escrowKobo = await Ledger.getAccountBalance(escrowAccount.id, tx);

    return {
      availableKobo,
      escrowKobo,
      availableNaira: availableKobo / 100,
      escrowNaira: escrowKobo / 100,
      totalKobo: availableKobo + escrowKobo,
      totalNaira: (availableKobo + escrowKobo) / 100,
    };
  },

  /**
   * Executes an atomic, balanced double-entry journal entry.
   * Strict Invariant: Sum of Debits MUST EQUAL Sum of Credits.
   */
  recordJournalEntry: async (
    entry: JournalEntryInput,
    tx?: Tx
  ): Promise<{ journalEntry: LedgerJournalEntry; duplicate: boolean }> => {
    const execute = async (client: Tx) => {
      // 1. Idempotency Check
      const [existing] = await client
        .select()
        .from(ledgerJournalEntries)
        .where(eq(ledgerJournalEntries.idempotencyKey, entry.idempotencyKey));

      if (existing) {
        return { journalEntry: existing, duplicate: true };
      }

      // 2. Validate Postings
      if (!entry.postings || entry.postings.length < 2) {
        throw new Error("Double-entry journal requires at least two postings (debit and credit).");
      }

      let totalDebits = 0;
      let totalCredits = 0;

      for (const posting of entry.postings) {
        if (!Number.isInteger(posting.amount) || posting.amount <= 0) {
          throw new Error(`Invalid posting amount: ${posting.amount}. Amounts must be strictly positive integers in kobo.`);
        }
        if (posting.direction === "debit") {
          totalDebits += posting.amount;
        } else if (posting.direction === "credit") {
          totalCredits += posting.amount;
        } else {
          throw new Error(`Invalid posting direction: ${posting.direction}`);
        }
      }

      // 3. Mathematical Invariant Check
      if (totalDebits !== totalCredits) {
        throw new Error(
          `Unbalanced ledger entry for "${entry.description}". Debits (${totalDebits}) do not equal Credits (${totalCredits}).`
        );
      }

      // 4. Create Journal Entry Header
      const [journal] = await client
        .insert(ledgerJournalEntries)
        .values({
          idempotencyKey: entry.idempotencyKey,
          entryType: entry.entryType,
          reference: entry.reference,
          description: entry.description,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        })
        .returning();

      // 5. Append Postings
      const postingsToInsert = entry.postings.map((p) => ({
        journalEntryId: journal.id,
        accountId: p.accountId,
        amount: p.amount,
        direction: p.direction,
      }));

      await client.insert(ledgerPostings).values(postingsToInsert);

      return { journalEntry: journal, duplicate: false };
    };

    if (tx) {
      return await execute(tx);
    }
    return await db.transaction(async (newTx) => execute(newTx));
  },

  /**
   * High-Level Workflow: Record a deposit via Paystack into the double-entry ledger.
   * Postings:
   *   Debit:  asset:gateway:paystack
   *   Credit: liability:collector:available:{userId}
   */
  recordDeposit: async (
    params: {
      userId: number;
      amountKobo: number;
      reference: string;
      idempotencyKey: string;
    },
    tx?: Tx
  ) => {
    const run = async (client: Tx) => {
      const gatewayAccount = await Ledger.getGatewayPaystackAccount(client);
      const userAvailable = await Ledger.getCollectorAvailableAccount(params.userId, client);

      const result = await Ledger.recordJournalEntry(
        {
          idempotencyKey: params.idempotencyKey,
          entryType: "deposit",
          reference: params.reference,
          description: `Deposit of ₦${(params.amountKobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
          metadata: { userId: params.userId, amountKobo: params.amountKobo },
          postings: [
            { accountId: gatewayAccount.id, amount: params.amountKobo, direction: "debit" },
            { accountId: userAvailable.id, amount: params.amountKobo, direction: "credit" },
          ],
        },
        client
      );

      // Keep users.wallet synced with current available balance
      await Ledger.syncUserWallet(params.userId, client);
      return result;
    };

    if (tx) return await run(tx);
    return await db.transaction(async (newTx) => run(newTx));
  },

  /**
   * High-Level Workflow: Lock collector funds into escrow hold for an active auction bid.
   * Postings:
   *   Debit:  liability:collector:available:{userId} (reduces available funds)
   *   Credit: liability:collector:escrow:{userId}    (increases escrow hold)
   */
  recordBidHold: async (
    params: {
      userId: number;
      amountKobo: number;
      artworkId: number;
      reference: string;
      idempotencyKey: string;
    },
    tx?: Tx
  ) => {
    const run = async (client: Tx) => {
      const userAvailable = await Ledger.getCollectorAvailableAccount(params.userId, client);
      const userEscrow = await Ledger.getCollectorEscrowAccount(params.userId, client);

      const availableBalance = await Ledger.getAccountBalance(userAvailable.id, client);
      if (availableBalance < params.amountKobo) {
        throw new Error(
          `Insufficient ledger funds: required ₦${params.amountKobo / 100}, available ₦${availableBalance / 100}`
        );
      }

      const result = await Ledger.recordJournalEntry(
        {
          idempotencyKey: params.idempotencyKey,
          entryType: "bid_hold",
          reference: params.reference,
          description: `Escrow hold of ₦${(params.amountKobo / 100).toLocaleString("en-NG")} on artwork #${params.artworkId}`,
          metadata: { userId: params.userId, artworkId: params.artworkId, amountKobo: params.amountKobo },
          postings: [
            { accountId: userAvailable.id, amount: params.amountKobo, direction: "debit" },
            { accountId: userEscrow.id, amount: params.amountKobo, direction: "credit" },
          ],
        },
        client
      );

      await Ledger.syncUserWallet(params.userId, client);
      return result;
    };

    if (tx) return await run(tx);
    return await db.transaction(async (newTx) => run(newTx));
  },

  /**
   * High-Level Workflow: Release locked escrow hold back to collector when outbid.
   * Postings:
   *   Debit:  liability:collector:escrow:{userId}    (clears escrow hold)
   *   Credit: liability:collector:available:{userId} (restores available funds)
   */
  recordBidRelease: async (
    params: {
      userId: number;
      amountKobo: number;
      artworkId: number;
      reference: string;
      idempotencyKey: string;
    },
    tx?: Tx
  ) => {
    const run = async (client: Tx) => {
      const userAvailable = await Ledger.getCollectorAvailableAccount(params.userId, client);
      const userEscrow = await Ledger.getCollectorEscrowAccount(params.userId, client);

      const result = await Ledger.recordJournalEntry(
        {
          idempotencyKey: params.idempotencyKey,
          entryType: "bid_release",
          reference: params.reference,
          description: `Escrow release of ₦${(params.amountKobo / 100).toLocaleString("en-NG")} for artwork #${params.artworkId}`,
          metadata: { userId: params.userId, artworkId: params.artworkId, amountKobo: params.amountKobo },
          postings: [
            { accountId: userEscrow.id, amount: params.amountKobo, direction: "debit" },
            { accountId: userAvailable.id, amount: params.amountKobo, direction: "credit" },
          ],
        },
        client
      );

      await Ledger.syncUserWallet(params.userId, client);
      return result;
    };

    if (tx) return await run(tx);
    return await db.transaction(async (newTx) => run(newTx));
  },

  /**
   * High-Level Workflow: Settle a completed auction.
   * Splits winning escrow amount between artist payable and platform commission.
   * Postings:
   *   Debit:  liability:collector:escrow:{winnerId}  (total winning bid)
   *   Credit: liability:artist:payable:{artistId}    (artist net payout)
   *   Credit: revenue:platform:commission            (platform fee)
   */
  recordAuctionSettlement: async (
    params: {
      winnerId: number;
      artistId: number;
      totalAmountKobo: number;
      commissionPercent: number; // e.g. 10 for 10%
      artworkId: number;
      reference: string;
      idempotencyKey: string;
    },
    tx?: Tx
  ) => {
    const run = async (client: Tx) => {
      const winnerEscrow = await Ledger.getCollectorEscrowAccount(params.winnerId, client);
      const artistPayable = await Ledger.getArtistPayableAccount(params.artistId, client);
      const platformRevenue = await Ledger.getPlatformCommissionAccount(client);

      const commissionKobo = Math.round(params.totalAmountKobo * (params.commissionPercent / 100));
      const artistPayoutKobo = params.totalAmountKobo - commissionKobo;

      const result = await Ledger.recordJournalEntry(
        {
          idempotencyKey: params.idempotencyKey,
          entryType: "auction_settlement",
          reference: params.reference,
          description: `Auction settlement for artwork #${params.artworkId}`,
          metadata: {
            winnerId: params.winnerId,
            artistId: params.artistId,
            artworkId: params.artworkId,
            totalKobo: params.totalAmountKobo,
            commissionKobo,
            artistPayoutKobo,
          },
          postings: [
            { accountId: winnerEscrow.id, amount: params.totalAmountKobo, direction: "debit" },
            { accountId: artistPayable.id, amount: artistPayoutKobo, direction: "credit" },
            { accountId: platformRevenue.id, amount: commissionKobo, direction: "credit" },
          ],
        },
        client
      );

      await Ledger.syncUserWallet(params.winnerId, client);
      return result;
    };

    if (tx) return await run(tx);
    return await db.transaction(async (newTx) => run(newTx));
  },

  /**
   * Synchronizes `users.wallet` column with the ledger's authoritative available balance.
   * Ensures backwards compatibility with existing UI queries while ledger migration is underway.
   */
  syncUserWallet: async (userId: number, tx?: Tx): Promise<number> => {
    const client = tx || db;
    const availableAccount = await Ledger.getCollectorAvailableAccount(userId, tx);
    const balanceKobo = await Ledger.getAccountBalance(availableAccount.id, tx);

    await client
      .update(users)
      .set({ wallet: balanceKobo })
      .where(eq(users.id, userId));

    return balanceKobo;
  },
};
