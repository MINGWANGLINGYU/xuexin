/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `depth` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "depth" INTEGER NOT NULL,
ADD COLUMN     "numchild" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "path" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_path_key" ON "categories"("path");

-- CreateIndex
CREATE INDEX "categories_path_idx" ON "categories"("path");
