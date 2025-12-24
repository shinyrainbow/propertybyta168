import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function fetchProperties(listingType?: string, propertyType?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.propertybyta168.com";
    const params = new URLSearchParams();
    params.set("limit", "10");
    if (listingType && listingType !== "all") params.set("listingType", listingType);
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);

    const res = await fetch(`${baseUrl}/api/nainahub/properties?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { data: [], total: 0 };
    return res.json();
  } catch {
    return { data: [], total: 0 };
  }
}

const titles: Record<string, Record<string, string>> = {
  default: {
    th: "ค้นหาอสังหาริมทรัพย์ - คอนโด บ้าน ทาวน์เฮ้าส์",
    en: "Search Properties - Condo, House, Townhouse",
    zh: "搜索房产 - 公寓、别墅、联排别墅",
  },
  rent: {
    th: "คอนโดให้เช่า บ้านให้เช่า กรุงเทพ - propertybyta168",
    en: "Condo for Rent, House for Rent Bangkok - propertybyta168",
    zh: "曼谷公寓出租、别墅出租 - propertybyta168",
  },
  sale: {
    th: "คอนโดขาย บ้านขาย กรุงเทพ - propertybyta168",
    en: "Condo for Sale, House for Sale Bangkok - propertybyta168",
    zh: "曼谷公寓出售、别墅出售 - propertybyta168",
  },
};

const descriptions: Record<string, Record<string, string>> = {
  default: {
    th: "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในกรุงเทพฯ และปริมณฑล กรองตามราคา ขนาด ทำเล และประเภท",
    en: "Search condos, houses, townhouses for rent and sale in Bangkok and surrounding areas. Filter by price, size, location, and type.",
    zh: "在曼谷及周边地区搜索出租和出售的公寓、别墅、联排别墅。按价格、面积、位置和类型筛选。",
  },
  rent: {
    th: "รวมคอนโดให้เช่า บ้านให้เช่า ทาวน์เฮ้าส์ให้เช่า ในกรุงเทพฯ ราคาดี ทำเลดี พร้อมเข้าอยู่",
    en: "Find condos, houses, townhouses for rent in Bangkok. Great prices, prime locations, ready to move in.",
    zh: "查找曼谷出租的公寓、别墅、联排别墅。价格优惠，地段优越，可即时入住。",
  },
  sale: {
    th: "รวมคอนโดขาย บ้านขาย ทาวน์เฮ้าส์ขาย ในกรุงเทพฯ ราคาดี ทำเลดี",
    en: "Find condos, houses, townhouses for sale in Bangkok. Great prices, prime locations.",
    zh: "查找曼谷出售的公寓、别墅、联排别墅。价格优惠，地段优越。",
  },
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  const listingType = typeof search.listingType === "string" ? search.listingType : undefined;
  const safeLocale = locale === "en" || locale === "zh" ? locale : "th";
  const titleKey = listingType === "rent" || listingType === "sale" ? listingType : "default";

  const baseUrl = "https://www.propertybyta168.com";
  const queryStr = listingType ? `?listingType=${listingType}` : "";
  const currentUrl = `${baseUrl}/${locale}/search${queryStr}`;

  return {
    title: titles[titleKey][safeLocale],
    description: descriptions[titleKey][safeLocale],
    keywords: [
      "ค้นหาคอนโด",
      "ค้นหาบ้าน",
      "คอนโดให้เช่า",
      "บ้านขาย",
      "อสังหาริมทรัพย์กรุงเทพ",
      "condo search Bangkok",
    ],
    alternates: {
      canonical: currentUrl,
      languages: {
        "th-TH": `${baseUrl}/th/search${queryStr}`,
        "en-US": `${baseUrl}/en/search${queryStr}`,
        "zh-CN": `${baseUrl}/zh/search${queryStr}`,
        "x-default": `${baseUrl}/th/search${queryStr}`,
      },
    },
    openGraph: {
      title: titles[titleKey][safeLocale],
      description: descriptions[titleKey][safeLocale],
      url: currentUrl,
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: titles[titleKey][safeLocale],
        },
      ],
    },
  };
}

export default async function SearchLayout({
  children,
  params,
  searchParams,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const listingType = typeof search.listingType === "string" ? search.listingType : undefined;
  const propertyType = typeof search.propertyType === "string" ? search.propertyType : undefined;
  const q = typeof search.q === "string" ? search.q : undefined;

  const baseUrl = "https://www.propertybyta168.com";
  const response = await fetchProperties(listingType, propertyType);
  const properties = response.data || [];
  const totalResults = response.total || properties.length;

  // Build current URL
  const searchParamsStr = new URLSearchParams();
  if (listingType) searchParamsStr.set("listingType", listingType);
  if (propertyType) searchParamsStr.set("propertyType", propertyType);
  if (q) searchParamsStr.set("q", q);
  const currentUrl = `${baseUrl}/${locale}/search${searchParamsStr.toString() ? `?${searchParamsStr.toString()}` : ""}`;

  // Build search description
  const searchDescription = [
    listingType === "rent" ? "ให้เช่า" : listingType === "sale" ? "ขาย" : "",
    propertyType || "",
    q || "",
    "กรุงเทพฯ",
  ].filter(Boolean).join(" ");

  // ItemList for property listings
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `รวมอสังหาริมทรัพย์${listingType === "rent" ? "ให้เช่า" : listingType === "sale" ? "ขาย" : ""} - propertybyta168`,
    description: `พบ ${totalResults} รายการ ${searchDescription}`,
    numberOfItems: totalResults,
    itemListElement: properties.slice(0, 10).map((property: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        "@id": `${baseUrl}/${locale}/property/${property.agentPropertyCode || property.id}`,
        name: property.propertyTitleTh || property.propertyTitleEn || property.project?.projectNameTh || "อสังหาริมทรัพย์",
        url: `${baseUrl}/${locale}/property/${property.agentPropertyCode || property.id}`,
        image: property.imageUrls?.[0] || `${baseUrl}/og-image.jpg`,
        offers: {
          "@type": "Offer",
          price: property.rentalRateNum || property.sellPriceNum || 0,
          priceCurrency: "THB",
          availability: "https://schema.org/InStock",
        },
        numberOfRooms: property.bedRoomNum,
        numberOfBathroomsTotal: property.bathRoomNum,
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.roomSizeNum || property.usableAreaSqm || 0,
          unitCode: "MTK",
        },
      },
    })),
  };

  // SearchResultsPage schema
  const searchPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `ค้นหาอสังหาริมทรัพย์ ${searchDescription} - propertybyta168`,
    description: `ค้นหาคอนโด บ้าน ทาวน์เฮ้าส์ ${listingType === "rent" ? "ให้เช่า" : "ขาย"} ในกรุงเทพฯ พบ ${totalResults} รายการ`,
    url: currentUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalResults,
    },
    provider: {
      "@type": "RealEstateAgent",
      name: "propertybyta168",
      url: baseUrl,
    },
  };

  // Breadcrumb
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "หน้าแรก",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: listingType === "rent" ? "เช่า" : listingType === "sale" ? "ซื้อ" : "ค้นหา",
        item: currentUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
