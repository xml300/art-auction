"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import StatsCard from "@/components/StatsCard";
import ArtworkGrid from "@/components/ArtworkGrid";
import ActivityFeed from "@/components/ActivityFeed";
import { Activity, Artwork } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";
import { AlertCircle, ImageIcon, Coins, Award, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectorProfile {
  name: string;
  username: string;
  profilePicture: string;
  bio: string;
  socialMedia: {
    twitter?: string;
    instagram?: string;
  };
  stats: {
    artworksOwned: number;
    totalSpent: number;
    auctionsWon: number;
    watchlistItems: number;
  };
  ownedArtworks: Artwork[];
  watchlist: Artwork[];
  activity: Activity[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [collectorProfile, setCollectorProfile] = useState<CollectorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get<CollectorProfile>("/profile");
        setCollectorProfile(response);
      } catch (err: unknown) {
        console.error("Error:", (err as Error).message);
        setError("Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (error) {
    return (
      <div className="p-4 sm:p-6 text-center max-w-lg mx-auto">
        <div
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center justify-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (isLoading || !collectorProfile) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-44 rounded-2xl bg-surface-elevated animate-pulse border border-border-subtle" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="space-y-6">
            <ProfileHeader
              name={collectorProfile.name}
              username={collectorProfile.username}
              profilePicture={collectorProfile.profilePicture}
              bio={collectorProfile.bio}
              socialMedia={collectorProfile.socialMedia}
            />
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Artworks Owned"
                value={collectorProfile.stats.artworksOwned}
                icon={<ImageIcon className="w-4 h-4" />}
              />
              <StatsCard
                title="Total Spent"
                value={formatCurrency(collectorProfile.stats.totalSpent)}
                icon={<Coins className="w-4 h-4" />}
              />
              <StatsCard
                title="Auctions Won"
                value={collectorProfile.stats.auctionsWon}
                icon={<Award className="w-4 h-4" />}
              />
              <StatsCard
                title="Watchlist Items"
                value={collectorProfile.stats.watchlistItems}
                icon={<Heart className="w-4 h-4" />}
              />
            </section>
          </div>
        );
      case "Artworks Showcase":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-text">My Collection</h2>
            <ArtworkGrid
              artworks={collectorProfile.ownedArtworks}
              emptyMessage="No artworks in your collection yet."
              baseUrl="/dashboard/my-artworks"
            />
          </section>
        );
      case "Activity Summary":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-text">Recent Activity</h2>
            <ActivityFeed
              activity={collectorProfile.activity}
              emptyMessage="No recent account activity."
            />
          </section>
        );
      case "Watchlist":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-text">My Watchlist</h2>
            <ArtworkGrid
              artworks={collectorProfile.watchlist}
              emptyMessage="Your watchlist is empty."
              baseUrl="/dashboard/marketplace"
            />
          </section>
        );
      default:
        return null;
    }
  };

  const tabs = ["Overview", "Artworks Showcase", "Activity Summary", "Watchlist"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Collector Profile</h1>
        <p className="text-xs text-text-muted mt-1">Manage your public presence and collection archives</p>
      </div>

      <div className="border-b border-border-subtle">
        <nav className="flex gap-2 sm:gap-6 overflow-x-auto pb-px" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors",
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-text-muted hover:text-text hover:border-border-subtle"
                )}
              >
                {tab}
              </button>
            );
          })}
        </nav>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
