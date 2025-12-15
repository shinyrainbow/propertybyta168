import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });

  const titles: Record<string, string> = {
    th: "ค้นหาอสังหาริมทรัพย์บนแผนที่ | Sky Pro Property",
    en: "Map Search Properties | Sky Pro Property",
    ja: "地図で物件検索 | Sky Pro Property",
    zh: "地图搜索房产 | Sky Pro Property",
  };

  const descriptions: Record<string, string> = {
    th: "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ที่ดิน และอสังหาริมทรัพย์อื่นๆ บนแผนที่แบบ Interactive ค้นหาตามทำเลที่ต้องการได้ง่ายๆ",
    en: "Search for condos, single houses, townhouses, land and other properties on an interactive map. Easily find properties in your desired location.",
    ja: "インタラクティブマップでコンドミニアム、一戸建て、タウンハウス、土地などを検索。希望のエリアで物件を簡単に探せます。",
    zh: "在互动地图上搜索公寓、独栋别墅、联排别墅、土地等房产。轻松找到您理想位置的房产。",
  };

  const title = titles[locale] || titles.en;
  const description = descriptions[locale] || descriptions.en;

  return {
    title,
    description,
    keywords: [
      "map search",
      "property search",
      "real estate map",
      "condo search",
      "house search",
      "Bangkok property",
      "Chiang Mai property",
      "Thailand real estate",
      "ค้นหาแผนที่",
      "ค้นหาอสังหาริมทรัพย์",
      "คอนโดเชียงใหม่",
      "บ้านเชียงใหม่",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://skyproproperties.com/${locale}/map-search`,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://skyproproperties.com/${locale}/map-search`,
      languages: {
        "th-TH": "https://skyproproperties.com/th/map-search",
        "en-US": "https://skyproproperties.com/en/map-search",
        "ja-JP": "https://skyproproperties.com/ja/map-search",
        "zh-CN": "https://skyproproperties.com/zh/map-search",
      },
    },
  };
}

export default function MapSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
