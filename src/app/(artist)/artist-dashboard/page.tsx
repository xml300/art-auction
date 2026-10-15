import { getArtistProfile } from "@/data/queries";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import StatsCard from "@/components/StatsCard";
import ArtworkCard from "@/components/ArtworkCard";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import {
  Palette,
  PlusCircle,
  DollarSign,
  Flame,
  TrendingUp,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Clock,
  Gavel,
  Sparkles,
} from "lucide-react";

export default async function ArtistDashboardPage() {
  const [session] = await getSession();
  const profile = await getArtistProfile(session?.userId || null);

  if (!profile) {
    return (
      <EmptyState
        title="Artist Profile Not Found"
        message="Could not load your artist studio profile. Please try logging in again."
        iconSrc="/icons/user.svg"
      />
    );
  }

  const { stats, activeArtworks, recentBids } = profile;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Studio Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Artist Studio Overview
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            Welcome back, {profile.name || profile.username}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Track your live auctions, incoming collector bids, and artwork catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/artist-dashboard/artworks/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            List New Artwork
          </Link>
        </div>
      </div>

      {/* Metrics & Performance Grid */}
      <section>
        <div className="mb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Studio Analytics
          </span>
          <h2 className="text-xl font-bold tracking-tight text-text">
            Key Performance Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          <StatsCard
            title="Active Auctions"
            value={stats.activeAuctions}
            subtitle="Live lots in gallery"
            icon={<Flame className="w-5 h-5 text-amber-500" />}
          />
          <StatsCard
            title="Total Works"
            value={stats.totalArtworks}
            subtitle="Catalog pieces"
            icon={<Palette className="w-5 h-5" />}
          />
          <StatsCard
            title="Artworks Sold"
            value={stats.soldArtworks}
            subtitle="Settled auctions"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            subtitle="Lifetime sales volume"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Top Active Bid"
            value={formatCurrency(stats.highestBid)}
            subtitle="Highest live offer"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Payable Balance"
            value={formatCurrency(profile.payableBalance)}
            subtitle="Authoritative ledger"
            icon={<Wallet className="w-5 h-5 text-primary" />}
          />
        </div>
      </section>

      {/* Live Auctions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Marketplace Lots
            </span>
            <h2 className="text-xl font-bold tracking-tight text-text">
              Active Live Auctions ({activeArtworks.length})
            </h2>
          </div>

          <Link
            href="/artist-dashboard/artworks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            Manage Catalog
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeArtworks.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-2xl border border-dashed border-border-subtle bg-surface text-center flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-primary/10 text-primary mb-3">
              <Palette className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text">No Active Auctions</h3>
            <p className="text-xs sm:text-sm text-text-muted max-w-md mt-1 mb-5">
              You currently have no artworks actively being auctioned. Create a new listing to start collecting bids!
            </p>
            <Link
              href="/artist-dashboard/artworks/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              List Artwork Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {activeArtworks.slice(0, 8).map((artwork, idx) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                index={idx}
                customHref={`/artist-dashboard/artworks`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Two Column Bottom Section: Recent Bids & Studio Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bids Feed */}
        <section className="lg:col-span-2 rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-base text-text">Recent Incoming Bids</h3>
            </div>
            <span className="text-xs text-text-muted">
              {recentBids.length} latest events
            </span>
          </div>

          {recentBids.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-xs">
              No bids have been placed on your artworks yet.
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {recentBids.map((bid) => (
                <div
                  key={bid.id}
                  className="py-3 flex items-center justify-between text-xs sm:text-sm hover:bg-surface-elevated/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                      <Gavel className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-text truncate">
                        <span className="text-primary font-semibold">@{bid.bidderUsername}</span> placed a bid on{" "}
                        <span className="font-semibold text-text">&ldquo;{bid.artworkTitle}&rdquo;</span>
                      </p>
                      <p className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {bid.bidTime ? new Date(bid.bidTime).toLocaleDateString() : "Recent"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-bold text-emerald-600 dark:text-emerald-400 pl-3">
                    {formatCurrency(bid.bidAmount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Studio Summary & Shortcuts */}
        <section className="space-y-4">
          {/* Quick Actions Panel */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-base text-text mb-3">Studio Actions</h3>
            
            <Link
              href="/artist-dashboard/artworks/new"
              className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated hover:border-primary/40 border border-border-subtle transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">List New Artwork</p>
                  <p className="text-[11px] text-text-muted">Launch a new auction</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/artist-dashboard/artworks"
              className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated hover:border-primary/40 border border-border-subtle transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">Manage Artworks</p>
                  <p className="text-[11px] text-text-muted">{stats.totalArtworks} pieces in catalog</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/artist-dashboard/earnings"
              className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated hover:border-primary/40 border border-border-subtle transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text">Sales & Payouts</p>
                  <p className="text-[11px] text-text-muted">{formatCurrency(profile.payableBalance)} available</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
            </Link>
          </div>

          {/* Settlement & Payout Policy Note */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-text-muted space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-text">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Transparent Double-Entry Settlement</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              When your auction ends with a winning bid, the 90% artist proceeds are automatically credited to your immutable double-entry ledger account, less a 10% platform commission.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
