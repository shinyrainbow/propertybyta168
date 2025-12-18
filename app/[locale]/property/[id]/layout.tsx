import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProperty(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.propertybyta168.com";
    const res = await fetch(`${baseUrl}/api/nainahub/property/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  const title = property?.propertyTitleTh || property?.propertyTitleEn || `รายละเอียดทรัพย์สิน - ${id}`;
  const description = property?.descriptionTh || property?.descriptionEn || "ดูรายละเอียดอสังหาริมทรัพย์จาก propertybyta168 - บริการอสังหาริมทรัพย์ครบวงจร";
  const imageUrl = property?.imageUrls?.[0] || "https://www.propertybyta168.com/og-image.jpg";

  return {
    title,
    description,
    keywords: ["คอนโด", "บ้าน", "อสังหาริมทรัพย์", "เช่า", "ขาย", "propertybyta168"],
    openGraph: {
      title,
      description,
      url: `https://www.propertybyta168.com/property/${id}`,
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
