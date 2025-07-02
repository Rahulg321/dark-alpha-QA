/* ------------------------------------------------------------------ */
/* add the new column on Ticket                                        */
/* ------------------------------------------------------------------ */
ALTER TABLE "Ticket"
ADD COLUMN "from_email" TEXT NOT NULL DEFAULT 'unknown@example.com';

/* drop the temporary default – future inserts must supply a value     */
ALTER TABLE "Ticket"
ALTER COLUMN "from_email" DROP DEFAULT;

/* optional: make description nullable (keep if you really need it)    */
ALTER TABLE "Ticket"
ALTER COLUMN "description" DROP NOT NULL;

/* ------------------------------------------------------------------ */
/* Reply table + index + foreign-key                                   */
/* ------------------------------------------------------------------ */
CREATE TABLE "Reply" (
  "id"        TEXT      NOT NULL,
  "ticketId"  TEXT      NOT NULL,
  "body"      TEXT      NOT NULL,
  "fromName"  TEXT      NOT NULL,
  "fromEmail" TEXT      NOT NULL,
  "isAdmin"   BOOLEAN   NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- index so we can quickly fetch replies of a ticket
CREATE INDEX "Reply_ticketId_idx" ON "Reply"("ticketId");

-- foreign-key relationship
ALTER TABLE "Reply"
ADD CONSTRAINT "Reply_ticketId_fkey"
FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
