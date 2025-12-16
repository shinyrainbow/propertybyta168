import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ค้นหาอสังหาริมทรัพย์ - คอนโด บ้าน ทาวน์เฮ้าส์",
  description:
    "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในกรุงเทพฯ และปริมณฑล กรองตามราคา ขนาด ทำเล และประเภท",
  keywords: [
    "ค้นหาคอนโด",
    "ค้นหาบ้าน",
    "คอนโดให้เช่า",
    "บ้านขาย",
    "อสังหาริมทรัพย์กรุงเทพ",
    "condo search Bangkok",
  ],
  openGraph: {
    title: "ค้นหาอสังหาริมทรัพย์ - propertybyta168",
    description:
      "ค้นหาคอนโด บ้านเดี่ยว ทาวน์เฮ้าส์ ให้เช่าและขาย ในกรุงเทพฯ และปริมณฑล",
    url: "https://propertybyta168.com/search",
    type: "website",
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
