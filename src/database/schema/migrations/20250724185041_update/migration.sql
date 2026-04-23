/*
  Warnings:

  - Made the column `summary` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "thumb" SET DEFAULT '',
ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "summary" SET NOT NULL,
ALTER COLUMN "summary" SET DEFAULT '',
ALTER COLUMN "body" SET DEFAULT '';
