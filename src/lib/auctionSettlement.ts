import { db } from "@/data/db";
import { artworks, bids } from "@/db/schema";
import { and, isNull, lte, eq, desc } from "drizzle-orm";
import { Ledger } from "@/models/ledger.model";
import { createTransaction, updateArtwork } from "@/data/queries";
import { Activities } from "@/models/activity.model";
import { notifyUser } from "@/lib/notifications";

export interface SettlementResult {
  artworkId: number;
  title: string;
  status: "settled" | "no_bids" | "already_owned" | "error";
  winnerId?: number;
  winningBidAmount?: number;
  artistPayoutNaira?: number;
  platformFeeNaira?: number;
  error?: string;
}

/**
 * Sweeps all expired auctions and executes atomic double-entry ledger settlement,
 * transfer of digital ownership, and notification dispatch.
 */
export async function settleExpiredAuctions(): Promise<SettlementResult[]> {
  const now = new Date();

  // Find all auctions that have ended and have not yet been assigned to a winner
  const expiredArtworks = await db
    .select()
    .from(artworks)
    .where(and(lte(artworks.auctionEndTime, now), isNull(artworks.ownerId)));

  const results: SettlementResult[] = [];

  for (const artwork of expiredArtworks) {
    try {
      // Find highest bid
      const [winningBid] = await db
        .select()
        .from(bids)
        .where(eq(bids.artworkId, artwork.id))
        .orderBy(desc(bids.bidAmount))
        .limit(1);

      if (!winningBid) {
        results.push({
          artworkId: artwork.id,
          title: artwork.title,
          status: "no_bids",
        });
        continue;
      }

      const totalAmountKobo = Math.round(winningBid.bidAmount * 100);
      const commissionPercent = 10; // 10% Platform fee
      const commissionKobo = Math.round(totalAmountKobo * (commissionPercent / 100));
      const artistPayoutKobo = totalAmountKobo - commissionKobo;

      const settlementRef = `SETTLE-${artwork.id}-${winningBid.id}-${Date.now()}`;
      const idempotencyKey = `SETTLE-LEDGER-${artwork.id}-${winningBid.id}`;

      await db.transaction(async (tx) => {
        // 1. Authoritative Double-Entry Ledger Settlement
        // Debit: Escrow Hold (clears locked buyer funds)
        // Credit: Artist Payable (artist earnings)
        // Credit: Platform Commission (fee revenue)
        await Ledger.recordAuctionSettlement(
          {
            winnerId: winningBid.bidderId,
            artistId: artwork.artistId,
            totalAmountKobo,
            commissionPercent,
            artworkId: artwork.id,
            reference: settlementRef,
            idempotencyKey,
          },
          tx
        );

        // 2. Legacy Transaction records for historical table display
        await createTransaction(
          winningBid.bidderId,
          settlementRef,
          `Won auction for "${artwork.title}"`,
          "bid_payment",
          winningBid.bidAmount.toFixed(2),
          "completed",
          artwork.id,
          tx
        );

        await createTransaction(
          artwork.artistId,
          `PAYOUT-${artwork.id}-${Date.now()}`,
          `Sale payout for "${artwork.title}" (less 10% fee)`,
          "deposit",
          (artistPayoutKobo / 100).toFixed(2),
          "completed",
          artwork.id,
          tx
        );

        // 3. Assign digital ownership
        await updateArtwork(artwork.id, { ownerId: winningBid.bidderId }, tx);

        // 4. Record collector activity
        await Activities.create(
          winningBid.bidderId,
          "auction_won",
          artwork.title,
          winningBid.bidAmount,
          tx
        );
      });

      // 5. Dispatch real-time and push notifications
      notifyUser({
        userId: winningBid.bidderId,
        type: "auction_won",
        title: "Auction Won!",
        body: `Congratulations! You won the auction for "${artwork.title}" with a final bid of ₦${winningBid.bidAmount.toLocaleString()}.`,
        data: { artworkId: artwork.id, targetUrl: `/dashboard/my-artworks/${artwork.id}` },
        channels: ["in_app", "push"],
      }).catch((err) => console.error("Winner notification failed:", err));

      notifyUser({
        userId: artwork.artistId,
        type: "system",
        title: "Artwork Sold!",
        body: `Your artwork "${artwork.title}" has been sold for ₦${winningBid.bidAmount.toLocaleString()}! Net earnings: ₦${(artistPayoutKobo / 100).toLocaleString()}.`,
        data: { artworkId: artwork.id, targetUrl: `/artist-dashboard` },
        channels: ["in_app", "push"],
      }).catch((err) => console.error("Artist notification failed:", err));

      results.push({
        artworkId: artwork.id,
        title: artwork.title,
        status: "settled",
        winnerId: winningBid.bidderId,
        winningBidAmount: winningBid.bidAmount,
        artistPayoutNaira: artistPayoutKobo / 100,
        platformFeeNaira: commissionKobo / 100,
      });
    } catch (err) {
      console.error(`Failed to settle artwork #${artwork.id}:`, err);
      results.push({
        artworkId: artwork.id,
        title: artwork.title,
        status: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
