-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('Cronjob', 'Trigger');

-- AlterTable
ALTER TABLE "Workflows" ADD COLUMN     "type" "WorkflowType" NOT NULL DEFAULT 'Cronjob';
