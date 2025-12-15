/**
 * Property Extensions Service
 * Manages local enhancements (tags) for external properties
 */

import { prisma } from "./prisma";
import {
  fetchNainaHubProperties,
  fetchNainaHubPropertyById,
  type NainaHubProperty,
  type FetchPropertiesParams,
  type NainaHubPagination,
} from "./nainahub";
import type { PropertyExtension, PropertyTag } from "@prisma/client";

// Types for extension with relations
export type PropertyExtensionWithRelations = PropertyExtension & {
  tags: PropertyTag[];
};

// Enhanced property = API property + local extensions
export type EnhancedProperty = NainaHubProperty & {
  extension: PropertyExtensionWithRelations | null;
};

export interface EnhancedPropertiesResponse {
  success: boolean;
  data: EnhancedProperty[];
  pagination: NainaHubPagination;
}

/**
 * Get properties from external API merged with local extensions
 */
export async function getEnhancedProperties(
  params: FetchPropertiesParams = {},
  options: { includeHidden?: boolean } = {}
): Promise<EnhancedPropertiesResponse> {
  // 1. Fetch from external API
  const apiResponse = await fetchNainaHubProperties(params);

  if (!apiResponse.success || apiResponse.data.length === 0) {
    return {
      success: apiResponse.success,
      data: [],
      pagination: apiResponse.pagination,
    };
  }

  // 2. Get all extensions for these properties in one query
  const propertyIds = apiResponse.data.map((p) => p.id);
  const extensions = await prisma.propertyExtension.findMany({
    where: {
      externalPropertyId: { in: propertyIds },
    },
    include: {
      tags: {
        orderBy: { name: "asc" },
      },
    },
  });

  // 3. Create lookup map
  const extensionMap = new Map<string, PropertyExtensionWithRelations>(
    extensions.map((e) => [e.externalPropertyId, e])
  );

  // 4. Merge and optionally filter hidden properties
  let enhancedData = apiResponse.data.map((property) => ({
    ...property,
    extension: extensionMap.get(property.id) || null,
  }));

  // Filter hidden properties unless includeHidden is true
  if (!options.includeHidden) {
    enhancedData = enhancedData.filter((p) => !p.extension?.isHidden);
  }

  // 5. Sort by priority (higher first), then by original order
  enhancedData.sort((a, b) => {
    const priorityA = a.extension?.priority || 0;
    const priorityB = b.extension?.priority || 0;
    return priorityB - priorityA;
  });

  return {
    success: true,
    data: enhancedData,
    pagination: apiResponse.pagination,
  };
}

/**
 * Get a single enhanced property by ID
 */
export async function getEnhancedPropertyById(
  id: string
): Promise<EnhancedProperty | null> {
  const [apiProperty, extension] = await Promise.all([
    fetchNainaHubPropertyById(id),
    prisma.propertyExtension.findUnique({
      where: { externalPropertyId: id },
      include: {
        tags: true,
      },
    }),
  ]);

  if (!apiProperty) return null;

  return {
    ...apiProperty,
    extension,
  };
}

// ============================================
// Extension CRUD Operations
// ============================================

/**
 * Create or update extension for a property
 */
export async function upsertPropertyExtension(
  externalPropertyId: string,
  data: {
    priority?: number;
    internalNotes?: string;
    isHidden?: boolean;
    isFeaturedPopular?: boolean;
    mainPropertyType?: string | null;
    subPropertyType?: string | null;
    closedDealDate?: Date | null;
    closedDealType?: string | null;
    closedDealPrice?: number | null;
  }
): Promise<PropertyExtensionWithRelations> {
  return prisma.propertyExtension.upsert({
    where: { externalPropertyId },
    create: {
      externalPropertyId,
      ...data,
    },
    update: data,
    include: {
      tags: true,
    },
  });
}

/**
 * Get extension by external property ID
 */
export async function getExtensionByPropertyId(
  externalPropertyId: string
): Promise<PropertyExtensionWithRelations | null> {
  return prisma.propertyExtension.findUnique({
    where: { externalPropertyId },
    include: {
      tags: true,
    },
  });
}

/**
 * Delete extension (and all related tags via cascade)
 */
export async function deletePropertyExtension(
  externalPropertyId: string
): Promise<void> {
  await prisma.propertyExtension.delete({
    where: { externalPropertyId },
  });
}

// ============================================
// Tag CRUD Operations
// ============================================

/**
 * Add a tag to a property
 */
export async function addTag(
  externalPropertyId: string,
  data: {
    name: string;
    color?: string;
  }
): Promise<PropertyTag> {
  // Ensure extension exists
  const extension = await prisma.propertyExtension.upsert({
    where: { externalPropertyId },
    create: { externalPropertyId },
    update: {},
  });

  return prisma.propertyTag.create({
    data: {
      ...data,
      extensionId: extension.id,
    },
  });
}

