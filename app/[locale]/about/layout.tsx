import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "เกี่ยวกับเรา - Property by Ta 168",
  en: "About Us - Property by Ta 168",
  zh: "关于我们 - Property by Ta 168",
};

const descriptions: Record<string, string> = {
  th: "รู้จัก Property by Ta 168 ที่ปรึกษาอสังหาริมทรัพย์มืออาชีพ ให้บริการซื้อ ขาย เช่า คอนโด บ้าน ในกรุงเทพฯ",
  en: "Learn about Property by Ta 168 - professional real estate consultants offering buying, selling, and renting services for condos and houses in Bangkok.",
  zh: "了解 Property by Ta 168 - 专业的房地产顾问，提供曼谷公寓和别墅的买卖和租赁服务。",
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
      url: `https://propertybyta168.com/${locale}/about`,
      type: "website",
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
