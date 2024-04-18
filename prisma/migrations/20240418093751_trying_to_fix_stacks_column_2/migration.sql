/*
  Warnings:

  - You are about to drop the `Stacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stacks" DROP CONSTRAINT "Stacks_projectId_fkey";

-- DropTable
DROP TABLE "Stacks";

-- CreateTable
CREATE TABLE "Stack" (
    "id" TEXT NOT NULL,
    "frontend" TEXT[],
    "backend" TEXT[],
    "misc" TEXT[],
    "projectId" TEXT,

    CONSTRAINT "Stack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stack_projectId_key" ON "Stack"("projectId");

-- AddForeignKey
ALTER TABLE "Stack" ADD CONSTRAINT "Stack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
