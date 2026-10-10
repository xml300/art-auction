import "dotenv/config";
import { db } from "@/data/db";
import { sql } from "drizzle-orm";

/**
 * Refreshes auction end times for unowned artworks so they are always in the future relative to NOW().
 * Distributes end times across 5 to 34 days ahead to simulate active ongoing auctions.
 */
export async function refreshAuctionDates() {
  console.log("Refreshing auction end dates...");
  const result = await db.execute(sql`
    UPDATE artworks 
    SET auction_end_time = NOW() + (INTERVAL '1 day' * ((id % 30) + 5))
    WHERE owner_id IS NULL
    RETURNING id, title, auction_end_time;
  `);

  console.log(`Successfully updated ${result.rows.length} artworks with active future auction dates.`);
}

if (require.main === module) {
  refreshAuctionDates()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Failed to refresh auction dates:", err);
      process.exit(1);
    });
}
