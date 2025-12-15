import { NextRequest, NextResponse } from "next/server";
import { fetchNainaHubPropertyById, NainaHubProperty } from "@/lib/nainahub";

// Transform NainaHub property to frontend format
function transformProperty(prop: NainaHubProperty) {
  // Determine listing type based on prices
  let listingType: "rent" | "sale" | "both" = "rent";
  if (prop.rentalRateNum > 0 && prop.sellPriceNum > 0) {
    listingType = "both";
  } else if (prop.sellPriceNum > 0) {
    listingType = "sale";
  } else if (prop.rentalRateNum > 0) {
    listingType = "rent";
  }

  return {
    id: prop.id,
    agentPropertyCode: prop.agentPropertyCode || prop.projectPropertyCode || "",
    propertyType: prop.propertyType,
    listingType,
    propertyTitleEn: prop.propertyTitleEn,
    propertyTitleTh: prop.propertyTitleTh,
    descriptionEn: "",
    descriptionTh: "",
    bedRoomNum: prop.bedRoomNum,
    bathRoomNum: prop.bathRoomNum,
    roomSizeNum: prop.roomSizeNum || null,
    usableAreaSqm: prop.usableAreaSqm || null,
    landSizeSqw: prop.landSizeSqw || null,
    floor: prop.floor || null,
    building: prop.building || null,
    imageUrls: prop.imageUrls || [],
    rentalRateNum: prop.rentalRateNum || null,
    sellPriceNum: prop.sellPriceNum || null,
    latitude: prop.latitude || prop.project?.projectLatitude || null,
    longitude: prop.longitude || prop.project?.projectLongitude || null,
    address: "",
    district: "",
    province: "Bangkok",
    status: "active" as const,
    featured: false,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    project: prop.project
      ? {
          projectNameEn: prop.project.projectNameEn,
          projectNameTh: prop.project.projectNameTh,
        }
      : null,
  };
}

// GET /api/public/properties/[id] - Get single property from NainaHub
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await fetchNainaHubPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    const transformedProperty = transformProperty(property);

    return NextResponse.json({
      success: true,
      data: transformedProperty,
    });
  } catch (error) {
    console.error("Failed to fetch property from NainaHub:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
