DO $$ BEGIN
 CREATE TYPE "public"."file_access_enum" AS ENUM('public', 'private', 'confidential');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."file_category_enum" AS ENUM('avatar', 'artwork_image', 'artwork_document', 'kyc_document', 'transaction_receipt');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."file_status_enum" AS ENUM('pending', 'ready', 'failed', 'deleted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	"category" "file_category_enum" NOT NULL,
	"access_level" "file_access_enum" DEFAULT 'public' NOT NULL,
	"status" "file_status_enum" DEFAULT 'pending' NOT NULL,
	"storage_bucket" varchar(255) NOT NULL,
	"storage_key" varchar(1000) NOT NULL,
	"public_url" varchar(1000),
	"original_filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size_bytes" bigint NOT NULL,
	"sha256_hash" varchar(64),
	"entity_type" varchar(50),
	"entity_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_files_user_id" ON "files" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_files_entity" ON "files" ("entity_type", "entity_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_files_status" ON "files" ("status");
