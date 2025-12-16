import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Return static metadata for mock data site
  return {
    title: `รายละเอียดทรัพย์สิน - ${id}`,
    description: "ดูรายละเอียดอสังหาริมทรัพย์จาก propertybyta168 - บริการอสังหาริมทรัพย์ครบวงจร",
    keywords: ["คอนโด", "บ้าน", "อสังหาริมทรัพย์", "เช่า", "ขาย", "propertybyta168"],
    openGraph: {
      title: `รายละเอียดทรัพย์สิน | propertybyta168`,
      description: "ดูรายละเอียดอสังหาริมทรัพย์จาก propertybyta168",
      url: `https://propertybyta168.com/property/${id}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `รายละเอียดทรัพย์สิน | propertybyta168`,
      description: "ดูรายละเอียดอสังหาริมทรัพย์จาก propertybyta168",
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
