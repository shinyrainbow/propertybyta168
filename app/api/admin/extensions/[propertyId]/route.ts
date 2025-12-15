import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getExtensionByPropertyId,
  upsertPropertyExtension,
  deletePropertyExtension,
} from "@/lib/property-extensions";

interface RouteParams {
  params: Promise<{ propertyId: string }>;
}

// GET /api/admin/extensions/[propertyId] - Get extension for a property
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    const extension = await getExtensionByPropertyId(propertyId);

    if (!extension) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: extension,
    });
  } catch (error) {
    console.error("Error fetching extension:", error);
    return NextResponse.json(
      { error: "Failed to fetch extension" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/extensions/[propertyId] - Update extension for a property
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    const body = await request.json();

    const extension = await upsertPropertyExtension(propertyId, {
      priority: body.priority,
      internalNotes: body.internalNotes,
      isHidden: body.isHidden,
      isFeaturedPopular: body.isFeaturedPopular,
      mainPropertyType: body.mainPropertyType,
      subPropertyType: body.subPropertyType,
      closedDealDate: body.closedDealDate ? new Date(body.closedDealDate) : body.closedDealDate,
      closedDealType: body.closedDealType,
      closedDealPrice: body.closedDealPrice,
    });

    return NextResponse.json({
      success: true,
      data: extension,
    });
  } catch (error) {
    console.error("Error updating extension:", error);
    return NextResponse.json(
      { error: "Failed to update extension" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/extensions/[propertyId] - Delete extension for a property
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    await deletePropertyExtension(propertyId);

    return NextResponse.json({
      success: true,
      message: "Extension deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting extension:", error);
    return NextResponse.json(
      { error: "Failed to delete extension" },
      { status: 500 }
    );
  }
}
