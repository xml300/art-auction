import { db } from "@/data/db";
import { auditLogs } from "@/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { AuditLog, NewAuditLog } from "@/types";
import { Tx } from "./types";

export interface CreateAuditLogInput {
  actorId?: number | null;
  actorType?: "user" | "system" | "admin" | "guest" | string;
  action: string;
  resourceType?: string | null;
  resourceId?: string | number | null;
  status?: "success" | "failure" | "warning";
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | string | null;
}

export interface AuditLogFilter {
  actorId?: number;
  actorType?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export const AuditLogs = {
  /**
   * Records an immutable audit log entry.
   * By default, errors are caught and logged so audit logging never crashes primary transactions.
   */
  create: async (
    input: CreateAuditLogInput,
    tx?: Tx,
    options?: { throwOnError?: boolean }
  ): Promise<AuditLog | null> => {
    try {
      const client = tx || db;

      let metadataStr: string | null = null;
      if (input.metadata) {
        metadataStr =
          typeof input.metadata === "string"
            ? input.metadata
            : JSON.stringify(input.metadata);
      }

      const logData: NewAuditLog = {
        actorId: input.actorId ?? null,
        actorType: input.actorType || (input.actorId ? "user" : "system"),
        action: input.action,
        resourceType: input.resourceType ?? null,
        resourceId: input.resourceId != null ? String(input.resourceId) : null,
        status: input.status || "success",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ? input.userAgent.slice(0, 500) : null,
        metadata: metadataStr,
      };

      const [record] = await client.insert(auditLogs).values(logData).returning();
      return record;
    } catch (err) {
      console.error("Failed to write audit log:", err);
      if (options?.throwOnError) {
        throw err;
      }
      return null;
    }
  },

  /**
   * Retrieves paginated audit logs filtered by criteria.
   */
  get: async (
    filter?: AuditLogFilter
  ): Promise<{ logs: AuditLog[]; totalCount: number }> => {
    const conditions = [];

    if (filter?.actorId !== undefined) {
      conditions.push(eq(auditLogs.actorId, filter.actorId));
    }
    if (filter?.actorType) {
      conditions.push(eq(auditLogs.actorType, filter.actorType));
    }
    if (filter?.action) {
      conditions.push(eq(auditLogs.action, filter.action));
    }
    if (filter?.resourceType) {
      conditions.push(eq(auditLogs.resourceType, filter.resourceType));
    }
    if (filter?.resourceId) {
      conditions.push(eq(auditLogs.resourceId, filter.resourceId));
    }
    if (filter?.status) {
      conditions.push(eq(auditLogs.status, filter.status));
    }
    if (filter?.startDate) {
      conditions.push(gte(auditLogs.createdAt, filter.startDate));
    }
    if (filter?.endDate) {
      conditions.push(lte(auditLogs.createdAt, filter.endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const page = Math.max(1, filter?.page || 1);
    const limit = Math.min(200, Math.max(1, filter?.limit || 50));
    const offset = (page - 1) * limit;

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(whereClause);

    const totalCount = Number(countResult?.count || 0);

    const logs = await db
      .select()
      .from(auditLogs)
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    return { logs, totalCount };
  },
};
