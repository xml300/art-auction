import Link from "next/link";
import Image from "next/image";
import { Artwork } from "@/data/db";

export function MarketplaceGrid({ artworks }: { artworks: Artwork[] }) {
    return (
        <section className="mb-12 mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 animate-fade-in">
            {artworks.map((artwork, index) => {
                const delayClass = `animate-fade-in-delay-${(index % 4) + 1}`;
                return (
                    <div key={artwork.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 hover:scale-105 transition-transform duration-300 ${delayClass}`}>
                        <div className="flex flex-col gap-6">
                            <div className="w-full">
                                <Image
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    className="w-full h-56 sm:h-64 lg:h-72 object-cover rounded-lg hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center sm:text-left">
                                        {artwork.title}
                                    </h3>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                                    {artwork.description}
                                </p>

                                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 py-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Current Bid</p>
                                        {artwork.currentBid ? (<p className="text-lg sm:text-xl font-bold">${artwork.currentBid.toLocaleString()}</p>) :
                                            (<span className="bg-black text-white rounded-lg px-3 py-1 text-sm sm:text-base self-center sm:self-start">
                                                No Bids
                                            </span>)}
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Auction Ends</p>
                                        <p className="text-sm sm:text-base font-medium">
                                            {new Date(artwork.auctionEndTime).toLocaleDateString("en-US", {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href={`/dashboard/marketplace/place-bid/${artwork.id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors hover:scale-105 duration-200 w-full text-center block font-medium"
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
    <div className="col-span-full flex flex-col items-center justify-center text-center p-12 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
        <Image src="/file.svg" alt="No Artworks Found" className="h-24 w-24 mb-4 text-gray-400 dark:text-gray-500" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Artworks Found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
    </div>
)}
        </section>
    );
}
