CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS unaccent;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_name_trgm_idx"
  ON "workspaces" USING gin ("name" gin_trgm_ops)
  WHERE "deleted_at" IS NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspaces_description_trgm_idx"
  ON "workspaces" USING gin ("description" gin_trgm_ops)
  WHERE "deleted_at" IS NULL;