import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ติดต่อ propertybyta168 สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ การเช่า ซื้อ ขาย คอนโด บ้าน ทาวน์เฮ้าส์ในกรุงเทพฯ",
  keywords: [
    "ติดต่อ propertybyta168",
    "ที่ปรึกษาอสังหาริมทรัพย์",
    "นายหน้าอสังหา",
    "contact real estate Bangkok",
  ],
  openGraph: {
    title: "ติดต่อเรา - propertybyta168",
    description:
      "ติดต่อ propertybyta168 สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ในกรุงเทพฯ",
    url: "https://propertybyta168.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
