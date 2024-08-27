/*
  Warnings:

  - The `endDate` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "endDate",
ADD COLUMN     "endDate" TIMESTAMP(3);
