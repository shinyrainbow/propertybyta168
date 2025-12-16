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
