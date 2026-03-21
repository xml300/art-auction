"use client";

import React, { useEffect, useState, useRef } from "react";
import { ListFilter, MinusIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { MarketplaceGrid } from "@/components/MarketplaceGrid";
import { Artwork } from "@/types";
import { api } from "@/lib/api";


export default function ClientMarketplacePage({initialArtworks, initialTotalPages, pageLimit}: {initialArtworks: Artwork[], initialTotalPages: number, pageLimit: number}) {
    const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(initialArtworks);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialTotalPages);

    const [isLoading, setIsLoading] = useState(false);
    
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");
    const [artistName, setArtistName] = useState("");
    const [minBid, setMinBid] = useState(0);
    const [maxBid, setMaxBid] = useState(0);
    const [minEndTime, setMinEndTime] = useState(0);
    const [maxEndTime, setMaxEndTime] = useState(0);
    const isFirstRender = useRef(true);


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const fetchArtworks = async () => {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: pageLimit.toString(),
            });

            if (searchFilter) params.set("searchQuery", searchFilter);
            if (artistName) params.set("artistName", artistName);
            if (minBid) params.set("minBid", minBid.toString());
            if (maxBid) params.set("maxBid", maxBid.toString());
            if (minEndTime) params.set("minEndTime", minEndTime.toString());
            if (maxEndTime) params.set("maxEndTime", maxEndTime.toString());

            const res = await api.get<{artworks: Artwork[], totalPages: number}>(`/artworks/marketplace?${params.toString()}`);
            setFilteredArtworks(res.artworks);
            setTotalPages(res.totalPages);
            setIsLoading(false);
        };
        fetchArtworks();
    }, [currentPage, searchFilter, artistName, minBid, maxBid, minEndTime, maxEndTime, pageLimit]);

    const toggleFilterMenu = () => {
        setIsFilterMenuOpen(!isFilterMenuOpen);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setIsLoading(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(e.target.value);
    }

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        setArtistName(formData.get("artist_name")?.toString() || "");
        setMinBid(parseInt(formData.get("min_bid")?.toString()|| "0"));
        setMaxBid(parseInt(formData.get("max_bid")?.toString()|| "0"));
        setMinEndTime(Date.parse(formData.get("min_end_time")?.toString() || ""));
        setMaxEndTime(Date.parse(formData.get("max_end_time")?.toString() || ""));
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold animate-fade-in">Marketplace</h1>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 ">
                <input
                    type="search"
                    name=""
                    id=""
                    className="animate-fade-in-delay-1 border-2 border-black flex-1 p-3 sm:p-4 rounded-lg text-base sm:text-lg dark:bg-dark-background dark:border-gray-400 hover:scale-105 transition-transform duration-200"
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
                            "rounded-xl absolute right-0 top-[120%] w-full sm:w-96 bg-white shadow-xl border border-gray-200 p-6 flex-col dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 animate-fade-in animate-duration z-50",
                            isFilterMenuOpen ? "flex" : "hidden"
                        )}
                    >
                        <form onSubmit={handleFilterSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Artist Name</label>
                                <input
                                    type="text"
                                    name="artist_name"
                                    id="artist_name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                                    placeholder="Enter artist name"
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Bid</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        name="min_bid"
                                        id="min_bid"
                                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                                        placeholder="₦0.00"
                                        onChange={(e) => (document.querySelector('#max_bid') as HTMLInputElement).value = e.target.value}
                                    />
                                    <MinusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <input
                                        type="text"
                                        name="max_bid"
                                        id="max_bid"
                                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                                        placeholder="₦10,000.00"
                                    />
                                </div>
                            </div>
                            <div className="pr-6">
                                <label htmlFor="" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Auction Ends</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="date"
                                        name="min_end_time"
                                        id="min_end_time"
                                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                                        onChange={(e) => (document.querySelector('#max_end_time') as HTMLInputElement).value = e.target.value}
                                    />
                                    <MinusIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    <input
                                        type="date"
                                        name="max_end_time"
                                        id="max_end_time"
                                        className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 font-semibold text-lg gap-2"
                            >
                                <ListFilter className="w-5 h-5" />Filter
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Marketplace Grid */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            ) : (
                <div className="z-10">
                    <MarketplaceGrid artworks={filteredArtworks} />
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center sm:justify-end w-full animate-fade-in-delay-3">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
