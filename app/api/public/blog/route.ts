import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/blog - Get all published blog posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const whereClause: any = {
      isPublished: true,
    };

    // Filter by category if provided
    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
        isActive: true,
      };
    }

    const blogs = await prisma.blog.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        titleEn: true,
        titleZh: true,
        slug: true,
        excerpt: true,
        excerptEn: true,
        excerptZh: true,
        coverImage: true,
        isPublished: true,
        publishedAt: true,
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            nameZh: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: Math.min(limit, 50), // Limit to requested amount, max 50
    });

    return NextResponse.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
