import type { Metadata } from "next";
import { generatePropertySlug } from "@/lib/slug";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

async function getProperty(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.propertybyta168.com";
    const res = await fetch(`${baseUrl}/api/nainahub/property/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const property = await getProperty(slug);

  const title = property?.propertyTitleTh || property?.propertyTitleEn || `รายละเอียดทรัพย์สิน`;
  const description = property?.descriptionTh || property?.descriptionEn || "ดูรายละเอียดอสังหาริมทรัพย์จาก propertybyta168 - บริการอสังหาริมทรัพย์ครบวงจร";
  const imageUrl = property?.imageUrls?.[0] || "https://www.propertybyta168.com/og-image.jpg";

  // Generate canonical URL with SEO-friendly slug for each locale
  const baseUrl = "https://www.propertybyta168.com";
  const thSlug = property ? generatePropertySlug(property, "th") : slug;
  const enSlug = property ? generatePropertySlug(property, "en") : slug;
  const zhSlug = property ? generatePropertySlug(property, "zh") : slug;

  const canonicalSlug = property ? generatePropertySlug(property, locale) : slug;
  const canonicalUrl = `${baseUrl}/${locale}/property/${canonicalSlug}`;

  return {
    title,
    description,
    keywords: ["คอนโด", "บ้าน", "อสังหาริมทรัพย์", "เช่า", "ขาย", "propertybyta168"],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "th-TH": `${baseUrl}/th/property/${thSlug}`,
        "en-US": `${baseUrl}/en/property/${enSlug}`,
        "zh-CN": `${baseUrl}/zh/property/${zhSlug}`,
        "x-default": `${baseUrl}/th/property/${thSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
