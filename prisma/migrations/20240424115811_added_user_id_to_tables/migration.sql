/*
  Warnings:

  - Added the required column `userId` to the `BrainStorm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BrainStorm" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Timeline" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BrainStorm" ADD CONSTRAINT "BrainStorm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timeline" ADD CONSTRAINT "Timeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
