-- AlterTable
ALTER TABLE "public"."Game" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Package" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
