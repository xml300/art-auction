import { getArtistProfile } from "@/data/queries";
import { getSession } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import ProfileHeader from "@/components/ProfileHeader";
import StatsCard from "@/components/StatsCard";
import ArtworkCard from "@/components/ArtworkCard";
import Link from "next/link";
import {
  Palette,
  Flame,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Clock,
  Settings,
  PlusCircle,
} from "lucide-react";

export const metadata = {
  title: "Artist Studio Profile | Artsyl",
  description: "View and manage your public artist studio profile, bio, and catalog",
};

export default async function ArtistProfilePage() {
  const [session] = await getSession();
  const profile = await getArtistProfile(session?.userId || null);

  if (!profile) {
    return (
      <EmptyState
        title="Artist Profile Not Found"
        message="Could not load your artist studio profile. Please log in again."
        iconSrc="/icons/user.svg"
      />
    );
  }

  const { stats, allArtworks } = profile;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Profile Header Card */}
      <ProfileHeader
        name={profile.name}
        username={profile.username}
        profilePicture={profile.profilePicture}
        bio={profile.bio}
        socialMedia={profile.socialMedia}
      />

      {/* Edit Profile & Action Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-text">
          Studio Overview & Metrics
        </h2>
        <div className="flex items-center gap-2">
          <Link
            href="/artist-dashboard/settings"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-subtle bg-surface hover:bg-surface-elevated text-xs font-semibold text-text transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Edit Profile
          </Link>
          <Link
            href="/artist-dashboard/artworks/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            List Artwork
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatsCard
          title="Active Lots"
          value={stats.activeAuctions}
          subtitle="Currently open"
          icon={<Flame className="w-4 h-4 text-amber-500" />}
        />
        <StatsCard
          title="Catalog Size"
          value={stats.totalArtworks}
          subtitle="Artworks created"
          icon={<Palette className="w-4 h-4" />}
        />
        <StatsCard
          title="Artworks Sold"
          value={stats.soldArtworks}
          subtitle="Collected pieces"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        />
        <StatsCard
          title="Total Sales"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Hammer volume"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatsCard
          title="Top Bid"
          value={formatCurrency(stats.highestBid)}
          subtitle="Peak active offer"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatsCard
          title="Tenure"
          value={`${stats.memberSince} yrs`}
          subtitle="Studio member"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Artist Works Portfolio */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              Studio Portfolio
            </span>
            <h3 className="text-lg font-bold text-text">
              Artworks Gallery ({allArtworks.length})
            </h3>
          </div>
          <Link
            href="/artist-dashboard/artworks"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View in Catalog
          </Link>
        </div>

        {allArtworks.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-border-subtle bg-surface text-center flex flex-col items-center justify-center">
            <Palette className="w-8 h-8 text-text-muted mb-2" />
            <p className="text-xs text-text-muted">No artworks listed in your studio yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allArtworks.map((art, idx) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                index={idx}
                customHref="/artist-dashboard/artworks"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
