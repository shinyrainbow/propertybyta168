import { NextRequest, NextResponse } from "next/server";
import { getProperties } from "@/lib/data";

// GET /api/public/properties - List public properties
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const propertyType = searchParams.get("propertyType");
  const listingType = searchParams.get("listingType");
  const bedrooms = searchParams.get("bedrooms");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  let filtered = getProperties().filter((p) => p.status === "active");

  // Apply filters
  if (propertyType && propertyType !== "all") {
    filtered = filtered.filter((p) => p.propertyType === propertyType);
  }

  if (listingType && listingType !== "all") {
    filtered = filtered.filter(
      (p) => p.listingType === listingType || p.listingType === "both"
    );
  }

  if (bedrooms && bedrooms !== "all") {
    const bedroomNum = parseInt(bedrooms);
    if (bedroomNum === 4) {
      filtered = filtered.filter((p) => p.bedRoomNum >= 4);
    } else {
      filtered = filtered.filter((p) => p.bedRoomNum === bedroomNum);
    }
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    filtered = filtered.filter((p) => {
      const price = p.rentalRateNum || p.sellPriceNum || 0;
      return price >= min;
    });
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    filtered = filtered.filter((p) => {
      const price = p.rentalRateNum || p.sellPriceNum || 0;
      return price <= max;
    });
  }

  // Sort by featured first, then by createdAt
  filtered.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Pagination
  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
