/*
  Warnings:

  - Made the column `count` on table `Stamps` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Stamps" ALTER COLUMN "count" SET NOT NULL,
ALTER COLUMN "count" SET DATA TYPE INTEGER;
