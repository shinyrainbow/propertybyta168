"use client";

interface PropertyJsonLdProps {
  property: {
    id: string;
    propertyTitleTh: string;
    propertyTitleEn: string;
    descriptionTh?: string;
    descriptionEn?: string;
    propertyType: string;
    listingType: string;
    bedRoomNum: number;
    bathRoomNum: number;
    roomSizeNum: number | null;
    usableAreaSqm: number | null;
    rentalRateNum: number | null;
    sellPriceNum: number | null;
    imageUrls: string[];
    address?: string;
    district?: string;
    province?: string;
    latitude: number | null;
    longitude: number | null;
  };
}

export function PropertyJsonLd({ property }: PropertyJsonLdProps) {
  const price = property.rentalRateNum || property.sellPriceNum || 0;
  const priceType = property.rentalRateNum ? "RENT" : "SALE";
  const address = [property.address, property.district, property.province]
    .filter(Boolean)
    .join(", ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.propertyTitleTh || property.propertyTitleEn,
    description: property.descriptionTh || property.descriptionEn || "",
    url: `https://propertybyta168.com/property/${property.id}`,
    image: property.imageUrls,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "THB",
      availability: "https://schema.org/InStock",
      businessFunction:
        priceType === "RENT"
          ? "https://schema.org/LeaseOut"
          : "https://schema.org/SellAction",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.district || "",
      addressRegion: property.province || "",
      addressCountry: "TH",
      streetAddress: property.address || "",
    },
    geo:
      property.latitude && property.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          }
        : undefined,
    numberOfRooms: property.bedRoomNum,
    numberOfBathroomsTotal: property.bathRoomNum,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.roomSizeNum || property.usableAreaSqm || 0,
      unitCode: "MTK",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface OrganizationJsonLdProps {
  name?: string;
}

export function OrganizationJsonLd({
  name = "propertybyta168",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: name,
    url: "https://propertybyta168.com",
    logo: "https://propertybyta168.com/logo.png",
    description:
      "บริการที่ปรึกษาอสังหาริมทรัพย์ คอนโด บ้าน ทาวน์เฮ้าส์ ให้เช่าและขาย ในกรุงเทพฯ",
    areaServed: {
      "@type": "City",
      name: "Bangkok",
      "@id": "https://www.wikidata.org/wiki/Q1861",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangkok",
      addressCountry: "TH",
    },
    sameAs: [
      "https://www.facebook.com/p/Property-By-Ta-168-100093155621525/",
      "https://www.tiktok.com/@propertybyta",
      "https://line.me/ti/p/@propertybyta168",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Search Results Page JSON-LD
interface SearchProperty {
  id: string;
  agentPropertyCode?: string | null;
  propertyTitleTh?: string | null;
  propertyTitleEn?: string | null;
  propertyType: string;
  rentalRateNum: number | null;
  sellPriceNum: number | null;
  imageUrls: string[];
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum?: number | null;
  usableAreaSqm?: number | null;
  project?: {
    projectNameTh?: string | null;
    projectNameEn?: string | null;
    addressDistrict?: string | null;
  } | null;
}

interface SearchResultsJsonLdProps {
  properties: SearchProperty[];
  searchQuery?: string;
  listingType?: string;
  propertyType?: string;
  locale?: string;
  currentUrl: string;
  totalResults: number;
}

export function SearchResultsJsonLd({
  properties,
  searchQuery,
  listingType,
  propertyType,
  locale = "th",
  currentUrl,
  totalResults,
}: SearchResultsJsonLdProps) {
  const baseUrl = "https://www.propertybyta168.com";

  // Build search description
  const searchDescription = [
    listingType === "rent" ? "ให้เช่า" : listingType === "sale" ? "ขาย" : "",
    propertyType || "",
    searchQuery || "",
    "กรุงเทพฯ",
  ].filter(Boolean).join(" ");

  // ItemList for property listings
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `รวมอสังหาริมทรัพย์${listingType === "rent" ? "ให้เช่า" : listingType === "sale" ? "ขาย" : ""} - propertybyta168`,
    description: `พบ ${totalResults} รายการ ${searchDescription}`,
    numberOfItems: totalResults,
    itemListElement: properties.slice(0, 10).map((property, index) => ({
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
    </>
  );
}

// WebSite with SearchAction for sitelinks search box
export function WebsiteSearchJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "propertybyta168",
    url: "https://www.propertybyta168.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.propertybyta168.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
