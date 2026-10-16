import { getUsersProfile } from "@/data/queries";
import ArtworkCard from "@/components/ArtworkCard";
import EmptyState from "@/components/EmptyState";
import StatsCard from "@/components/StatsCard";
import {
  ImageIcon,
  Coins,
  TrendingUp,
  Heart,
  Award,
  Clock,
  Target,
  Activity,
  ArrowRight,
  UserX,
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

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Statistics Overview */}
      <section>
        <div className="mb-4">
          <span className="text-xs uppercase font-bold tracking-wider text-primary">
            Metrics & Portfolio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
            Statistics Overview
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Artworks Owned"
            value={userProfile.stats.artworksOwned}
            subtitle="Pieces in vault"
            icon={<ImageIcon className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Spent"
            value={formatCurrency(userProfile.stats.totalSpent)}
            subtitle="Lifetime volume"
            icon={<Coins className="w-5 h-5" />}
          />
          <StatsCard
            title="Auctions Won"
            value={userProfile.stats.auctionsWon}
            subtitle="Successful lots"
            icon={<Award className="w-5 h-5" />}
          />
          <StatsCard
            title="Watchlist Items"
            value={userProfile.stats.watchlistItems}
            subtitle="Tracking lots"
            icon={<Heart className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Bids"
            value={userProfile.stats.activeBids}
            subtitle="In progress"
            icon={<Target className="w-5 h-5" />}
          />
          <StatsCard
            title="Avg. Bid Amount"
            value={formatCurrency(userProfile.stats.avgBidAmount)}
            subtitle="Historical average"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Collector Tenure"
            value={`${userProfile.stats.memberSince} yrs`}
            subtitle="Member since launch"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatsCard
            title="Success Rate"
            value={`${userProfile.stats.successRate}%`}
            subtitle="Win percentage"
            icon={<Activity className="w-5 h-5" />}
            trend={{ value: `${userProfile.stats.successRate}% win`, isPositive: userProfile.stats.successRate >= 50 }}
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
