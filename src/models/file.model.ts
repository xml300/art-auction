import { db } from "@/data/db";
import { files } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { FileRecord, NewFileRecord, FileCategory, FileStatus } from "@/types";
import { Tx } from "./types";

export const Files = {
  create: async (data: NewFileRecord, tx?: Tx): Promise<FileRecord> => {
    const database = tx || db;
    const [record] = await database.insert(files).values(data).returning();
    return record;
  },

  findById: async (id: number, tx?: Tx): Promise<FileRecord | undefined> => {
    const database = tx || db;
    const [record] = await database.select().from(files).where(eq(files.id, id));
    return record;
  },

  findByStorageKey: async (storageKey: string, tx?: Tx): Promise<FileRecord | undefined> => {
    const database = tx || db;
    const [record] = await database.select().from(files).where(eq(files.storageKey, storageKey));
    return record;
  },

  updateStatus: async (
    id: number,
    status: FileStatus,
    extra?: Partial<Pick<FileRecord, "publicUrl" | "sizeBytes" | "sha256Hash">>,
    tx?: Tx
  ): Promise<FileRecord | undefined> => {
    const database = tx || db;
    const [record] = await database
      .update(files)
      .set({ status, ...extra })
      .where(eq(files.id, id))
      .returning();
    return record;
  },

  listByUser: async (
    userId: number,
    options?: { category?: FileCategory; status?: FileStatus },
    tx?: Tx
  ): Promise<FileRecord[]> => {
    const database = tx || db;
    const conditions = [eq(files.userId, userId)];

    if (options?.category) {
      conditions.push(eq(files.category, options.category));
    }
    if (options?.status) {
      conditions.push(eq(files.status, options.status));
    }

    return database
      .select()
      .from(files)
      .where(and(...conditions))
      .orderBy(desc(files.createdAt));
  },

  listByEntity: async (
    entityType: string,
    entityId: number,
    tx?: Tx
  ): Promise<FileRecord[]> => {
    const database = tx || db;
    return database
      .select()
      .from(files)
      .where(and(eq(files.entityType, entityType), eq(files.entityId, entityId)))
      .orderBy(desc(files.createdAt));
  },

  delete: async (id: number, tx?: Tx): Promise<boolean> => {
    const database = tx || db;
    const [record] = await database
      .update(files)
      .set({ status: "deleted" })
      .where(eq(files.id, id))
      .returning();
    return !!record;
  },
};
