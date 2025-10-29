"use client";

import { useState } from "react";
import ArtworkCard from "@/components/ArtworkCard";
import Pagination from "@/components/Pagination";
import { Artwork } from "@/data/db";

interface PaginatedArtworksProps {
    artworks: Artwork[];
}

export default function PaginatedArtworks({ artworks }: PaginatedArtworksProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;  
    
    const indexOfLastArtwork = currentPage * itemsPerPage;
    const indexOfFirstArtwork = indexOfLastArtwork - itemsPerPage;
    const currentArtworks = artworks.slice(indexOfFirstArtwork, indexOfLastArtwork);

    const totalPages = Math.ceil(artworks.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in-delay-2 mt-8">
                {currentArtworks.map((artwork, index) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
                ))}
            </section>

            {totalPages > 0 && (
                <div className="flex justify-end mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </>
    );
}
