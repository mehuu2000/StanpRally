-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "publicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stamps" (
    "userId" INTEGER NOT NULL,
    "stamp1" BOOLEAN DEFAULT false,
    "stamp2" BOOLEAN DEFAULT false,
    "stamp3" BOOLEAN DEFAULT false,
    "stamp4" BOOLEAN DEFAULT false,
    "stamp5" BOOLEAN DEFAULT false,
    "inner1" BOOLEAN NOT NULL DEFAULT false,
    "inner2" BOOLEAN NOT NULL DEFAULT false,
    "inner3" BOOLEAN NOT NULL DEFAULT false,
    "inner4" BOOLEAN NOT NULL DEFAULT false,
    "inner5" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "count" SMALLINT DEFAULT 0,

    CONSTRAINT "Stamps_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "DeviceControl" (
    "id" SERIAL NOT NULL,
    "visitorId" TEXT NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CookieUUID" (
    "id" SERIAL NOT NULL,
    "cookieUUID" TEXT NOT NULL,
    "deviceControlId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookieUUID_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceControl_visitorId_key" ON "DeviceControl"("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "CookieUUID_cookieUUID_key" ON "CookieUUID"("cookieUUID");

-- AddForeignKey
ALTER TABLE "Stamps" ADD CONSTRAINT "Stamps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CookieUUID" ADD CONSTRAINT "CookieUUID_deviceControlId_fkey" FOREIGN KEY ("deviceControlId") REFERENCES "DeviceControl"("id") ON DELETE CASCADE ON UPDATE CASCADE;
