/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ticket_categoryId_idx";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "categoryId",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
ALTER COLUMN "priority" DROP DEFAULT;
