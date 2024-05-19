/*
  Warnings:

  - The values [BACKLOG] on the enum `TaskColumnId` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Collaborator` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `priority` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterEnum
BEGIN;
CREATE TYPE "TaskColumnId_new" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED');
ALTER TABLE "Task" ALTER COLUMN "columnId" TYPE "TaskColumnId_new" USING ("columnId"::text::"TaskColumnId_new");
ALTER TYPE "TaskColumnId" RENAME TO "TaskColumnId_old";
ALTER TYPE "TaskColumnId_new" RENAME TO "TaskColumnId";
DROP TYPE "TaskColumnId_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'DOCUMENTATION';

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Collaborator" DROP CONSTRAINT "Collaborator_userId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" "TaskPriority" NOT NULL,
ADD COLUMN     "taskId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Collaborator";
