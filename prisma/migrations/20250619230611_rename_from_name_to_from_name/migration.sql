-- Rename the camelCase column to snake_case if it still exists
DO $$ BEGIN
  ALTER TABLE "Ticket" RENAME COLUMN "fromName" TO "from_name";
EXCEPTION
  WHEN undefined_column THEN
    -- already renamed, nothing to do
END $$;

-- Add the column if it never existed (fresh DB) + back-fill NULLs
ALTER TABLE "Ticket"
  ADD COLUMN IF NOT EXISTS "from_name" TEXT;

UPDATE "Ticket"
  SET "from_name" = COALESCE("from_name", 'Unknown');

ALTER TABLE "Ticket"
  ALTER COLUMN "from_name" SET NOT NULL;
