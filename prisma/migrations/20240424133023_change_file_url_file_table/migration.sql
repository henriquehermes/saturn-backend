/*
  Warnings:

  - You are about to drop the column `filename` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_url]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_url` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_filename_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "filename",
ADD COLUMN     "file_url" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_file_url_key" ON "File"("file_url");
