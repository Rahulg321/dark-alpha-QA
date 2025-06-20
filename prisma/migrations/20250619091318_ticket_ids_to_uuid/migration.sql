/*
  Warnings:

  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TicketTag` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "TicketTag" DROP CONSTRAINT "TicketTag_ticketId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Ticket_id_seq";

-- AlterTable
ALTER TABLE "TicketTag" DROP CONSTRAINT "TicketTag_pkey",
ALTER COLUMN "ticketId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TicketTag_pkey" PRIMARY KEY ("ticketId", "tagId");

-- AddForeignKey
ALTER TABLE "TicketTag" ADD CONSTRAINT "TicketTag_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
