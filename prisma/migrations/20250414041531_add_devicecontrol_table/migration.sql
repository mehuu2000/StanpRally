-- CreateTable
CREATE TABLE "DeviceControl" (
    "id" SERIAL NOT NULL,
    "visitorId" TEXT NOT NULL,
    "cookieUUID" TEXT,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceControl_visitorId_key" ON "DeviceControl"("visitorId");
