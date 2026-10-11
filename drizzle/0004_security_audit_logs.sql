CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_id" integer REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION,
	"actor_type" varchar(50) DEFAULT 'user' NOT NULL,
	"action" varchar(100) NOT NULL,
	"resource_type" varchar(50),
	"resource_id" varchar(100),
	"status" varchar(20) DEFAULT 'success' NOT NULL,
	"ip_address" varchar(100),
	"user_agent" varchar(500),
	"metadata" varchar(4000),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_actor_id" ON "audit_logs" ("actor_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_action" ON "audit_logs" ("action");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_created_at" ON "audit_logs" ("created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_audit_logs_resource" ON "audit_logs" ("resource_type", "resource_id");
