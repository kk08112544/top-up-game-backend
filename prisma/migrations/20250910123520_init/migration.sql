/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `PaymentMethod` table. All the data in the column will be lost.
  - Added the required column `codePayment` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PaymentMethod" DROP COLUMN "accountNumber",
ADD COLUMN     "codePayment" TEXT NOT NULL,
ALTER COLUMN "bankName" DROP NOT NULL;
