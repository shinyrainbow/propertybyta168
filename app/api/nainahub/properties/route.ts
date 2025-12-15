import { NextResponse } from "next/server";
import { fetchNainaHubProperties, type FetchPropertiesParams } from "@/lib/nainahub";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: FetchPropertiesParams = {};

    // Parse all filter parameters
    const q = searchParams.get("q");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const propertyType = searchParams.get("propertyType");
    const listingType = searchParams.get("listingType");
    const bedrooms = searchParams.get("bedrooms");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (q) params.q = q;
    if (limit) params.limit = parseInt(limit);
    if (page) params.page = parseInt(page);
    // Convert "all" to "All" for NainaHub API
    if (propertyType && propertyType !== "all") {
      params.propertyType = propertyType as any;
    } else if (propertyType === "all") {
      params.propertyType = "All" as any;
    }
    if (listingType && listingType !== "all") params.listingType = listingType as any;
    if (bedrooms && bedrooms !== "all") params.bedrooms = parseInt(bedrooms);
    if (minPrice) params.minPrice = parseInt(minPrice);
    if (maxPrice) params.maxPrice = parseInt(maxPrice);

    const response = await fetchNainaHubProperties(params);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