/**
 * Delete a tag
 */
export async function deleteTag(tagId: string): Promise<void> {
  await prisma.propertyTag.delete({
    where: { id: tagId },
  });
}

/**
 * Get all tags for a property
 */
export async function getTagsByPropertyId(
  externalPropertyId: string
): Promise<PropertyTag[]> {
  const extension = await prisma.propertyExtension.findUnique({
    where: { externalPropertyId },
    include: { tags: true },
  });
  return extension?.tags || [];
}

// ============================================
// Bulk Operations
// ============================================

/**
 * Get all extensions (for admin dashboard)
 */
export async function getAllExtensions(): Promise<PropertyExtensionWithRelations[]> {
  return prisma.propertyExtension.findMany({
    include: {
      tags: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

// ============================================
// Popular Properties
// ============================================

/**
 * Get popular properties (marked as featured popular)
 * Returns enhanced properties with API data merged
 */
export async function getPopularProperties(
  limit: number = 8
): Promise<EnhancedProperty[]> {
  // 1. Get extensions marked as popular
  const popularExtensions = await prisma.propertyExtension.findMany({
    where: {
      isFeaturedPopular: true,
      isHidden: false,
      closedDealDate: null, // Not closed deals
    },
    include: {
      tags: true,
    },
    orderBy: { priority: "desc" },
    take: limit,
  });

  if (popularExtensions.length === 0) {
    return [];
  }

  // 2. Fetch all properties from API (with high limit to find our popular ones)
  const apiResponse = await fetchNainaHubProperties({ limit: 100 });

  if (!apiResponse.success) {
    return [];
  }

  // 3. Create lookup map for API properties
  const apiPropertyMap = new Map(apiResponse.data.map((p) => [p.id, p]));

  // 4. Merge and return
  const popularProperties: EnhancedProperty[] = [];
  for (const ext of popularExtensions) {
    const apiProperty = apiPropertyMap.get(ext.externalPropertyId);
    if (apiProperty) {
      popularProperties.push({
        ...apiProperty,
        extension: ext,
      });
    }
  }

  return popularProperties;
}

/**
 * Mark a property as popular
 */
export async function markAsPopular(
  externalPropertyId: string,
  isPopular: boolean = true
): Promise<PropertyExtensionWithRelations> {
  return upsertPropertyExtension(externalPropertyId, {
    isFeaturedPopular: isPopular,
  });
}

// ============================================
// Closed Deals
// ============================================

/**
 * Get closed deals (sold or rented properties)
 * Uses the status field from NainaHub API to determine closed deals
 */
export async function getClosedDeals(
  limit: number = 8
): Promise<EnhancedProperty[]> {
  // 1. Fetch all properties from API
  const apiResponse = await fetchNainaHubProperties({ limit: 100 });

  if (!apiResponse.success) {
    return [];
  }

  // 2. Filter properties with status "sold" or "rented"
  const closedProperties = apiResponse.data.filter(
    (p) => p.status === "sold" || p.status === "rented"
  );

  if (closedProperties.length === 0) {
    return [];
  }

  // 3. Get extensions for these properties (for any local enhancements)
  const propertyIds = closedProperties.map((p) => p.id);
  const extensions = await prisma.propertyExtension.findMany({
    where: {
      externalPropertyId: { in: propertyIds },
      isHidden: false,
    },
    include: {
      tags: true,
    },
  });

  // 4. Create lookup map for extensions
  const extensionMap = new Map<string, PropertyExtensionWithRelations>(
    extensions.map((e) => [e.externalPropertyId, e])
  );

  // 5. Merge and return (limited)
  const closedDeals: EnhancedProperty[] = closedProperties
    .slice(0, limit)
    .map((property) => ({
      ...property,
      extension: extensionMap.get(property.id) || null,
    }));

  return closedDeals;
}

/**
 * Mark a property as a closed deal
 */
export async function markAsClosedDeal(
  externalPropertyId: string,
  data: {
    closedDealType: "sold" | "rented";
    closedDealDate?: Date;
    closedDealPrice?: number;
  }
): Promise<PropertyExtensionWithRelations> {
  return upsertPropertyExtension(externalPropertyId, {
    closedDealDate: data.closedDealDate || new Date(),
    closedDealType: data.closedDealType,
    closedDealPrice: data.closedDealPrice,
    isFeaturedPopular: false, // Remove from popular when closed
  });
}

/**
 * Remove closed deal status from a property
 */
export async function removeClosedDeal(
  externalPropertyId: string
): Promise<PropertyExtensionWithRelations> {
  return upsertPropertyExtension(externalPropertyId, {
    closedDealDate: null,
    closedDealType: null,
    closedDealPrice: null,
  });
}
