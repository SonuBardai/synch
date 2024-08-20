-- CreateTable
CREATE TABLE "Cronjobs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cron" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Cronjobs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cronjobs" ADD CONSTRAINT "Cronjobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
