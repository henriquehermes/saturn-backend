/*
  Warnings:

  - You are about to drop the column `description` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `progressPercentage` on the `Task` table. All the data in the column will be lost.
  - Added the required column `columnId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('FEATURE', 'BUG');

-- CreateEnum
CREATE TYPE "TaskColumnId" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "progressPercentage",
ADD COLUMN     "columnId" "TaskColumnId" NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "TaskType" NOT NULL;
