import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/admin/blog/[id] - Get a single blog post (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: {
            order: "asc",
          },
        },
        category: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Check if slug is being changed and if it already exists
    if (body.slug && body.slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "A blog with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Determine publishedAt
    let publishedAt = existingBlog.publishedAt;
    if (body.isPublished && !existingBlog.isPublished) {
      publishedAt = new Date();
    } else if (!body.isPublished) {
      publishedAt = null;
    }

    // Delete existing sections and create new ones
    await prisma.blogSection.deleteMany({
      where: { blogId: id },
    });

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: body.title,
        titleEn: body.titleEn || null,
        titleZh: body.titleZh || null,
        slug: body.slug,
        excerpt: body.excerpt || null,
        excerptEn: body.excerptEn || null,
        excerptZh: body.excerptZh || null,
        coverImage: body.coverImage || null,
        isPublished: body.isPublished || false,
        publishedAt,
        categoryId: body.categoryId || null,
        sections: {
          create: (body.sections || []).map(
            (
              section: {
                imageUrl?: string;
                content?: string;
                contentEn?: string;
                contentZh?: string;
              },
              index: number
            ) => ({
              order: index,
              imageUrl: section.imageUrl || null,
              content: section.content || null,
              contentEn: section.contentEn || null,
              contentZh: section.contentZh || null,
            })
          ),
        },
      },
      include: {
        sections: {
          orderBy: {
            order: "asc",
          },
        },
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete blog (sections will be deleted automatically due to onDelete: Cascade)
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
