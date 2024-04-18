/*
  Warnings:

  - Changed the type of `status` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'INACTIVE');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL;
