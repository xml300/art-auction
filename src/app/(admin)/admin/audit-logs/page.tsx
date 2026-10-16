"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Loader2,
  Code,
  X,
} from "lucide-react";

interface AuditLogEntry {
  id: number;
  actorId: number | null;
  actorType: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  status: "success" | "failure" | "warning";
  ipAddress: string | null;
  userAgent: string | null;
  metadata: string | null;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionSearch, setActionSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "30",
      });
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (actionSearch.trim()) {
        params.set("action", actionSearch.trim());
      }

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setLogs(data.logs || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, actionSearch, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Security Telemetry
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Security & Audit Logs
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Immutable log trail of all authentication events, administrative actions, and data mutations{totalCount > 0 ? ` (${totalCount} total events)` : ""}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-surface p-3 rounded-2xl border border-border-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Statuses" },
            { id: "success", label: "Success" },
            { id: "failure", label: "Failures / Warnings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text hover:bg-surface-elevated"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Filter by action (e.g. auth.login)..."
            value={actionSearch}
            onChange={(e) => {
              setActionSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-elevated border border-border-subtle text-xs text-text focus:outline-hidden focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Loading audit telemetry...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-xs">
            No audit logs found matching the filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-elevated/40 text-text-muted font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-surface-elevated/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-text-muted">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-text">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      <span className="capitalize">{log.actorType}</span>{" "}
                      {log.actorId ? `(#${log.actorId})` : ""}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                          log.status === "success"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      {log.resourceType ? `${log.resourceType}${log.resourceId ? `:${log.resourceId}` : ""}` : "—"}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-text-muted">
                      {log.ipAddress || "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] font-semibold text-primary hover:underline">
                        Inspect
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalCount > 30 && (
          <div className="flex items-center justify-between p-4 border-t border-border-subtle bg-surface text-xs">
            <span className="text-text-muted">
              Showing {(page - 1) * 30 + 1}–{Math.min(page * 30, totalCount)} of {totalCount} logs
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 min-h-[44px] rounded-card border border-border-subtle text-xs font-semibold disabled:opacity-40 hover:bg-surface-elevated transition-colors"
              >
                Previous
              </button>
              <span className="px-2 font-semibold text-text">Page {page} of {Math.ceil(totalCount / 30) || 1}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 30 >= totalCount}
                className="px-3 py-1.5 min-h-[44px] rounded-card border border-border-subtle text-xs font-semibold disabled:opacity-40 hover:bg-surface-elevated transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-card border border-border-subtle shadow-gallery-elevated max-w-lg w-full p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-accent" />
                <h3 className="font-serif font-bold text-sm text-text">Audit Event #{selectedLog.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                aria-label="Close dialog"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-card text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-3 py-1 border-b border-border-subtle/50">
                <span className="text-text-muted">Action:</span>
                <span className="col-span-2 font-mono font-medium text-text">{selectedLog.action}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border-subtle/50">
                <span className="text-text-muted">Actor:</span>
                <span className="col-span-2 text-text">{selectedLog.actorType} (ID: {selectedLog.actorId ?? "None"})</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border-subtle/50">
                <span className="text-text-muted">Status:</span>
                <span className="col-span-2 uppercase font-bold text-[10px]">{selectedLog.status}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border-subtle/50">
                <span className="text-text-muted">Timestamp:</span>
                <span className="col-span-2 text-text">{new Date(selectedLog.createdAt).toISOString()}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border-subtle/50">
                <span className="text-text-muted">IP Address:</span>
                <span className="col-span-2 font-mono text-text">{selectedLog.ipAddress || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-border-subtle/50">
                <span className="text-text-muted">User Agent:</span>
                <span className="col-span-2 text-[11px] text-text-muted truncate">{selectedLog.userAgent || "N/A"}</span>
              </div>

              <div className="pt-2">
                <span className="text-text-muted font-semibold block mb-1">Event Metadata:</span>
                <pre className="p-3 rounded-card bg-surface-elevated border border-border-subtle font-mono text-[11px] overflow-x-auto text-text max-h-48 whitespace-pre-wrap break-all">
                  {(() => {
                    if (!selectedLog.metadata) return "No metadata recorded.";
                    try {
                      return JSON.stringify(JSON.parse(selectedLog.metadata), null, 2);
                    } catch {
                      return selectedLog.metadata;
                    }
                  })()}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 min-h-[44px] rounded-card bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors shadow-gallery"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
