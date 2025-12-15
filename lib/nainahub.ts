/**
 * NainaHub API Client
 * Fetches properties from the external NainaHub API
 */

const NAINAHUB_API_URL = "https://nainahub.com/api/public/properties";
const NAINAHUB_USER_ID = "18ccfc2a-92d3-4bbe-abf2-3767132b416d";

export interface NainaHubProject {
  projectCode: string;
  projectNameEn: string;
  projectNameTh: string;
  projectLocationText: string | null;
  projectLatitude: number | null;
  projectLongitude: number | null;
}

export type PropertyStatus =
  | "pending"
  | "available"
  | "reserved"
  | "under_contract"
  | "sold"
  | "rented"
  | "under_maintenance"
  | "off_market";

export interface NainaHubProperty {
  id: string;
  projectPropertyCode: string | null;
  agentPropertyCode: string | null;
  propertyType: "Condo" | "Townhouse" | "SingleHouse" | "Villa" | "Land" | "Office" | "Store" | "Factory" | "Hotel" | "Building";
  propertyTitleEn: string;
  propertyTitleTh: string;
  propertyLocationText: string | null;
  bedRoom: number | null;
  bedRoomNum: number;
  bathRoom: number | null;
  bathRoomNum: number;
  roomSize: number | null;
  roomSizeNum: number;
  usableAreaSqm: number;
  rai: number;
  ngan: number;
  landSizeSqw: number;
  floor: string;
  building: string;
  imageUrls: string[];
  rentalRate: number | null;
  rentalRateNum: number;
  sellPrice: number | null;
  sellPriceNum: number;
  latitude: number | null;
  longitude: number | null;
  projectCode: string;
  project: NainaHubProject;
  status: PropertyStatus;
  updatedAt: string;
  note: string | null;
  amenities?: string[];
}

export interface NainaHubPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NainaHubResponse {
  success: boolean;
  data: NainaHubProperty[];
  pagination: NainaHubPagination;
}

export interface FetchPropertiesParams {
  q?: string;
  propertyType?: "Condo" | "Townhouse" | "SingleHouse" | "Villa" | "Land" | "Office" | "Store" | "Factory" | "Hotel" | "Building";
  listingType?: "rent" | "sale" | "";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

/**
 * Fetch properties from NainaHub API
 */
export async function fetchNainaHubProperties(
  params: FetchPropertiesParams = {}
): Promise<NainaHubResponse> {
  const apiKey = process.env["X_API_KEY"];

  if (!apiKey) {
    throw new Error("X_API_KEY environment variable is not set");
  }

  const searchParams = new URLSearchParams();

  // Always include userId
  searchParams.set("userId", NAINAHUB_USER_ID);

  if (params.q) searchParams.set("q", params.q);
  if (params.propertyType) searchParams.set("propertyType", params.propertyType);
  if (params.listingType) searchParams.set("listingType", params.listingType);
  if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());
  if (params.bedrooms) searchParams.set("bedrooms", params.bedrooms.toString());
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  const url = `${NAINAHUB_API_URL}?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`NainaHub API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single property by ID from NainaHub
 * Note: This fetches all properties and filters - ideally the API would support fetching by ID
 */
export async function fetchNainaHubPropertyById(
  id: string
): Promise<NainaHubProperty | null> {
  // Fetch with high limit to find the property
  const response = await fetchNainaHubProperties({ limit: 100 });
  return response.data.find((p) => p.id === id) || null;
}
