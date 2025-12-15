import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getProperties, createProperty, Property } from "@/lib/data";

// GET /api/admin/properties - List all properties with filters
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status");
  const propertyType = searchParams.get("propertyType");
  const listingType = searchParams.get("listingType");
  const search = searchParams.get("search");

  let filtered = getProperties();

  // Apply filters
  if (status && status !== "all") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (propertyType && propertyType !== "all") {
    filtered = filtered.filter((p) => p.propertyType === propertyType);
  }

  if (listingType && listingType !== "all") {
    filtered = filtered.filter(
      (p) => p.listingType === listingType || p.listingType === "both"
    );
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.propertyTitleEn?.toLowerCase().includes(searchLower) ||
        p.propertyTitleTh?.toLowerCase().includes(searchLower) ||
        p.agentPropertyCode.toLowerCase().includes(searchLower)
    );
  }

  // Sort by updatedAt descending
  filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

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

// POST /api/admin/properties - Create new property
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "agentPropertyCode",
      "propertyType",
      "listingType",
      "propertyTitleTh",
      "bedRoomNum",
      "bathRoomNum",
      "status",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const newProperty = createProperty({
      agentPropertyCode: body.agentPropertyCode,
      propertyType: body.propertyType,
      listingType: body.listingType,
      propertyTitleEn: body.propertyTitleEn || "",
      propertyTitleTh: body.propertyTitleTh,
      descriptionEn: body.descriptionEn || "",
      descriptionTh: body.descriptionTh || "",
      bedRoomNum: parseInt(body.bedRoomNum),
      bathRoomNum: parseInt(body.bathRoomNum),
      roomSizeNum: body.roomSizeNum ? parseFloat(body.roomSizeNum) : null,
      usableAreaSqm: body.usableAreaSqm ? parseFloat(body.usableAreaSqm) : null,
      landSizeSqw: body.landSizeSqw ? parseFloat(body.landSizeSqw) : null,
      floor: body.floor || null,
      building: body.building || null,
      imageUrls: body.imageUrls || [],
      rentalRateNum: body.rentalRateNum ? parseFloat(body.rentalRateNum) : null,
      sellPriceNum: body.sellPriceNum ? parseFloat(body.sellPriceNum) : null,
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      address: body.address || "",
      district: body.district || "",
      province: body.province || "",
      status: body.status,
      featured: body.featured || false,
      project: body.project || null,
    });

    return NextResponse.json({
      success: true,
      data: newProperty,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
