/*
  Warnings:

  - Added the required column `address` to the `SolWallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolWallet" ADD COLUMN     "address" TEXT NOT NULL;
