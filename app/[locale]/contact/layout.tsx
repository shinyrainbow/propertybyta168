import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "ติดต่อเรา",
  en: "Contact Us",
  zh: "联系我们",
};

const descriptions: Record<string, string> = {
  th: "ติดต่อ propertybyta168 สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ การเช่า ซื้อ ขาย คอนโด บ้าน ทาวน์เฮ้าส์ในกรุงเทพฯ",
  en: "Contact propertybyta168 for real estate consulting services - rent, buy, sell condos, houses, townhouses in Bangkok.",
  zh: "联系 propertybyta168 获取房地产咨询服务 - 在曼谷租赁、购买、出售公寓、别墅、联排别墅。",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = locale === "en" || locale === "zh" ? locale : "th";

  return {
    title: titles[safeLocale],
    description: descriptions[safeLocale],
    keywords: [
      "ติดต่อ propertybyta168",
      "ที่ปรึกษาอสังหาริมทรัพย์",
      "นายหน้าอสังหา",
      "contact real estate Bangkok",
    ],
    openGraph: {
      title: titles[safeLocale],
      description: descriptions[safeLocale],
      url: `https://propertybyta168.com/${locale}/contact`,
      type: "website",
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
