import { NextResponse } from "next/server";
import { fetchNainaHubProperties } from "@/lib/nainahub";

export async function GET() {
  try {
    // Fetch all properties from NainaHub
    const response = await fetchNainaHubProperties({ limit: 100 });

    // Group properties by project
    const projectMap = new Map<
      string,
      {
        projectCode: string;
        projectNameEn: string;
        projectNameTh: string;
        count: number;
        image: string;
      }
    >();

    response.data.forEach((property) => {
      if (property.project && property.projectCode) {
        const existing = projectMap.get(property.projectCode);
        if (existing) {
          existing.count++;
          // Use the first image with the most properties or keep existing
          if (!existing.image && property.imageUrls && property.imageUrls.length > 0) {
            existing.image = property.imageUrls[0];
          }
        } else {
          projectMap.set(property.projectCode, {
            projectCode: property.projectCode,
            projectNameEn: property.project.projectNameEn,
            projectNameTh: property.project.projectNameTh,
            count: 1,
            image: property.imageUrls?.[0] || "",
          });
        }
      }
    });

    // Convert to array and sort by count (most properties first)
    const projects = Array.from(projectMap.values())
      .filter((p) => p.image) // Only include projects with images
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Limit to top 8 projects

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
