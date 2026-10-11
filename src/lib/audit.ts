import { NextRequest } from "next/server";
import { AuditLogs, CreateAuditLogInput } from "@/models/auditLog.model";
import { Tx } from "@/models/types";

export function getClientMetadata(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || null;
  const userAgent = request.headers.get("user-agent") || null;
  return { ipAddress, userAgent };
}

export async function logAuditEvent(
  request: NextRequest | null,
  event: Omit<CreateAuditLogInput, "ipAddress" | "userAgent"> & { ipAddress?: string | null; userAgent?: string | null },
  tx?: Tx
) {
  const clientMeta = request ? getClientMetadata(request) : { ipAddress: null, userAgent: null };

  return await AuditLogs.create(
    {
      ...event,
      ipAddress: event.ipAddress !== undefined ? event.ipAddress : clientMeta.ipAddress,
      userAgent: event.userAgent !== undefined ? event.userAgent : clientMeta.userAgent,
    },
    tx
  );
}
