import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchNainaHubProperties } from "@/lib/nainahub";
import { prisma } from "@/lib/prisma";

// GET /api/admin/dashboard - Get dashboard statistics from real data
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch real properties from NainaHub API
    const apiResponse = await fetchNainaHubProperties({ limit: 100 });

    if (!apiResponse.success) {
      return NextResponse.json(
        { error: "Failed to fetch properties from API" },
        { status: 500 }
      );
    }

    const properties = apiResponse.data;
    const totalFromApi = apiResponse.pagination.total;

    // Count closed deals from API status
    const closedDealsCount = properties.filter(
      (p) => p.status === "sold" || p.status === "rented"
    ).length;

    // Get local extension stats
    const [
      popularCount,
      reviewStats,
      inquiryStats,
    ] = await Promise.all([
      // Popular properties count (exclude sold/rented properties)
      prisma.propertyExtension.count({
        where: {
          isFeaturedPopular: true,
          isHidden: false,
        },
      }),
      // Review stats
      prisma.review.groupBy({
        by: ["status"],
        _count: true,
      }),
      // Inquiry stats
      prisma.inquiry.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    // Promotions feature not yet implemented
    const activePromotionsCount = 0;
    const extensionsWithPromotions: any[] = [];

    // Calculate stats from API data
    const stats = {
      totalProperties: totalFromApi,
      forRent: properties.filter(
        (p) => p.rentalRateNum && p.rentalRateNum > 0
      ).length,
      forSale: properties.filter(
        (p) => p.sellPriceNum && p.sellPriceNum > 0
      ).length,
      popular: popularCount,
      closedDeals: closedDealsCount,
      activePromotions: activePromotionsCount,
      withPromotions: extensionsWithPromotions.length,
      pendingReviews:
        reviewStats.find((r) => r.status === "pending")?._count || 0,
      publishedReviews:
        reviewStats.find((r) => r.status === "published")?._count || 0,
      newInquiries:
        inquiryStats.find((i) => i.status === "new")?._count || 0,
      totalInquiries: inquiryStats.reduce((sum, i) => sum + i._count, 0),
    };

    // Property type distribution from real data
    const propertyTypeDistribution: Record<string, number> = {
      Condo: 0,
      Townhouse: 0,
      SingleHouse: 0,
      Land: 0,
    };

    properties.forEach((p) => {
      if (propertyTypeDistribution[p.propertyType] !== undefined) {
        propertyTypeDistribution[p.propertyType]++;
      }
    });

    // Listing type distribution
    const listingDistribution = {
      rent: properties.filter((p) => p.rentalRateNum && p.rentalRateNum > 0)
        .length,
      sale: properties.filter((p) => p.sellPriceNum && p.sellPriceNum > 0)
        .length,
      both: properties.filter(
        (p) =>
          p.rentalRateNum &&
          p.rentalRateNum > 0 &&
          p.sellPriceNum &&
          p.sellPriceNum > 0
      ).length,
    };

    // Recent properties (first 5 from API)
    const recentProperties = properties.slice(0, 5).map((p) => ({
      id: p.id,
      propertyTitleTh: p.propertyTitleTh,
      propertyTitleEn: p.propertyTitleEn,
      propertyType: p.propertyType,
      agentPropertyCode: p.agentPropertyCode || p.projectPropertyCode || "-",
      rentalRateNum: p.rentalRateNum,
      sellPriceNum: p.sellPriceNum,
      imageUrl: p.imageUrls?.[0] || null,
      project: p.project,
    }));

    // Properties with promotions (get details from API)
    const promoPropertyIds = new Set(
      extensionsWithPromotions.map((e) => e.externalPropertyId)
    );
    const propertiesWithPromotions = properties
      .filter((p) => promoPropertyIds.has(p.id))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        propertyTitleTh: p.propertyTitleTh,
        propertyType: p.propertyType,
        imageUrl: p.imageUrls?.[0] || null,
        project: p.project,
      }));

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentProperties,
        propertyTypeDistribution,
        listingDistribution,
        propertiesWithPromotions,
      },
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
