ALTER TABLE "activities" ADD COLUMN IF NOT EXISTS "artwork_id" integer REFERENCES "public"."artworks"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "artwork_title" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "amount" DROP NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activities_user_id" ON "activities" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activities_user_created_at" ON "activities" ("user_id", "created_at" DESC);
