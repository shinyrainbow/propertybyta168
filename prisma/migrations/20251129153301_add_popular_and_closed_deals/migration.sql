-- AlterTable
ALTER TABLE "PropertyExtension" ADD COLUMN     "closedDealDate" TIMESTAMP(3),
ADD COLUMN     "closedDealPrice" DOUBLE PRECISION,
ADD COLUMN     "closedDealType" TEXT,
ADD COLUMN     "isFeaturedPopular" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "PropertyExtension_isFeaturedPopular_idx" ON "PropertyExtension"("isFeaturedPopular");

-- CreateIndex
CREATE INDEX "PropertyExtension_closedDealDate_idx" ON "PropertyExtension"("closedDealDate");
