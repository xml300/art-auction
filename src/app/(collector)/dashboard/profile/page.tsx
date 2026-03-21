"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import StatsCard from "@/components/StatsCard";
import ArtworkGrid from "@/components/ArtworkGrid";
import ActivityFeed from "@/components/ActivityFeed";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Activity, Artwork } from "@/types";


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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                
                const response = await fetch("/api/profile");
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }
                const data = await response.json();
                setCollectorProfile(data);
                console.log(data);    
             } catch (err: unknown) {
                console.error("Error:", (err as Error).message);
                setError("Failed to fetch profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    if (!collectorProfile) {
        return <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">No profile data available.</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <>
                        <ProfileHeader
                            name={collectorProfile.name}
                            username={collectorProfile.username}
                            profilePicture={collectorProfile.profilePicture}
                            bio={collectorProfile.bio}
                            socialMedia={collectorProfile.socialMedia}
                        />
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            <StatsCard title="Artworks Owned" value={collectorProfile.stats.artworksOwned} />
                            <StatsCard title="Total Spent" value={`$${collectorProfile.stats.totalSpent.toLocaleString()}`} />
                            <StatsCard title="Auctions Won" value={collectorProfile.stats.auctionsWon} />
                            <StatsCard title="Watchlist Items" value={collectorProfile.stats.watchlistItems} />
                        </section>
                    </>
                );
            case "Artworks Showcase":
                return (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-6">My Collection</h2>
                        <ArtworkGrid
                            artworks={collectorProfile.ownedArtworks}
                            emptyMessage="No artworks in your collection yet."
                            baseUrl="/dashboard/my-artworks"
                        />
                    </section>
                );
            case "Activity Summary":
                return (
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
                        <ActivityFeed
                            activity={collectorProfile.activity}
                            emptyMessage="No recent activity."
                        />
                    </section>
                );
            case "Watchlist":
                return (
                    <section>
                        <h2 className="text-xl font-semibold mb-6">My Watchlist</h2>
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

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8  ">Collector Profile</h1>

            <div className="mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 animate-fade-in-delay-1">
                <nav className="-mb-px flex flex-wrap gap-2 sm:gap-4 lg:space-x-8" aria-label="Tabs">
                    {["Overview", "Artworks Showcase", "Activity Summary", "Watchlist"].map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                    ? "border-red-800 text-red-600 dark:text-red-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500"
                            } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-3 lg:px-1 border-b-2 font-medium text-base sm:text-lg hover:scale-105 transition-transform duration-200`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="animate-fade-in-delay-2">{renderContent()}</div>
        </div>
    );
}
