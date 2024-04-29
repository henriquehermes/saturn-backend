/*
  Warnings:

  - You are about to drop the `BrainStorm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BrainStorm" DROP CONSTRAINT "BrainStorm_projectId_fkey";

-- DropForeignKey
ALTER TABLE "BrainStorm" DROP CONSTRAINT "BrainStorm_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favourites" TEXT[];

-- DropTable
DROP TABLE "BrainStorm";

-- CreateTable
CREATE TABLE "Brainstorm" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brainstorm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Brainstorm" ADD CONSTRAINT "Brainstorm_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brainstorm" ADD CONSTRAINT "Brainstorm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
