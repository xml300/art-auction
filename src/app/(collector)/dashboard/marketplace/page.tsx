import React from "react";
import ClientMarketplacePage from "./ClientMarketplacePage";
import { Artwork } from "@/types";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

const ARTWORKS_PER_PAGE = 6;

export default async function MarketplacePage() {
    const res = await api.get<{artworks: Artwork[], totalPages: number}>(`/artworks/marketplace?page=1&limit=${ARTWORKS_PER_PAGE}`);
    const {artworks, totalPages} = res;
     
    return (
       <ClientMarketplacePage initialArtworks={artworks} initialTotalPages={totalPages} pageLimit={ARTWORKS_PER_PAGE} />
    );
}