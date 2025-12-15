-- CreateTable
CREATE TABLE "PropertyExtension" (
    "id" TEXT NOT NULL,
    "externalPropertyId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "internalNotes" TEXT,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyExtension_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "extensionId" TEXT NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#3B82F6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extensionId" TEXT NOT NULL,

    CONSTRAINT "PropertyTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyExtension_externalPropertyId_key" ON "PropertyExtension"("externalPropertyId");

-- CreateIndex
CREATE INDEX "PropertyExtension_externalPropertyId_idx" ON "PropertyExtension"("externalPropertyId");

-- CreateIndex
CREATE INDEX "PropertyExtension_priority_idx" ON "PropertyExtension"("priority");

-- CreateIndex
CREATE INDEX "Promotion_extensionId_idx" ON "Promotion"("extensionId");

-- CreateIndex
CREATE INDEX "Promotion_isActive_idx" ON "Promotion"("isActive");

-- CreateIndex
CREATE INDEX "Promotion_endDate_idx" ON "Promotion"("endDate");

-- CreateIndex
CREATE INDEX "PropertyTag_extensionId_idx" ON "PropertyTag"("extensionId");

-- CreateIndex
CREATE INDEX "PropertyTag_name_idx" ON "PropertyTag"("name");

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "PropertyExtension"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTag" ADD CONSTRAINT "PropertyTag_extensionId_fkey" FOREIGN KEY ("extensionId") REFERENCES "PropertyExtension"("id") ON DELETE CASCADE ON UPDATE CASCADE;
