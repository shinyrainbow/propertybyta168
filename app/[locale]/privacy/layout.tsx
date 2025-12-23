import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "นโยบายความเป็นส่วนตัว",
  en: "Privacy Policy",
  zh: "隐私政策",
};

const descriptions: Record<string, string> = {
  th: "นโยบายความเป็นส่วนตัวของ Property by Ta 168 - วิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลของคุณ",
  en: "Privacy Policy of Property by Ta 168 - How we collect, use, and protect your data.",
  zh: "Property by Ta 168 的隐私政策 - 我们如何收集、使用和保护您的数据。",
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
      url: `https://propertybyta168.com/${locale}/privacy`,
      type: "website",
    },
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
