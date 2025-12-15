import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getPropertyById, updateProperty, deleteProperty } from "@/lib/data";

// GET /api/admin/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: property,
  });
}

// PUT /api/admin/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const updatedProperty = updateProperty(id, {
      agentPropertyCode: body.agentPropertyCode,
      propertyType: body.propertyType,
      listingType: body.listingType,
      propertyTitleEn: body.propertyTitleEn,
      propertyTitleTh: body.propertyTitleTh,
      descriptionEn: body.descriptionEn,
      descriptionTh: body.descriptionTh,
      bedRoomNum: body.bedRoomNum ? parseInt(body.bedRoomNum) : undefined,
      bathRoomNum: body.bathRoomNum ? parseInt(body.bathRoomNum) : undefined,
      roomSizeNum: body.roomSizeNum ? parseFloat(body.roomSizeNum) : undefined,
      usableAreaSqm: body.usableAreaSqm
        ? parseFloat(body.usableAreaSqm)
        : undefined,
      landSizeSqw: body.landSizeSqw ? parseFloat(body.landSizeSqw) : undefined,
      floor: body.floor,
      building: body.building,
      imageUrls: body.imageUrls,
      rentalRateNum: body.rentalRateNum
        ? parseFloat(body.rentalRateNum)
        : undefined,
      sellPriceNum: body.sellPriceNum
        ? parseFloat(body.sellPriceNum)
        : undefined,
      latitude: body.latitude ? parseFloat(body.latitude) : undefined,
      longitude: body.longitude ? parseFloat(body.longitude) : undefined,
      address: body.address,
      district: body.district,
      province: body.province,
      status: body.status,
      featured: body.featured,
      project: body.project,
    });

    if (!updatedProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteProperty(id);

  if (!deleted) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: "Property deleted successfully",
  });
}
