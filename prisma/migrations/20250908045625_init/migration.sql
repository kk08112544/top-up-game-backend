/*
  Warnings:

  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Game" DROP COLUMN "status",
ADD COLUMN     "status_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."Status" (
    "id" SERIAL NOT NULL,
    "status_name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
