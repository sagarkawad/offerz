-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Shop" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Offer_isPublic_idx" ON "Offer"("isPublic");

-- CreateIndex
CREATE INDEX "Shop_approved_idx" ON "Shop"("approved");

-- CreateIndex
CREATE INDEX "Shop_isPublic_idx" ON "Shop"("isPublic");

-- Backfill existing data so current shops/offers remain visible
UPDATE "Shop" SET "approved" = true, "isPublic" = true;
UPDATE "Offer" SET "isPublic" = true;
