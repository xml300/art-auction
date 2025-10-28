"use client";

import { useEffect, useState } from "react";
import { ListFilter, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { Artwork } from "@/data/db";

export default function MarketplacePage() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    // const [filterArtistName, setFilterArtistName] = useState("");
    const [searchFilter, setSearchFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; 

    useEffect(() => {
        fetch('/api/artworks?artist=true').then(res => res.json()).then(json => {
            setArtworks(json.artworks);
            setFilteredArtworks(json.artworks);
        });
    }, []);

    useEffect(() => {
        if(searchFilter == ""){
            setFilteredArtworks(artworks);
            return;
        }
        const newArtworks = artworks.filter((artwork) =>{
            return (artwork.artist?.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
            artwork.title.toLowerCase().includes(searchFilter.toLowerCase())
        );
        })
        setFilteredArtworks(newArtworks);
    }, [searchFilter, artworks]);

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        
        console.log(`Fetching data for page ${page}`);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(e.target.value);
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold animate-fade-in">Marketplace</h1>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-1">
                <input
                    type="search"
                    name=""
                    id=""
                    className="border-2 border-black flex-1 p-3 sm:p-4 rounded-lg text-base sm:text-lg dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200"
                    placeholder="Search by artist or artwork"
                    onChange={handleSearchChange}
                />
                <div className="relative">
                    <button
                        onClick={toggleFilterMenu}
                        className="bg-black text-white w-full sm:w-24 h-12 sm:h-full flex justify-center items-center rounded-xl hover:scale-105 transition-transform duration-200"
                    >
                        <ListFilter className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div
                        className={cn(
                            "absolute right-0 top-full max-w-xl bg-white shadow-md border p-4 sm:p-8 flex-col dark:bg-dark-background dark:text-dark-text dark:border-gray-700 animate-fade-in z-[999]",
                            isFilterMenuOpen ? "flex" : "hidden"
                        )}
                    >
                    <form action="">
                        <div className="flex flex-col mb-4">
                            <label htmlFor="artist_name">Artist Name</label>
                            <input type="text" name="artist_name" id="artist_name" className="border border-black p-2 rounded-md dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200" placeholder="Enter artist name" />
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="">Current Bid</label>
                            <div className="flex gap-2 sm:gap-4 items-center">
                                <input type="text" name="min_bid" id="min_bid" className="border-2 border-black rounded-md p-2 flex-1 dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200" placeholder="$0.00" />
                                <MinusIcon className="w-4 h-4" />
                                <input type="text" name="max_bid" id="max_bid" className="border-2 border-black rounded-md p-2 flex-1 dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200" placeholder="$10,000.00" />
                            </div>
                        </div>
                        <div className="flex flex-col mb-4">
                            <label htmlFor="">Auction Ends</label>
                            <div className="flex gap-2 sm:gap-4 items-center">
                                <input type="date" name="min_end_time" id="min_end_time" className="border-2 border-black p-2 rounded-md flex-1 dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200" />
                                <MinusIcon className="w-4 h-4" />
                                <input type="date" name="max_end_time" id="max_end_time" className="border-2 border-black p-2 rounded-md flex-1 dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200" />
                            </div>
                        </div>
                        <button type="submit" className="mt-4 sm:mt-8 flex items-center justify-center bg-black text-white px-6 py-2 rounded-lg w-full gap-2 hover:scale-105 transition-transform duration-200">
                            <ListFilter className="w-4 h-4" />Filter
                        </button>
                    </form>
                    </div>
                </div>
            </div>

            {/* Marketplace Grid */}
            <div className="z-10">
                <MarketplaceGrid artworks={filteredArtworks} />
            </div>

            {/* Pagination */}
            <div className="flex justify-center sm:justify-end w-full animate-fade-in-delay-3">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
