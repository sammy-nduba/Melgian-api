-- CreateEnum
CREATE TYPE "TargetAudience" AS ENUM ('LOCAL', 'INTERNATIONAL', 'ALL');

-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('SAFARI_PLANNING', 'TRAVEL_TIPS', 'WILDLIFE', 'CONSERVATION', 'DESTINATIONS', 'LUXURY_TRAVEL');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropIndex
DROP INDEX "BlogPost_isPublished_idx";

-- DropIndex
DROP INDEX "BlogPost_publishedAt_idx";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "isPublished",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "tags" TEXT[],
DROP COLUMN "category",
ADD COLUMN     "category" "BlogCategory" NOT NULL DEFAULT 'SAFARI_PLANNING',
ALTER COLUMN "author" SET DEFAULT 'Melgian Expeditions Team',
ALTER COLUMN "publishedAt" DROP NOT NULL,
ALTER COLUMN "readingTimeMinutes" SET DEFAULT 5;

-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "targetAudience" "TargetAudience" NOT NULL DEFAULT 'ALL';

-- CreateIndex
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");

-- CreateIndex
CREATE INDEX "BlogPost_category_idx" ON "BlogPost"("category");

-- CreateIndex
CREATE INDEX "BlogPost_isFeatured_idx" ON "BlogPost"("isFeatured");
