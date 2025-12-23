import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "บทความ & ข่าวสาร - ความรู้อสังหาริมทรัพย์",
  en: "Blog & News - Real Estate Knowledge",
  zh: "博客和新闻 - 房地产知识",
};

const descriptions: Record<string, string> = {
  th: "อ่านบทความและข่าวสารเกี่ยวกับอสังหาริมทรัพย์ คอนโด บ้าน การลงทุน และเทรนด์ตลาดล่าสุด",
  en: "Read articles and news about real estate, condos, houses, investment, and the latest market trends.",
  zh: "阅读有关房地产、公寓、别墅、投资和最新市场趋势的文章和新闻。",
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
      url: `https://propertybyta168.com/${locale}/blog`,
      type: "website",
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
