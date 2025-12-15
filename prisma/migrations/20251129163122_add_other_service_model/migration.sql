-- CreateTable
CREATE TABLE "OtherService" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtherService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtherService_isActive_idx" ON "OtherService"("isActive");

-- CreateIndex
CREATE INDEX "OtherService_order_idx" ON "OtherService"("order");
