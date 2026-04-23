/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `posts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "description" TEXT,
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "slug" TEXT,
ALTER COLUMN "thumb" DROP DEFAULT,
ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "summary" DROP DEFAULT,
ALTER COLUMN "body" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
