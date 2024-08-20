/*
  Warnings:

  - You are about to drop the `Cronjobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cronjobs" DROP CONSTRAINT "Cronjobs_userId_fkey";

-- AlterTable
ALTER TABLE "Workflows" ADD COLUMN     "cronDescription" TEXT,
ADD COLUMN     "cronRepeatEvery" TEXT,
ADD COLUMN     "cronRepeatEveryUnit" TEXT,
ADD COLUMN     "cronTimezone" TEXT,
ADD COLUMN     "cronTitle" TEXT;

-- DropTable
DROP TABLE "Cronjobs";
