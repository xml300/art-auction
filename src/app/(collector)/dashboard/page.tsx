import { getArtworks, getUsersProfile } from "@/data/db";
import { ArtworkCarousel } from "@/components/ArtworksCarousel";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import EmptyState from "@/components/EmptyState";
import {
    ImageIcon,
    DollarSign,
    TrendingUp,
    Heart,
    Award,
    Clock,
    Target,
    Activity
} from "lucide-react";


function formatAmount(amount: number){
    return amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}


export default async function DashboardPage() {
    const userProfile = await getUsersProfile(5); // Using static user ID 1 for demonstration
    const artworks = await getArtworks(); // This will be replaced with userProfile.ownedArtworks
    return (
        <div className="space-y-24">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-fade-in !-my-12">Collector Dashboard</h1>

            {/*Statistics*/}
            <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 animate-fade-in-delay-1">Statistics Overview</h2>
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {/* Artworks Owned */}
                    <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-1 border border-blue-200/50 dark:border-blue-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500 rounded-xl group-hover:bg-blue-600 transition-colors duration-300">
                                <ImageIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-blue-100">{userProfile.stats.artworksOwned}</div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Artworks</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Artworks Owned</h3>
                        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
                            <div className="bg-blue-500 h-1 rounded-full w-3/4 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Total Spent */}
                    <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-2 border border-green-200/50 dark:border-green-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-500 rounded-xl group-hover:bg-green-600 transition-colors duration-300">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-green-900 dark:text-green-100">${formatAmount(userProfile.stats.totalSpent)}</div>
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Total</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">Total Spent</h3>
                        <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-1">
                            <div className="bg-green-500 h-1 rounded-full w-5/6 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Auctions Won */}
                    <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-3 border border-purple-200/50 dark:border-purple-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-500 rounded-xl group-hover:bg-purple-600 transition-colors duration-300">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-purple-900 dark:text-purple-100">{userProfile.stats.auctionsWon}</div>
                                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Won</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-2">Auctions Won</h3>
                        <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-1">
                            <div className="bg-purple-500 h-1 rounded-full w-1/2 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Watchlist Items */}
                    <div className="group relative bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-4 border border-orange-200/50 dark:border-orange-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-500 rounded-xl group-hover:bg-orange-600 transition-colors duration-300">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-orange-900 dark:text-orange-100">{userProfile.stats.watchlistItems}</div>
                                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">Items</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-orange-800 dark:text-orange-200 mb-2">Watchlist Items</h3>
                        <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1">
                            <div className="bg-orange-500 h-1 rounded-full w-4/5 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Active Bids */}
                    <div className="group relative bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-1 border border-red-200/50 dark:border-red-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-500 rounded-xl group-hover:bg-red-600 transition-colors duration-300">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-red-900 dark:text-red-100">{userProfile.stats.activeBids}</div>
                                <div className="text-xs text-red-600 dark:text-red-400 font-medium">Active</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Active Bids</h3>
                        <div className="w-full bg-red-200 dark:bg-red-800 rounded-full h-1">
                            <div className="bg-red-500 h-1 rounded-full w-2/3 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Avg. Bid Amount */}
                    <div className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-2 border border-indigo-200/50 dark:border-indigo-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-500 rounded-xl group-hover:bg-indigo-600 transition-colors duration-300">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-indigo-900 dark:text-indigo-100">${formatAmount(userProfile.stats.avgBidAmount)}</div>
                                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Average</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Avg. Bid Amount</h3>
                        <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-1">
                            <div className="bg-indigo-500 h-1 rounded-full w-3/5 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Member Since */}
                    <div className="group relative bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-3 border border-teal-200/50 dark:border-teal-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-teal-500 rounded-xl group-hover:bg-teal-600 transition-colors duration-300">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-lg sm:text-xl font-bold text-teal-900 dark:text-teal-100">{userProfile.stats.memberSince}</div>
                                <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">Years</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-teal-800 dark:text-teal-200 mb-2">Member Since</h3>
                        <div className="w-full bg-teal-200 dark:bg-teal-800 rounded-full h-1">
                            <div className="bg-teal-500 h-1 rounded-full w-4/5 transition-all duration-500"></div>
                        </div>
                    </div>

                    {/* Success Rate */}
                    <div className="group relative bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 animate-fade-in-delay-4 border border-pink-200/50 dark:border-pink-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-pink-500 rounded-xl group-hover:bg-pink-600 transition-colors duration-300">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-2xl sm:text-3xl font-bold text-pink-900 dark:text-pink-100">{userProfile.stats.successRate}%</div>
                                <div className="text-xs text-pink-600 dark:text-pink-400 font-medium">Rate</div>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-pink-800 dark:text-pink-200 mb-2">Success Rate</h3>
                        <div className="w-full bg-pink-200 dark:bg-pink-800 rounded-full h-1">
                            <div className="bg-pink-500 h-1 rounded-full w-1/5 transition-all duration-500"></div>
                        </div>
                    </div>
                </section>
            </div>

            {/*My Artworks*/}
            <div className="hidden lg:block">
                <h2 className="text-xl sm:text-2xl font-semibold animate-fade-in-delay-2">My Artworks</h2>
                {userProfile.ownedArtworks.length === 0 ? (
                    <EmptyState
                        title="No Artworks Yet"
                        message="It looks like you haven't added any artworks to your collection. Start exploring the marketplace to find your next masterpiece!"
                        iconSrc="/globe.svg" // Assuming you have an appropriate icon
                    />
                ) : (
                    <div className="animate-fade-in-delay-3">
                        <ArtworkCarousel artworks={userProfile.ownedArtworks} />
                    </div>)}
            </div>

            {/*Marketplace*/}
            <div>
                <h2 className="text-xl sm:text-2xl font-semibold animate-fade-in-delay-3">Marketplace</h2>
                <div className="animate-fade-in-delay-4">
                    <MarketplaceGrid artworks={artworks} numArtworks={6} />
                </div>
            </div>
        </div>
    );
}
