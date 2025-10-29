import Link from "next/link";
import Image from "next/image";
import { Artwork } from "@/data/db";
import EmptyState from "./EmptyState";

export function MarketplaceGrid({ artworks }: { artworks: Artwork[] }) {
    return (
        <section className="mb-12 mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
            {artworks.map(artwork => {
                return (
                    <div key={artwork.id} className={` rounded-lg shadow-lg hover:scale-105 transition-transform duration-300`}>
                        <div className="flex flex-col gap-6 relative group">
                            <span className="group-hover:hidden absolute right-4 top-4 bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-lg font-semibold border border-white/20">${artwork.currentBid.toLocaleString()}</span>
                            <div className="w-full">
                                <Image
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    width={1000}
                                    height={1000}
                                    className="w-full h-64 sm:h-72 lg:h-96 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-lg p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">
                                    {artwork.title}
                                </h3>
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                                    {artwork.description.length > 150 ? artwork.description.slice(0, 149) + '...' : artwork.description}
                                </p>
                                <div className="flex flex-col sm:flex-row justify-around w-full gap-4 py-3 border-t border-white/20">
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Current Bid</p>
                                        {artwork.currentBid ? (
                                            <p className="text-lg sm:text-xl font-bold">${artwork.currentBid.toLocaleString()}</p>
                                        ) : (
                                            <span className="bg-black text-white rounded-lg px-3 py-1 text-sm sm:text-base">
                                                No Bids
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs sm:text-sm text-gray-400 mb-1">Auction Ends</p>
                                        <p className="text-lg sm:text-xl font-medium">
                                            {new Date(artwork.auctionEndTime).toLocaleDateString("en-US", {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-4 w-full">
                                    <Link
                                        href={`/dashboard/marketplace/place-bid/${artwork.id}`}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 w-full block font-semibold text-lg"
                                    >
                                        Place Bid
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {artworks.length === 0 && (
                <EmptyState
                    iconSrc="/file.svg"
                    title="No Artworks Found"
                    message="Try adjusting your filters or check back later."
                />
            )}
        </section>
    );
}
