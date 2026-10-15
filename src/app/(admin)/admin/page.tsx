import { Admin } from "@/models";
import { formatCurrency } from "@/lib/utils";
import StatsCard from "@/components/StatsCard";
import AdminActions from "./AdminActions";
import Link from "next/link";
import {
  Coins,
  Landmark,
  ShieldCheck,
  Wallet,
  Gavel,
  Clock,
  Users,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const metrics = await Admin.getMetrics();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Platform Governance
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Executive Overview
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time status of marketplace liquidity, auction engine, and security telemetry.
          </p>
        </div>

        <AdminActions />
      </div>

      {/* Financial Health & Invariant Alert */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          metrics.finance.ledgerBalanced
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100"
            : "bg-rose-500/5 border-rose-500/20 text-rose-950 dark:text-rose-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              metrics.finance.ledgerBalanced
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            {metrics.finance.ledgerBalanced ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertOctagon className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <span>Double-Entry Ledger Integrity:</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  metrics.finance.ledgerBalanced
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {metrics.finance.ledgerBalanced ? "Balanced (Invariant Preserved)" : "Discrepancy Detected"}
              </span>
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              Total debits (₦{(metrics.finance.totalDebitsKobo / 100).toLocaleString("en-NG")}) match total credits (₦{(metrics.finance.totalCreditsKobo / 100).toLocaleString("en-NG")}) across all postings.
            </p>
          </div>
        </div>

        <Link
          href="/admin/finance"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          Inspect Ledger
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary KPI Grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold tracking-tight text-text uppercase text-text-muted">
          Platform Financial & Escrow Metrics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Transaction Volume"
            value={formatCurrency(metrics.finance.totalTransactionsVolume)}
            subtitle={`${metrics.finance.totalTransactionsCount} completed transactions`}
            icon={<Coins className="w-5 h-5" />}
          />
          <StatsCard
            title="Platform Fee Revenue"
            value={formatCurrency(metrics.finance.platformRevenueNaira)}
            subtitle="Accrued from 10% commission"
            icon={<Landmark className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Escrow Held"
            value={formatCurrency(metrics.finance.escrowHeldNaira)}
            subtitle="Secured by active bid holds"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <StatsCard
            title="User Wallet Liabilities"
            value={formatCurrency(metrics.finance.userLiabilitiesNaira)}
            subtitle="Customer available balances"
            icon={<Wallet className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Auction Engine & User Governance Grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold tracking-tight text-text uppercase text-text-muted">
          Marketplace Activity & Demographics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Auctions"
            value={metrics.auctions.active}
            subtitle={`${metrics.auctions.total} total catalog lots`}
            icon={<Gavel className="w-5 h-5" />}
          />
          <StatsCard
            title="Pending Settlement"
            value={metrics.auctions.pendingSettlement}
            subtitle={
              metrics.auctions.pendingSettlement > 0
                ? "Requires settlement run"
                : "All expired auctions settled"
            }
            icon={<Clock className="w-5 h-5" />}
            trend={
              metrics.auctions.pendingSettlement > 0
                ? { value: `${metrics.auctions.pendingSettlement} lots waiting`, isPositive: false }
                : { value: "Up to date", isPositive: true }
            }
          />
          <StatsCard
            title="Total Registered Users"
            value={metrics.users.total}
            subtitle={`${metrics.users.collectors} Collectors · ${metrics.users.artists} Artists`}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Bids Placed"
            value={metrics.bids.totalCount}
            subtitle={`₦${(metrics.bids.totalVolume).toLocaleString("en-NG")} cumulative volume`}
            icon={<Coins className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Module Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/auctions"
          className="group p-5 rounded-2xl border border-border-subtle bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary mb-3">
              <Gavel className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-text group-hover:text-primary transition-colors">
              Auction & Artwork Moderation
            </h4>
            <p className="text-xs text-text-muted mt-1">
              Inspect active lots, view bids breakdown, verify artists, and trigger individual settlements.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-4">
            Manage Catalog
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/users"
          className="group p-5 rounded-2xl border border-border-subtle bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-text group-hover:text-primary transition-colors">
              User Directory & Roles
            </h4>
            <p className="text-xs text-text-muted mt-1">
              Search collectors and artists, monitor wallet balances, and manage role permissions.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-4">
            Browse Users
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/audit-logs"
          className="group p-5 rounded-2xl border border-border-subtle bg-surface hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="p-2.5 w-fit rounded-xl bg-primary/10 text-primary mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-text group-hover:text-primary transition-colors">
              Security Audit Stream
            </h4>
            <p className="text-xs text-text-muted mt-1">
              Audit logins, authentication telemetry, financial movements, and administrative interventions.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-4">
            Inspect Audit Trail
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Recent Security Audit Logs Section */}
      <section className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-text">Recent Security Audit Logs</h3>
            <p className="text-xs text-text-muted">Real-time tamper-evident events</p>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View All Logs
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted font-semibold">
                <th className="pb-2.5 px-3">Timestamp</th>
                <th className="pb-2.5 px-3">Action</th>
                <th className="pb-2.5 px-3">Actor</th>
                <th className="pb-2.5 px-3">Resource</th>
                <th className="pb-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {metrics.recentAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-2.5 px-3 text-text-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-medium text-text">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-text-muted">
                    {log.actorType} {log.actorId ? `(#${log.actorId})` : ""}
                  </td>
                  <td className="py-2.5 px-3 text-text-muted">
                    {log.resourceType ? `${log.resourceType} ${log.resourceId ? `#${log.resourceId}` : ""}` : "—"}
                  </td>
                  <td className="py-2.5 px-3">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
