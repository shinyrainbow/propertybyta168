import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Fetch all property listings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const listings = await prisma.propertyListing.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: listings });
  } catch (error) {
    console.error("Error fetching property listings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch property listings" },
      { status: 500 }
    );
  }
}

// PUT - Update property listing status/notes
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Listing ID is required" },
        { status: 400 }
      );
    }

    const listing = await prisma.propertyListing.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ success: true, data: listing });
  } catch (error) {
    console.error("Error updating property listing:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update property listing" },
      { status: 500 }
    );
  }
}

// DELETE - Delete property listing
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Listing ID is required" },
        { status: 400 }
      );
    }

    await prisma.propertyListing.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property listing:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete property listing" },
      { status: 500 }
    );
  }
}
