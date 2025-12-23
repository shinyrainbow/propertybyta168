import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "รายการโปรด - ทรัพย์สินที่บันทึกไว้",
  en: "Favorites - Saved Properties",
  zh: "收藏夹 - 已保存的房产",
};

const descriptions: Record<string, string> = {
  th: "ดูรายการทรัพย์สินที่คุณบันทึกไว้ คอนโด บ้าน ทาวน์เฮ้าส์ ที่คุณสนใจ",
  en: "View your saved properties - condos, houses, townhouses that you're interested in.",
  zh: "查看您保存的房产 - 您感兴趣的公寓、别墅、联排别墅。",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "en" || locale === "zh" ? locale : "th";

  return {
    title: titles[safeLocale],
    description: descriptions[safeLocale],
    openGraph: {
      title: titles[safeLocale],
      description: descriptions[safeLocale],
      url: `https://propertybyta168.com/${locale}/favorites`,
      type: "website",
    },
  };
}

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
