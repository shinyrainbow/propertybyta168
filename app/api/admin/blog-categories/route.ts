import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all blog categories
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Failed to fetch blog categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create a new blog category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nameEn, nameZh, slug, color, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const category = await prisma.blogCategory.create({
      data: {
        name,
        nameEn: nameEn || null,
        nameZh: nameZh || null,
        slug,
        color: color || "#3B82F6",
        order: order || 0,
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("Failed to create blog category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
