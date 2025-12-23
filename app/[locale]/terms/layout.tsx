import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const titles: Record<string, string> = {
  th: "ข้อกำหนดการใช้งาน",
  en: "Terms of Service",
  zh: "服务条款",
};

const descriptions: Record<string, string> = {
  th: "ข้อกำหนดการใช้งานของ Property by Ta 168 - กฎและเงื่อนไขในการใช้บริการของเรา",
  en: "Terms of Service of Property by Ta 168 - Rules and conditions for using our services.",
  zh: "Property by Ta 168 的服务条款 - 使用我们服务的规则和条件。",
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
      url: `https://propertybyta168.com/${locale}/terms`,
      type: "website",
    },
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
