/*
  Warnings:

  - You are about to drop the column `cookieUUID` on the `DeviceControl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeviceControl" DROP COLUMN "cookieUUID";

-- CreateTable
CREATE TABLE "CookieUUID" (
    "id" SERIAL NOT NULL,
    "cookieUUID" TEXT NOT NULL,
    "deviceControlId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookieUUID_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CookieUUID_cookieUUID_key" ON "CookieUUID"("cookieUUID");

-- AddForeignKey
ALTER TABLE "CookieUUID" ADD CONSTRAINT "CookieUUID_deviceControlId_fkey" FOREIGN KEY ("deviceControlId") REFERENCES "DeviceControl"("id") ON DELETE CASCADE ON UPDATE CASCADE;
