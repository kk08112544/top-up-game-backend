-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
