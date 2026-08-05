CREATE INDEX IF NOT EXISTS "transactions_fts_idx"
  ON "transactions" USING gin (
    to_tsvector(
      'simple',
      concat_ws(
        ' ',
        coalesce("name", ''),
        coalesce("description", ''),
        coalesce("category"::text, ''),
        coalesce("type"::text, ''),
        coalesce("payment_method"::text, '')
      )
    )
  )
  WHERE "deleted_at" IS NULL;--> statement-breakpoint
