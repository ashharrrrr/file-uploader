/*
  Warnings:

  - Added the required column `storagePath` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_name_key";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "storagePath" TEXT NOT NULL;
