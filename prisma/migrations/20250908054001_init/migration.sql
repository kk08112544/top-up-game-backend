/*
  Warnings:

  - Changed the type of `numpack` on the `Package` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Package" DROP COLUMN "numpack",
ADD COLUMN     "numpack" INTEGER NOT NULL;
