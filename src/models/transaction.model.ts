import { db } from "@/data/db";
import { transactions } from "@/db/schema";
import { eq, getTableColumns, asc, desc, sql } from "drizzle-orm";
import { Transaction, NewTransaction, TransactionType, TransactionStatus } from "@/types";
import { Tx } from "./types";

export const Transactions = {
  get: async (
    userId?: number,
    options?: {
      sortBy?: keyof Transaction;
      sortOrder?: "asc" | "desc";
      page?: number;
      limit?: number;
    }
  ): Promise<{ transactions: Transaction[]; totalCount: number }> => {
    let query = db.select().from(transactions).$dynamic();
    let offset = 0;
    let limit = 150;

    if (userId) {
      query = query.where(eq(transactions.userId, userId));
    }
    if (options && options.sortBy) {
      const columns = getTableColumns(transactions);
      const column = columns[options.sortBy as keyof typeof columns];
      if (options.sortOrder === "asc") {
        query = query.orderBy(asc(column));
      } else {
        query = query.orderBy(desc(column));
      }
    }
    if (options?.page && options?.limit) {
      limit = options.limit;
      offset = (options.page - 1) * options.limit;
    }

    const totalCountRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(userId ? eq(transactions.userId, userId) : sql`true`);
    const totalCount = Number(totalCountRes[0]?.count || 0);

    const trxns = await query.limit(limit).offset(offset);

    return { transactions: trxns, totalCount };
  },

  getByReference: async (referenceNumber: string): Promise<Transaction | undefined> => {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.transRef, referenceNumber));
    return transaction;
  },

  create: async (
    userId: number,
    referenceNumber: string,
    description: string,
    payType: TransactionType,
    amount: string,
    status: TransactionStatus,
    artworkId?: number,
    tx?: Tx
  ) => {
    const transaction: NewTransaction = {
      userId,
      transRef: referenceNumber,
      description,
      type: payType,
      amount,
      status,
    };
    if (artworkId) transaction.artworkId = artworkId;

    const [newTransaction] = tx
      ? await tx.insert(transactions).values(transaction).returning()
      : await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  },

  update: async <K extends keyof Transaction>(
    id: number,
    updates: { [key in K]: Transaction[K] },
    tx?: Tx
  ) => {
    if (tx) {
      await tx.update(transactions).set(updates).where(eq(transactions.id, id));
    } else {
      await db.update(transactions).set(updates).where(eq(transactions.id, id));
    }
  },
};
