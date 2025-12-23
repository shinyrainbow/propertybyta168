import { NextResponse } from "next/server";
import { fetchNainaHubPropertyById, fetchNainaHubPropertyByCode } from "@/lib/nainahub";
import { isUUID, extractPropertyCodeFromSlug } from "@/lib/slug";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    let property = null;

    // Check if it's a UUID (old format) or a slug (new format)
    if (isUUID(slug)) {
      // Legacy UUID lookup
      property = await fetchNainaHubPropertyById(slug);
    } else {
      // New slug format - extract property code from end of slug
      const propertyCode = extractPropertyCodeFromSlug(slug);
      property = await fetchNainaHubPropertyByCode(propertyCode);
    }

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}
