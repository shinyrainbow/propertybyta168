import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/blog/[slug] - Get a single published blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
      where: {
        slug,
        isPublished: true,
      },
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
        categoryId: true,
        sections: {
          select: {
            id: true,
            order: true,
            imageUrl: true,
            content: true,
            contentEn: true,
            contentZh: true,
          },
          orderBy: {
            order: "asc",
          },
        },
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
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get related blogs by same category (limit to 5)
    const relatedBlogs = blog.categoryId
      ? await prisma.blog.findMany({
          where: {
            isPublished: true,
            categoryId: blog.categoryId,
            NOT: {
              id: blog.id,
            },
          },
          select: {
            id: true,
            title: true,
            titleEn: true,
            titleZh: true,
            slug: true,
            coverImage: true,
            publishedAt: true,
          },
          orderBy: {
            publishedAt: "desc",
          },
          take: 5,
        })
      : [];

    return NextResponse.json({
      success: true,
      data: {
        ...blog,
        relatedBlogs,
      },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
