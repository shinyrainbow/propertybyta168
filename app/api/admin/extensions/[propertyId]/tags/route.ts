import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getTagsByPropertyId,
  addTag,
  deleteTag,
} from "@/lib/property-extensions";

interface RouteParams {
  params: Promise<{ propertyId: string }>;
}

// GET /api/admin/extensions/[propertyId]/tags - Get all tags for a property
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    const tags = await getTagsByPropertyId(propertyId);

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/admin/extensions/[propertyId]/tags - Add a tag
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId } = await params;
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const tag = await addTag(propertyId, {
      name: body.name,
      color: body.color,
    });

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error("Error adding tag:", error);
    return NextResponse.json(
      { error: "Failed to add tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/extensions/[propertyId]/tags - Delete a tag (requires tagId in query)
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json(
        { error: "Missing required query param: tagId" },
        { status: 400 }
      );
    }

    await deleteTag(tagId);

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
