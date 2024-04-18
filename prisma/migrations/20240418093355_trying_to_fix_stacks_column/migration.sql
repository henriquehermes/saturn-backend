/*
  Warnings:

  - You are about to drop the `Stack` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stack" DROP CONSTRAINT "Stack_projectId_fkey";

-- DropTable
DROP TABLE "Stack";

-- CreateTable
CREATE TABLE "Stacks" (
    "id" TEXT NOT NULL,
    "frontend" TEXT[],
    "backend" TEXT[],
    "misc" TEXT[],
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Stacks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stacks" ADD CONSTRAINT "Stacks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
