import { NextResponse } from "next/server";
import { getPopularProperties } from "@/lib/property-extensions";

export async function GET() {
  try {
    const popularProperties = await getPopularProperties(8);
    return NextResponse.json({
      success: true,
      data: popularProperties,
    });
  } catch (error) {
    console.error("Failed to fetch popular properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch popular properties" },
      { status: 500 }
    );
  }
}
