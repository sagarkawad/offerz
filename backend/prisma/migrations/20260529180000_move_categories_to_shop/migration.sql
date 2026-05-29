-- CreateTable
CREATE TABLE "ShopCategory" (
    "shopId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ShopCategory_pkey" PRIMARY KEY ("shopId","categoryId")
);

-- Backfill shop categories from existing offer categories
INSERT INTO "ShopCategory" ("shopId", "categoryId")
SELECT DISTINCT "shopId", "categoryId" FROM "Offer";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_categoryId_fkey";

-- DropIndex
DROP INDEX "Offer_categoryId_idx";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "categoryId";

-- CreateIndex
CREATE INDEX "ShopCategory_categoryId_idx" ON "ShopCategory"("categoryId");

-- AddForeignKey
ALTER TABLE "ShopCategory" ADD CONSTRAINT "ShopCategory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ShopCategory" ADD CONSTRAINT "ShopCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
