-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('validationCode', 'passwordUpdateToken');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT,
    "organisationId" TEXT,
    "role" "Role" NOT NULL,
    "passwordHash" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshTokenModel" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "RefreshTokenModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationData" (
    "phoneNumber" TEXT NOT NULL,
    "dataHash" TEXT NOT NULL,
    "expiredAt" TEXT NOT NULL,
    "dataType" "DataType" NOT NULL,

    CONSTRAINT "ValidationData_pkey" PRIMARY KEY ("phoneNumber","dataType")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokenModel_token_key" ON "RefreshTokenModel"("token");
