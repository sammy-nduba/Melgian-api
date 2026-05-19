-- CreateEnum
CREATE TYPE "TourPackageClass" AS ENUM ('ADVENTURE_TRAILS', 'EXPLORER_SAFARIS', 'SIGNATURE_ELITE_SAFARIS');

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "packageClass" "TourPackageClass" NOT NULL DEFAULT 'EXPLORER_SAFARIS';

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");
