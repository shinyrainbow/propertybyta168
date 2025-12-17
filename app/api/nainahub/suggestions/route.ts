import { NextResponse } from "next/server";
import { fetchNainaHubSuggestions } from "@/lib/nainahub";

export async function GET() {
  try {
    const response = await fetchNainaHubSuggestions();
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suggestions", data: { projects: [], locations: [] } },
      { status: 500 }
    );
  }
}
