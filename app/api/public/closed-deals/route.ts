import { NextResponse } from "next/server";
import { getClosedDeals } from "@/lib/data";

export async function GET() {
  try {
    const closedDeals = getClosedDeals(8);
    return NextResponse.json({
      success: true,
      data: closedDeals,
    });
  } catch (error) {
    console.error("Failed to fetch closed deals:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch closed deals" },
      { status: 500 }
    );
  }
}
