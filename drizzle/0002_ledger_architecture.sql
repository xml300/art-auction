DO $$ BEGIN
    CREATE TYPE "ledger_account_type_enum" AS ENUM('asset', 'liability', 'equity', 'revenue', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "ledger_posting_direction_enum" AS ENUM('debit', 'credit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
    CREATE TYPE "ledger_entry_type_enum" AS ENUM('deposit', 'withdrawal', 'bid_hold', 'bid_release', 'auction_settlement', 'refund', 'platform_fee', 'adjustment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledger_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_number" varchar(100) NOT NULL UNIQUE,
	"user_id" integer REFERENCES "users"("id") ON DELETE SET NULL,
	"name" varchar(255) NOT NULL,
	"type" "ledger_account_type_enum" NOT NULL,
	"currency" varchar(10) DEFAULT 'NGN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledger_journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"idempotency_key" varchar(255) NOT NULL UNIQUE,
	"entry_type" "ledger_entry_type_enum" NOT NULL,
	"reference" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"metadata" varchar(2000),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ledger_postings" (
	"id" serial PRIMARY KEY NOT NULL,
	"journal_entry_id" integer NOT NULL REFERENCES "ledger_journal_entries"("id") ON DELETE CASCADE,
	"account_id" integer NOT NULL REFERENCES "ledger_accounts"("id") ON DELETE RESTRICT,
	"amount" bigint NOT NULL,
	"direction" "ledger_posting_direction_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "positive_amount_check" CHECK ("amount" > 0)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ledger_postings_account_id" ON "ledger_postings" ("account_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ledger_postings_journal_id" ON "ledger_postings" ("journal_entry_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ledger_accounts_user_id" ON "ledger_accounts" ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ledger_journal_entries_reference" ON "ledger_journal_entries" ("reference");
