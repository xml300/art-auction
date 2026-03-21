import React from "react";
import { Artwork } from "@/types";
import ClientMarketplacePage from "./ClientMarketplacePage";


const ARTWORKS_PER_PAGE = 6;

export default async function MarketplacePage() {
    const res = await fetch(`http://localhost:3000/api/artworks?artist=true&page=1&limit=${ARTWORKS_PER_PAGE}`);
    const {artworks, totalPages} = await res.json();
     
    return (
       <ClientMarketplacePage initialArtworks={artworks} initialTotalPages={totalPages} pageLimit={ARTWORKS_PER_PAGE} />
    );
}
