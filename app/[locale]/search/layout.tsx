import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "ค้นหาอสังหาริมทรัพย์ - คอนโด บ้าน ทาวน์เฮ้าส์",
  en: "Search Properties - Condo, House, Townhouse",
  zh: "搜索房产 - 公寓、别墅、联排别墅",
};

const descriptions: Record<string, string> = {
  th: "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในกรุงเทพฯ และปริมณฑล กรองตามราคา ขนาด ทำเล และประเภท",
  en: "Search condos, houses, townhouses for rent and sale in Bangkok and surrounding areas. Filter by price, size, location, and type.",
  zh: "在曼谷及周边地区搜索出租和出售的公寓、别墅、联排别墅。按价格、面积、位置和类型筛选。",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "en" || locale === "zh" ? locale : "th";

  return {
    title: titles[safeLocale],
    description: descriptions[safeLocale],
    keywords: [
      "ค้นหาคอนโด",
      "ค้นหาบ้าน",
      "คอนโดให้เช่า",
      "บ้านขาย",
      "อสังหาริมทรัพย์กรุงเทพ",
      "condo search Bangkok",
    ],
    openGraph: {
      title: titles[safeLocale],
      description: descriptions[safeLocale],
      url: `https://propertybyta168.com/${locale}/search`,
      type: "website",
    },
  };
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
