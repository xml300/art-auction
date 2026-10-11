import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserRole, getAuditLogs } from "@/data/queries";

export async function GET(request: NextRequest) {
  const [session, authError] = await getSession();

  if (authError || !session) {
    return NextResponse.json(
      { success: false, error: authError || "Authentication required" },
      { status: 401 }
    );
  }

  // Authorize: Only Admins can inspect security audit logs
  let isAdmin = session.roleId === 0;
  if (!isAdmin) {
    try {
      const userRole = await getUserRole(session.userId);
      if (userRole && (userRole.id === 0 || userRole.name.toLowerCase() === "admin")) {
        isAdmin = true;
      }
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Access denied. Administrator privileges required." },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;

  const actorIdParam = searchParams.get("actorId");
  const actorType = searchParams.get("actorType") || undefined;
  const action = searchParams.get("action") || undefined;
  const resourceType = searchParams.get("resourceType") || undefined;
  const resourceId = searchParams.get("resourceId") || undefined;
  const status = searchParams.get("status") || undefined;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  const filter = {
    actorId: actorIdParam ? parseInt(actorIdParam) : undefined,
    actorType,
    action,
    resourceType,
    resourceId,
    status,
    startDate: startDateParam ? new Date(startDateParam) : undefined,
    endDate: endDateParam ? new Date(endDateParam) : undefined,
    page: pageParam ? Math.max(1, parseInt(pageParam)) : 1,
    limit: limitParam ? Math.min(200, Math.max(1, parseInt(limitParam))) : 50,
  };

  const { logs, totalCount } = await getAuditLogs(filter);

  return NextResponse.json({
    success: true,
    page: filter.page,
    limit: filter.limit,
    totalCount,
    totalPages: Math.ceil(totalCount / filter.limit),
    logs,
  });
}
