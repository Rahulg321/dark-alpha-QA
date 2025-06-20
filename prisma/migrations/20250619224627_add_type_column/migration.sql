-- 1️⃣  add the new column with a default so existing rows are valid
ALTER TABLE "Ticket"
  ADD COLUMN "type" TEXT NOT NULL DEFAULT 'website';

-- 2️⃣  optional: remove the default for future inserts
ALTER TABLE "Ticket"
  ALTER COLUMN "type" DROP DEFAULT;

-- 3️⃣  add the same index Prisma expects
CREATE INDEX "Ticket_type_idx" ON "Ticket" ("type");
