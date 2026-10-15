import { getArtistProfile } from "@/data/queries";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import StatsCard from "@/components/StatsCard";
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Sales & Earnings | Artsyl Artist Studio",
  description: "View your double-entry ledger earnings, auction settlements, and payout history",
};

export default async function ArtistEarningsPage() {
  const [session] = await getSession();
  const profile = await getArtistProfile(session?.userId || null);

  if (!profile) {
    return (
      <EmptyState
        title="Profile Not Found"
        message="Could not load your studio earnings. Please try logging in again."
        iconSrc="/icons/user.svg"
      />
    );
  }

  const { stats, recentTransactions, payableBalance } = profile;
  const platformCommissionEstimate = parseFloat((stats.totalRevenue * 0.1).toFixed(2));
  const grossSalesEstimate = parseFloat((stats.totalRevenue + platformCommissionEstimate).toFixed(2));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Immutable Double-Entry Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            Sales & Earnings
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Authoritative accounting of your artwork auction proceeds, platform fee deductions, and payouts.
          </p>
        </div>
      </div>

      {/* Financial Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Available Studio Balance"
          value={formatCurrency(payableBalance)}
          subtitle="Authoritative ledger payable"
          icon={<Wallet className="w-5 h-5 text-primary" />}
        />
        <StatsCard
          title="Net Lifetime Earnings"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Proceeds after platform fee"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard
          title="Gross Sales Volume"
          value={formatCurrency(grossSalesEstimate)}
          subtitle="Total hammer price of sold lots"
          icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
        />
        <StatsCard
          title="Settled Artworks"
          value={stats.soldArtworks}
          subtitle="Lots successfully delivered"
          icon={<CheckCircle2 className="w-5 h-5 text-indigo-500" />}
        />
      </div>

      {/* Ledger Settlement Information Card */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5 md:mt-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm text-text">How Artsyl Payout Accounting Works</p>
            <p className="text-text-muted leading-relaxed">
              When an auction concludes, the highest bidder&apos;s escrow is debited atomically in our ledger.
              Artsyl credits <strong>90% of the hammer price</strong> directly to your studio&apos;s payable ledger account
              (<code className="bg-surface px-1.5 py-0.5 rounded border border-border-subtle font-mono text-[10px]">artist:payable:{profile.id}</code>),
              with 10% retained for platform operations.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Payout Transactions Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-base text-text">Payout & Settlement History</h3>
          </div>
          <span className="text-xs text-text-muted">
            {recentTransactions.length} recorded events
          </span>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 text-text-muted text-xs">
            No settlement payouts or transactions recorded yet. Once your first artwork is sold, settlement ledger credits will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated/50 text-text-muted uppercase text-[10px] tracking-wider border-b border-border-subtle">
                <tr>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Description</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted truncate max-w-44">
                      {tx.transRef}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <ArrowDownLeft className="w-3 h-3" />
                        </div>
                        <span>{tx.description || "Auction Settlement Payout"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      +{formatCurrency(parseFloat(tx.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
