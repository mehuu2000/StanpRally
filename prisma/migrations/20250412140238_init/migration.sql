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

    CONSTRAINT "Stamps_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_publicId_key" ON "User"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Stamps" ADD CONSTRAINT "Stamps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
