/*
  Warnings:

  - Added the required column `from_name` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "from_name" TEXT NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'website';
