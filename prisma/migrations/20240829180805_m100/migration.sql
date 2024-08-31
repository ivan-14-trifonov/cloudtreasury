/*
  Warnings:

  - Made the column `endDate` on table `Stock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "endDate" SET DEFAULT '';
