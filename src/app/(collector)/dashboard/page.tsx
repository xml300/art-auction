import { getUsersProfile } from "@/data/queries";
import ArtworkCard from "@/components/ArtworkCard";
import EmptyState from "@/components/EmptyState";
import StatsCard from "@/components/StatsCard";
import {
  Coins,
  Heart,
  Award,
  Target,
  ArrowRight,
  UserX,
  Wallet,
  PlusCircle,
  Compass,
  Sparkles,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { Artwork } from "@/types";
import { api } from "@/lib/api";
import Link from "next/link";

export default async function DashboardPage() {
  const [session] = await getSession();
  const userProfile = await getUsersProfile(session!.userId);
  const artworks = await api.get<{ artworks: Artwork[]; totalPages: number }>("/artworks/marketplace");

  if (!userProfile) {
    return (
      <EmptyState
        title="User Not Found"
        message="The requested collector profile could not be loaded."
        icon={<UserX className="w-8 h-8" />}
      />
    );
  }

  const displayName = userProfile.name || userProfile.username;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Collector Welcome & Quick Wallet Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-surface border border-border-subtle shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Collector Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text">
            Welcome back, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Explore curated auctions, monitor live lots, and manage your private art vault.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface-elevated border border-border-subtle">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted block leading-none">
                Wallet Balance
              </span>
              <span className="text-sm font-bold text-text tabular-nums font-mono">
                {formatCurrency(userProfile.wallet)}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/deposit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent-hover shadow-gallery transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Deposit Funds
          </Link>

          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle text-text text-xs font-semibold hover:bg-surface transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-accent" />
            Explore Lots
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid: Consolidated from 8 cards to 4 High-Signal Modules */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-accent">
              Portfolio & Activity
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Collector Overview
            </h2>
          </div>
          <Link
            href="/dashboard/profile"
            className="text-xs font-medium text-text-muted hover:text-accent transition-colors hidden sm:inline-flex items-center gap-1"
          >
            Detailed Analytics
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Vault Portfolio Value */}
          <StatsCard
            title="Vault Holdings"
            value={formatCurrency(userProfile.stats.totalSpent)}
            subtitle={`${userProfile.stats.artworksOwned} artwork${userProfile.stats.artworksOwned === 1 ? "" : "s"} owned`}
            icon={<Coins className="w-5 h-5 text-accent" />}
            trend={{
              value: `${userProfile.stats.artworksOwned} Pieces`,
              isPositive: userProfile.stats.artworksOwned > 0,
            }}
          />

          {/* 2. Active Bids & Live Auctions */}
          <StatsCard
            title="Active Live Bids"
            value={userProfile.stats.activeBids}
            subtitle={
              userProfile.stats.activeBids > 0
                ? "Lots currently in progress"
                : "No live bids in progress"
            }
            icon={<Target className="w-5 h-5 text-amber-500" />}
            trend={
              userProfile.stats.activeBids > 0
                ? { value: "Live Auctions", isPositive: true }
                : undefined
            }
          />

          {/* 3. Auctions Won & Win Rate */}
          <StatsCard
            title="Auctions Won"
            value={userProfile.stats.auctionsWon}
            subtitle={`${userProfile.stats.successRate}% winning percentage`}
            icon={<Award className="w-5 h-5 text-emerald-500" />}
            trend={{
              value: `${userProfile.stats.successRate}% Win Rate`,
              isPositive: userProfile.stats.successRate >= 50,
            }}
          />

          {/* 4. Watchlist Items */}
          <StatsCard
            title="Watchlist Lots"
            value={userProfile.stats.watchlistItems}
            subtitle="Tracking lots of interest"
            icon={<Heart className="w-5 h-5 text-rose-500" />}
          />
        </div>
      </section>

      {/* My Vault Artworks */}
      <section className="pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
              Private Vault
            </span>
            <h2 className="text-xl sm:text-2xl font-serif italic text-text">
              Acquired Collection
            </h2>
          </div>
          {userProfile.ownedArtworks.length > 0 && (
            <Link
              href="/dashboard/my-artworks"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-catalog font-semibold text-text hover:text-accent transition-colors"
            >
              <span>View Vault ({userProfile.ownedArtworks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {userProfile.ownedArtworks.length === 0 ? (
          <EmptyState
            title="Vault is Empty"
            message="You haven't acquired any artworks yet. Explore active auctions in the marketplace to place your first bid!"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProfile.ownedArtworks.slice(0, 3).map((art, index) => (
              <ArtworkCard key={art.id} artwork={art} index={index} owned={true} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Marketplace Lots */}
      <section className="pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-catalog font-medium text-text-muted">
              Live Auctions
            </span>
            <h2 className="text-xl sm:text-2xl font-serif italic text-text">
              Current Marketplace
            </h2>
          </div>
          <Link
            href="/dashboard/marketplace"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-catalog font-semibold text-text hover:text-accent transition-colors"
          >
            <span>View All Lots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.artworks.slice(0, 6).map((art, index) => (
            <ArtworkCard key={art.id} artwork={art} index={index} owned={false} />
          ))}
        </div>
      </section>
    </div>
  );
}
