/*
  Warnings:

  - The `cronRepeatEvery` column on the `Workflows` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Workflows" DROP COLUMN "cronRepeatEvery",
ADD COLUMN     "cronRepeatEvery" INTEGER;
