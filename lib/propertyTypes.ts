/**
 * Property Type Hierarchy Configuration
 * Defines main property types and their subtypes
 */

export type MainPropertyType = "Living" | "Land" | "Commercial";
export type SubPropertyType =
  // Living subtypes
  | "Condo"
  | "Townhouse"
  | "SingleHouse"
  | "Villa"
  // Land subtypes
  | "Land"
  // Commercial subtypes
  | "Office"
  | "Store"
  | "Factory"
  | "Hotel"
  | "Building"
  | "Apartment";

export interface PropertyTypeConfig {
  th: string;
  en: string;
  zh: string;
  subtypes: SubPropertyType[];
}

export const PROPERTY_TYPE_HIERARCHY: Record<MainPropertyType, PropertyTypeConfig> = {
  Living: {
    th: "ที่อยู่อาศัย",
    en: "Living",
    zh: "住宅",
    subtypes: ["Condo", "Townhouse", "SingleHouse", "Villa"]
  },
  Land: {
    th: "ที่ดิน",
    en: "Land",
    zh: "土地",
    subtypes: ["Land"]
  },
  Commercial: {
    th: "พาณิชย์",
    en: "Commercial",
    zh: "商业",
    subtypes: ["Office", "Store", "Factory", "Hotel", "Building", "Apartment"]
  }
};

export interface SubPropertyTypeConfig {
  th: string;
  en: string;
  zh: string;
}

export const SUB_PROPERTY_TYPE_LABELS: Record<SubPropertyType, SubPropertyTypeConfig> = {
  // Living
  Condo: {
    th: "คอนโด",
    en: "Condo",
    zh: "公寓",
  },
  Townhouse: {
    th: "ทาวน์เฮ้าส์",
    en: "Townhouse",
    zh: "联排别墅",
  },
  SingleHouse: {
    th: "บ้านเดี่ยว",
    en: "Single House",
    zh: "独栋别墅",
  },
  Villa: {
    th: "วิลล่า",
    en: "Villa",
    zh: "别墅",
  },
  // Land
  Land: {
    th: "ที่ดิน",
    en: "Land",
    zh: "土地",
  },
  // Commercial
  Office: {
    th: "สำนักงาน",
    en: "Office",
    zh: "办公室",
  },
  Store: {
    th: "ร้านค้า",
    en: "Store",
    zh: "商铺",
  },
  Factory: {
    th: "โกดัง - โรงงาน",
    en: "Factory",
    zh: "工厂",
  },
  Hotel: {
    th: "โรงแรม - รีสอร์ท",
    en: "Hotel",
    zh: "酒店",
  },
  Building: {
    th: "อาคาร",
    en: "Building",
    zh: "大楼",
  },
  Apartment: {
    th: "อพาร์ทเมนต์ - หอพัก",
    en: "Apartment",
    zh: "公寓楼",
  }
};

/**
 * Auto-mapping from NainaHub propertyType to our hierarchical system
 */
export const AUTO_MAPPING: Record<string, { main: MainPropertyType; sub: SubPropertyType }> = {
  "Condo": { main: "Living", sub: "Condo" },
  "Townhouse": { main: "Living", sub: "Townhouse" },
  "SingleHouse": { main: "Living", sub: "SingleHouse" },
  "Land": { main: "Land", sub: "Land" },
  "Apartment": { main: "Commercial", sub: "Apartment" }
};

/**
 * Get the main property type from NainaHub propertyType
 */
export function getMainPropertyType(nainaHubType: string): MainPropertyType | null {
  return AUTO_MAPPING[nainaHubType]?.main || null;
}

/**
 * Get the sub property type from NainaHub propertyType
 */
export function getSubPropertyType(nainaHubType: string): SubPropertyType | null {
  return AUTO_MAPPING[nainaHubType]?.sub || null;
}

/**
 * Get label for main property type in specific locale
 */
export function getMainTypeLabel(type: MainPropertyType, locale: string): string {
  const config = PROPERTY_TYPE_HIERARCHY[type];
  if (!config) return type;

  switch (locale) {
    case "th": return config.th;
    case "en": return config.en;
    case "zh": return config.zh;
    default: return config.en;
  }
}

/**
 * Get label for sub property type in specific locale
 */
export function getSubTypeLabel(type: SubPropertyType, locale: string): string {
  const config = SUB_PROPERTY_TYPE_LABELS[type];
  if (!config) return type;

  switch (locale) {
    case "th": return config.th;
    case "en": return config.en;
    case "zh": return config.zh;
    default: return config.en;
  }
}

/**
 * Get all main property types
 */
export function getMainPropertyTypes(): MainPropertyType[] {
  return Object.keys(PROPERTY_TYPE_HIERARCHY) as MainPropertyType[];
}

/**
 * Get subtypes for a specific main type
 */
export function getSubPropertyTypes(mainType: MainPropertyType): SubPropertyType[] {
  return PROPERTY_TYPE_HIERARCHY[mainType]?.subtypes || [];
}
