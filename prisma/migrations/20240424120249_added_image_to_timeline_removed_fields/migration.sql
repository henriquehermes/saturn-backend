/*
  Warnings:

  - You are about to drop the column `description` on the `Timeline` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Timeline` table. All the data in the column will be lost.
  - Added the required column `text` to the `Timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timeline" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "text" TEXT NOT NULL;
