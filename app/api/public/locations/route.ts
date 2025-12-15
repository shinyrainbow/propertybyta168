import { NextResponse } from "next/server";
import { getLocations } from "@/lib/data";

// Static location data with beautiful images for each district
const locationImages: Record<string, string> = {
  "Watthana": "https://images.unsplash.com/photo-1508009603885-50cf7c579c0b?w=800",
  "Bangna": "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800",
  "Khlong Toei": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
  "Khlong San": "https://images.unsplash.com/photo-1563784462041-5f97ac449cdd?w=800",
  "Ladprao": "https://images.unsplash.com/photo-1524169220946-12efd782aab4?w=800",
  "Taling Chan": "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800",
  "Phaya Thai": "https://images.unsplash.com/photo-1555400082-eb4e900d6e53?w=800",
  "Sathorn": "https://images.unsplash.com/photo-1508009603885-50cf7c579c0b?w=800",
  "Huai Khwang": "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800",
  "Silom": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800",
  "Suan Luang": "https://images.unsplash.com/photo-1563784462041-5f97ac449cdd?w=800",
  "Ratchathewi": "https://images.unsplash.com/photo-1524169220946-12efd782aab4?w=800",
  "Phra Khanong": "https://images.unsplash.com/photo-1598511726623-d2e9996892f0?w=800",
  "Jomtien": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
};

export async function GET() {
  try {
    const locations = getLocations();

    // Enhance with better images
    const enhancedLocations = locations.map(loc => ({
      ...loc,
      image: locationImages[loc.name] || loc.image,
    }));

    return NextResponse.json({
      success: true,
      data: enhancedLocations,
    });
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
