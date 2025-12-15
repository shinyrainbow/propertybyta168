import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/public/reviews - Get published reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/public/reviews - Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.rating || !body.comment || !body.transactionType || !body.location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    const rating = parseInt(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        rating: rating,
        comment: body.comment,
        transactionType: body.transactionType,
        location: body.location,
        status: "pending", // All new reviews start as pending
      },
    });

    return NextResponse.json({
      success: true,
      data: review,
      message: "ขอบคุณสำหรับรีวิว! รีวิวของคุณจะแสดงหลังจากได้รับการอนุมัติ",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
