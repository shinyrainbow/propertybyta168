/**
 * Property Slug Utilities
 * Generate and parse SEO-friendly URLs for properties
 *
 * Format: {listingType}-{propertyType}-{projectName}-{propertyCode}
 * Example (th): ให้เช่า-คอนโด-the-skyline-residence-SKY001
 * Example (en): for-rent-condo-the-skyline-residence-SKY001
 * Example (zh): 出租-公寓-the-skyline-residence-SKY001
 */

export interface SlugParts {
  listingType: string;
  propertyType: string;
  projectName: string;
  propertyCode: string;
}

type Locale = "th" | "en" | "zh";

/**
 * Listing type translations by locale
 */
const listingTypeMap: Record<Locale, { rent: string; sale: string; both: string; property: string }> = {
  th: { rent: "ให้เช่า", sale: "ขาย", both: "ให้เช่า-ขาย", property: "ทรัพย์สิน" },
  en: { rent: "for-rent", sale: "for-sale", both: "for-rent-sale", property: "property" },
  zh: { rent: "出租", sale: "出售", both: "出租出售", property: "房产" },
};

/**
 * Property type translations by locale
 */
const propertyTypeMap: Record<Locale, Record<string, string>> = {
  th: {
    "Condo": "คอนโด",
    "SingleHouse": "บ้านเดี่ยว",
    "Townhouse": "ทาวน์เฮ้าส์",
    "Villa": "วิลล่า",
    "Land": "ที่ดิน",
    "Office": "สำนักงาน",
    "Store": "อาคารพาณิชย์",
    "Factory": "โรงงาน",
    "Hotel": "โรงแรม",
    "Building": "อาคาร",
  },
  en: {
    "Condo": "condo",
    "SingleHouse": "house",
    "Townhouse": "townhouse",
    "Villa": "villa",
    "Land": "land",
    "Office": "office",
    "Store": "commercial",
    "Factory": "factory",
    "Hotel": "hotel",
    "Building": "building",
  },
  zh: {
    "Condo": "公寓",
    "SingleHouse": "别墅",
    "Townhouse": "联排别墅",
    "Villa": "豪华别墅",
    "Land": "土地",
    "Office": "办公室",
    "Store": "商铺",
    "Factory": "工厂",
    "Hotel": "酒店",
    "Building": "大楼",
  },
};

/**
 * Convert listing type to URL-friendly format based on locale
 */
function getListingTypeSlug(
  property: { rentalRateNum?: number | null; sellPriceNum?: number | null },
  locale: Locale = "th"
): string {
  const hasRent = property.rentalRateNum && property.rentalRateNum > 0;
  const hasSale = property.sellPriceNum && property.sellPriceNum > 0;
  const translations = listingTypeMap[locale] || listingTypeMap.th;

  if (hasRent && hasSale) return translations.both;
  if (hasRent) return translations.rent;
  if (hasSale) return translations.sale;
  return translations.property;
}

/**
 * Convert property type to localized URL slug
 */
function getPropertyTypeSlug(propertyType: string, locale: Locale = "th"): string {
  const typeMap = propertyTypeMap[locale] || propertyTypeMap.th;
  return typeMap[propertyType] || propertyType.toLowerCase();
}

/**
 * Slugify text - make URL-friendly
 * Preserves Thai characters, converts spaces to hyphens
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")     // Replace spaces and underscores with hyphens
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, "") // Keep Thai, alphanumeric, and hyphens
    .replace(/-+/g, "-")         // Replace multiple hyphens with single
    .replace(/^-|-$/g, "");      // Remove leading/trailing hyphens
}

/**
 * Generate SEO-friendly slug from property data
 * @param property - Property data
 * @param locale - Optional locale for language-specific slug (defaults to "th")
 */
export function generatePropertySlug(
  property: {
    agentPropertyCode?: string | null;
    propertyType: string;
    rentalRateNum?: number | null;
    sellPriceNum?: number | null;
    project?: {
      projectNameTh?: string;
      projectNameEn?: string;
    } | null;
    propertyTitleTh?: string;
    propertyTitleEn?: string;
    propertyDistrict?: string | null;
  },
  locale: string = "th"
): string {
  const safeLocale = (locale === "en" || locale === "zh" ? locale : "th") as Locale;
  const listingType = getListingTypeSlug(property, safeLocale);
  const propertyType = getPropertyTypeSlug(property.propertyType, safeLocale);

  // Get location/project name based on locale
  let locationName = "";
  if (safeLocale === "en" || safeLocale === "zh") {
    // For English/Chinese: prefer English name, then Thai
    if (property.project?.projectNameEn) {
      locationName = property.project.projectNameEn;
    } else if (property.project?.projectNameTh) {
      locationName = property.project.projectNameTh;
    } else if (property.propertyTitleEn) {
      locationName = property.propertyTitleEn;
    } else if (property.propertyDistrict) {
      locationName = property.propertyDistrict;
    } else {
      locationName = "property";
    }
  } else {
    // For Thai: prefer Thai name, then English
    if (property.project?.projectNameTh) {
      locationName = property.project.projectNameTh;
    } else if (property.project?.projectNameEn) {
      locationName = property.project.projectNameEn;
    } else if (property.propertyTitleTh) {
      locationName = property.propertyTitleTh;
    } else if (property.propertyDistrict) {
      locationName = property.propertyDistrict;
    } else {
      locationName = "property";
    }
  }

  // Property code for uniqueness
  const code = property.agentPropertyCode || "P";

  // Build slug
  const parts = [
    listingType,
    propertyType,
    slugify(locationName),
    code.toUpperCase(),
  ];

  return parts.join("-");
}

/**
 * Extract property code from slug
 * The code is always the last segment after the last hyphen
 */
export function extractPropertyCodeFromSlug(slug: string): string {
  // Property code is the last segment
  const parts = slug.split("-");
  return parts[parts.length - 1].toUpperCase();
}

/**
 * Validate if a string looks like our property slug format
 */
export function isValidPropertySlug(slug: string): boolean {
  // Must have at least 3 hyphens (4 parts minimum)
  const hyphenCount = (slug.match(/-/g) || []).length;
  if (hyphenCount < 3) return false;

  // Last part should be property code (alphanumeric)
  const parts = slug.split("-");
  const code = parts[parts.length - 1];
  return /^[A-Za-z0-9]+$/.test(code);
}

/**
 * Check if a string is a UUID (old format)
 */
export function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
