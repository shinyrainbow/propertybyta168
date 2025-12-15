import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getAllExtensions,
  upsertPropertyExtension,
} from "@/lib/property-extensions";

// GET /api/admin/extensions - List all property extensions
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const extensions = await getAllExtensions();

    return NextResponse.json({
      success: true,
      data: extensions,
    });
  } catch (error) {
    console.error("Error fetching extensions:", error);
    return NextResponse.json(
      { error: "Failed to fetch extensions" },
      { status: 500 }
    );
  }
}

// POST /api/admin/extensions - Create or update an extension
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.externalPropertyId) {
      return NextResponse.json(
        { error: "Missing required field: externalPropertyId" },
        { status: 400 }
      );
    }

    const extension = await upsertPropertyExtension(body.externalPropertyId, {
      priority: body.priority,
      internalNotes: body.internalNotes,
      isHidden: body.isHidden,
      isFeaturedPopular: body.isFeaturedPopular,
      closedDealDate: body.closedDealDate ? new Date(body.closedDealDate) : body.closedDealDate,
      closedDealType: body.closedDealType,
      closedDealPrice: body.closedDealPrice,
    });

    return NextResponse.json({
      success: true,
      data: extension,
    });
  } catch (error) {
    console.error("Error creating/updating extension:", error);
    return NextResponse.json(
      { error: "Failed to create/update extension" },
      { status: 500 }
    );
  }
}
