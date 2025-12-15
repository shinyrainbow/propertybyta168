import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description:
    "ติดต่อ Sky Pro Property สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ การเช่า ซื้อ ขาย คอนโด บ้าน ทาวน์เฮ้าส์ในกรุงเทพฯ",
  keywords: [
    "ติดต่อ Sky Pro Property",
    "ที่ปรึกษาอสังหาริมทรัพย์",
    "นายหน้าอสังหา",
    "contact real estate Chiangmai",
  ],
  openGraph: {
    title: "ติดต่อเรา - Sky Pro Property",
    description:
      "ติดต่อ Sky Pro Property สำหรับบริการที่ปรึกษาอสังหาริมทรัพย์ในเชียงใหม่",
    url: "https://skyproproperty.com/contact",
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
