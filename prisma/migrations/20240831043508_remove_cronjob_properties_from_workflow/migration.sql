/*
  Warnings:

  - You are about to drop the column `cronDescription` on the `Workflows` table. All the data in the column will be lost.
  - You are about to drop the column `cronRepeatEvery` on the `Workflows` table. All the data in the column will be lost.
  - You are about to drop the column `cronRepeatEveryUnit` on the `Workflows` table. All the data in the column will be lost.
  - You are about to drop the column `cronTimezone` on the `Workflows` table. All the data in the column will be lost.
  - You are about to drop the column `cronTitle` on the `Workflows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "cronDescription",
DROP COLUMN "cronRepeatEvery",
DROP COLUMN "cronRepeatEveryUnit",
DROP COLUMN "cronTimezone",
DROP COLUMN "cronTitle";
