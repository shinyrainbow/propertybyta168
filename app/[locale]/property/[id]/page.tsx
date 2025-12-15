"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
  Share2,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  Calendar,
  CheckCircle2,
  Star,
  MessageCircle,
  X,
  Images,
  ZoomIn,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { PropertyJsonLd } from "@/components/seo/json-ld";
import ShareButton from "@/components/property/share-button";
import { getAmenityLabelByLocale } from "@/lib/amenities";

interface Property {
  id: string;
  agentPropertyCode: string;
  propertyType: string;
  listingType: string;
  propertyTitleEn: string;
  propertyTitleTh: string;
  descriptionEn?: string;
  descriptionTh?: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number | null;
  usableAreaSqm: number | null;
  landSizeSqw: number | null;
  floor: string | null;
  building: string | null;
  imageUrls: string[];
  rentalRateNum: number | null;
  sellPriceNum: number | null;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  district?: string;
  province?: string;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  project: {
    projectNameEn: string;
    projectNameTh: string;
  } | null;
  amenities?: string[];
}

// Mock property data for new projects
const mockProjectProperties: Record<string, Property> = {
  "project-1": {
    id: "project-1",
    agentPropertyCode: "SKY-001",
    propertyType: "Condo",
    listingType: "sale",
    propertyTitleEn: "The Skyline Residence - Luxury 2BR Unit",
    propertyTitleTh: "The Skyline Residence - ห้องหรู 2 ห้องนอน",
    descriptionEn:
      "Experience luxury living at The Skyline Residence. This stunning 2-bedroom unit features floor-to-ceiling windows with panoramic city views, premium finishes throughout, and access to world-class amenities including infinity pool, fitness center, and 24/7 concierge service.",
    descriptionTh:
      "สัมผัสประสบการณ์การอยู่อาศัยระดับหรูที่ The Skyline Residence ห้องชุด 2 ห้องนอนสุดอลังการนี้มีหน้าต่างกระจกจากพื้นจรดเพดานพร้อมวิวเมืองแบบพาโนรามา การตกแต่งระดับพรีเมียมทั่วทั้งห้อง และสิ่งอำนวยความสะดวกระดับโลก ได้แก่ สระว่ายน้ำอินฟินิตี้ ฟิตเนส และบริการ Concierge ตลอด 24 ชั่วโมง",
    bedRoomNum: 2,
    bathRoomNum: 2,
    roomSizeNum: 75,
    usableAreaSqm: 75,
    landSizeSqw: null,
    floor: "32",
    building: "A",
    imageUrls: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
    ],
    rentalRateNum: null,
    sellPriceNum: 4500000,
    latitude: 13.7563,
    longitude: 100.5018,
    address: "Sukhumvit Road",
    district: "Watthana",
    province: "Bangkok",
    status: "available",
    featured: true,
    views: 1250,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: "The Skyline Residence",
      projectNameTh: "The Skyline Residence",
    },
  },
  "project-2": {
    id: "project-2",
    agentPropertyCode: "GVV-001",
    propertyType: "SingleHouse",
    listingType: "sale",
    propertyTitleEn: "Garden Valley Villas - 4BR Family Home",
    propertyTitleTh: "Garden Valley Villas - บ้านครอบครัว 4 ห้องนอน",
    descriptionEn:
      "Discover your dream family home at Garden Valley Villas. This spacious 4-bedroom villa offers generous living spaces, a private garden, modern kitchen, and resort-style amenities. Perfect for families seeking tranquility while staying connected to city conveniences.",
    descriptionTh:
      "ค้นพบบ้านในฝันสำหรับครอบครัวของคุณที่ Garden Valley Villas วิลล่า 4 ห้องนอนกว้างขวางนี้มีพื้นที่ใช้สอยกว้างขวาง สวนส่วนตัว ครัวทันสมัย และสิ่งอำนวยความสะดวกสไตล์รีสอร์ท เหมาะสำหรับครอบครัวที่ต้องการความสงบแต่ยังคงใกล้ความสะดวกในเมือง",
    bedRoomNum: 4,
    bathRoomNum: 3,
    roomSizeNum: null,
    usableAreaSqm: 280,
    landSizeSqw: 100,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    ],
    rentalRateNum: null,
    sellPriceNum: 8900000,
    latitude: 12.9236,
    longitude: 100.8825,
    address: "Pattaya-Naklua Road",
    district: "Bang Lamung",
    province: "Chonburi",
    status: "available",
    featured: true,
    views: 890,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: "Garden Valley Villas",
      projectNameTh: "Garden Valley Villas",
    },
  },
  "project-3": {
    id: "project-3",
    agentPropertyCode: "MPT-001",
    propertyType: "Condo",
    listingType: "sale",
    propertyTitleEn: "Metro Park Tower - Modern Studio",
    propertyTitleTh: "Metro Park Tower - สตูดิโอทันสมัย",
    descriptionEn:
      "Smart investment opportunity at Metro Park Tower. This well-designed studio unit maximizes space with modern built-in furniture, excellent connectivity to MRT, and premium facilities. Ideal for young professionals or investors.",
    descriptionTh:
      "โอกาสการลงทุนที่คุ้มค่าที่ Metro Park Tower ห้องสตูดิโอออกแบบอย่างชาญฉลาดพร้อมเฟอร์นิเจอร์บิลท์อินทันสมัย เชื่อมต่อ MRT สะดวก และสิ่งอำนวยความสะดวกครบครัน เหมาะสำหรับมืออาชีพรุ่นใหม่หรือนักลงทุน",
    bedRoomNum: 0,
    bathRoomNum: 1,
    roomSizeNum: 28,
    usableAreaSqm: 28,
    landSizeSqw: null,
    floor: "15",
    building: "B",
    imageUrls: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
    ],
    rentalRateNum: 12000,
    sellPriceNum: 3200000,
    latitude: 13.7649,
    longitude: 100.5679,
    address: "Ratchadaphisek Road",
    district: "Din Daeng",
    province: "Bangkok",
    status: "available",
    featured: false,
    views: 650,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: "Metro Park Tower",
      projectNameTh: "Metro Park Tower",
    },
  },
  "project-4": {
    id: "project-4",
    agentPropertyCode: "RVS-001",
    propertyType: "Condo",
    listingType: "sale",
    propertyTitleEn: "Riverside Serenity - Premium 3BR Riverfront",
    propertyTitleTh: "Riverside Serenity - ริมแม่น้ำ 3 ห้องนอน พรีเมียม",
    descriptionEn:
      "Unparalleled riverside living at Riverside Serenity. This premium 3-bedroom unit offers breathtaking Chao Phraya River views, luxurious finishes, private boat pier access, and exclusive amenities. Experience the pinnacle of Bangkok waterfront living.",
    descriptionTh:
      "การอยู่อาศัยริมแม่น้ำที่ไร้ที่เปรียบที่ Riverside Serenity ห้องชุด 3 ห้องนอนระดับพรีเมียมนี้มีวิวแม่น้ำเจ้าพระยาที่งดงาม การตกแต่งหรูหรา ท่าเรือส่วนตัว และสิ่งอำนวยความสะดวกพิเศษ สัมผัสประสบการณ์การอยู่อาศัยริมน้ำที่ดีที่สุดของกรุงเทพฯ",
    bedRoomNum: 3,
    bathRoomNum: 3,
    roomSizeNum: 145,
    usableAreaSqm: 145,
    landSizeSqw: null,
    floor: "25",
    building: "A",
    imageUrls: [
      "https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
    ],
    rentalRateNum: null,
    sellPriceNum: 12500000,
    latitude: 13.7235,
    longitude: 100.4983,
    address: "Charoen Nakhon Road",
    district: "Khlong San",
    province: "Bangkok",
    status: "available",
    featured: true,
    views: 1580,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: "Riverside Serenity",
      projectNameTh: "Riverside Serenity",
    },
  },
  "project-5": {
    id: "project-5",
    agentPropertyCode: "HER-001",
    propertyType: "SingleHouse",
    listingType: "sale",
    propertyTitleEn: "The Heritage Estate - Grand 5BR Mansion",
    propertyTitleTh: "The Heritage Estate - คฤหาสน์ 5 ห้องนอน",
    descriptionEn:
      "Majestic living at The Heritage Estate. This grand 5-bedroom mansion combines timeless elegance with modern comfort. Features include a private pool, landscaped gardens, home theater, wine cellar, and smart home technology throughout.",
    descriptionTh:
      "การอยู่อาศัยอันยิ่งใหญ่ที่ The Heritage Estate คฤหาสน์ 5 ห้องนอนอันโอ่อ่านี้ผสมผสานความสง่างามคลาสสิกเข้ากับความสะดวกสบายทันสมัย มีสระว่ายน้ำส่วนตัว สวนจัดแต่ง โรงภาพยนตร์ในบ้าน ห้องเก็บไวน์ และเทคโนโลยี Smart Home ทั่วทั้งบ้าน",
    bedRoomNum: 5,
    bathRoomNum: 5,
    roomSizeNum: null,
    usableAreaSqm: 450,
    landSizeSqw: 200,
    floor: null,
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
    ],
    rentalRateNum: null,
    sellPriceNum: 15000000,
    latitude: 13.759,
    longitude: 100.5671,
    address: "Rama 9 Road",
    district: "Huai Khwang",
    province: "Bangkok",
    status: "available",
    featured: true,
    views: 2100,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: "The Heritage Estate",
      projectNameTh: "The Heritage Estate",
    },
  },
  "project-6": {
    id: "project-6",
    agentPropertyCode: "ULC-001",
    propertyType: "Condo",
    listingType: "sale",
    propertyTitleEn: "Urban Loft Collection - Designer 1BR Loft",
    propertyTitleTh: "Urban Loft Collection - ลอฟท์ดีไซน์ 1 ห้องนอน",
    descriptionEn:
      "Trendy living at Urban Loft Collection. This designer 1-bedroom loft features double-height ceilings, industrial-chic finishes, and is located in the heart of Thonglor. Perfect for creative professionals who appreciate unique urban spaces.",
    descriptionTh:
      "การอยู่อาศัยทันสมัยที่ Urban Loft Collection ลอฟท์ 1 ห้องนอนดีไซน์เก๋นี้มีเพดานสูงสองชั้น การตกแต่งสไตล์ Industrial Chic และตั้งอยู่ใจกลางทองหล่อ เหมาะสำหรับมืออาชีพที่ชื่นชอบพื้นที่เมืองที่มีเอกลักษณ์",
    bedRoomNum: 1,
    bathRoomNum: 2,
    roomSizeNum: 65,
    usableAreaSqm: 65,
    landSizeSqw: null,
    floor: "8",
    building: null,
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
    ],
    rentalRateNum: 35000,
    sellPriceNum: 6800000,
    latitude: 13.733,
    longitude: 100.5847,
    address: "Thonglor Soi 10",
    district: "Watthana",
    province: "Bangkok",
    status: "available",
    featured: true,
    views: 980,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: "Urban Loft Collection",
      projectNameTh: "Urban Loft Collection",
    },
  },
};

// Generate fallback mock property for any ID
const generateFallbackProperty = (id: string): Property => {
  const propertyTypes = ["Condo", "SingleHouse", "Townhouse"];
  const locations = [
    { address: "Sukhumvit Road", district: "Watthana", province: "Bangkok" },
    { address: "Rama 9 Road", district: "Huai Khwang", province: "Bangkok" },
    { address: "Thonglor Soi 10", district: "Watthana", province: "Bangkok" },
    {
      address: "Ratchadaphisek Road",
      district: "Din Daeng",
      province: "Bangkok",
    },
    { address: "Silom Road", district: "Bang Rak", province: "Bangkok" },
  ];

  // Use ID to generate consistent but varied data
  const idNum = parseInt(id.replace(/\D/g, "")) || 1;
  const propertyType = propertyTypes[idNum % propertyTypes.length];
  const location = locations[idNum % locations.length];
  const bedrooms = (idNum % 4) + 1;
  const bathrooms = Math.max(1, bedrooms - 1);
  const size =
    propertyType === "Condo" ? 30 + (idNum % 100) : 150 + (idNum % 200);
  const price =
    propertyType === "Condo"
      ? 2000000 + (idNum % 10) * 500000
      : 5000000 + (idNum % 10) * 1000000;

  return {
    id,
    agentPropertyCode: id.toUpperCase(),
    propertyType,
    listingType: idNum % 3 === 0 ? "rent" : "sale",
    propertyTitleEn: `Premium ${propertyType} Unit - ${bedrooms}BR`,
    propertyTitleTh: `${
      propertyType === "Condo"
        ? "คอนโด"
        : propertyType === "SingleHouse"
        ? "บ้านเดี่ยว"
        : "ทาวน์เฮ้าส์"
    }หรู ${bedrooms} ห้องนอน`,
    descriptionEn: `Beautiful ${bedrooms}-bedroom ${propertyType.toLowerCase()} in prime location. Features modern design, quality finishes, and excellent amenities. Perfect for comfortable living with easy access to transportation and shopping.`,
    descriptionTh: `${
      propertyType === "Condo"
        ? "คอนโดมิเนียม"
        : propertyType === "SingleHouse"
        ? "บ้านเดี่ยว"
        : "ทาวน์เฮ้าส์"
    }สวยงาม ${bedrooms} ห้องนอน ในทำเลดีเยี่ยม ออกแบบทันสมัย วัสดุคุณภาพ สิ่งอำนวยความสะดวกครบครัน เหมาะสำหรับการอยู่อาศัยอย่างสะดวกสบาย`,
    bedRoomNum: bedrooms,
    bathRoomNum: bathrooms,
    roomSizeNum: propertyType === "Condo" ? size : null,
    usableAreaSqm: size,
    landSizeSqw: propertyType !== "Condo" ? 50 + (idNum % 100) : null,
    floor: propertyType === "Condo" ? String((idNum % 30) + 1) : null,
    building:
      propertyType === "Condo" ? String.fromCharCode(65 + (idNum % 3)) : null,
    imageUrls: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80",
    ],
    rentalRateNum: idNum % 3 === 0 ? 15000 + (idNum % 10) * 5000 : null,
    sellPriceNum: idNum % 3 !== 0 ? price : null,
    latitude: 13.7563 + (idNum % 10) * 0.01,
    longitude: 100.5018 + (idNum % 10) * 0.01,
    ...location,
    status: "available",
    featured: idNum % 2 === 0,
    views: 100 + idNum * 50,
    createdAt: "2024-12-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    project: {
      projectNameEn: `Premium Residence ${idNum}`,
      projectNameTh: `พรีเมียม เรสซิเดนซ์ ${idNum}`,
    },
  };
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  // Helper functions for language-based field selection
  const useEnglish = locale === "en" || locale === "zh";
  const getProjectName = (project: { projectNameTh?: string; projectNameEn?: string } | null | undefined) => {
    if (!project) return "";
    return useEnglish
      ? (project.projectNameEn || project.projectNameTh || "")
      : (project.projectNameTh || project.projectNameEn || "");
  };
  const getPropertyTitle = (property: { propertyTitleTh?: string; propertyTitleEn?: string } | null | undefined) => {
    if (!property) return "";
    return useEnglish
      ? (property.propertyTitleEn || property.propertyTitleTh || "")
      : (property.propertyTitleTh || property.propertyTitleEn || "");
  };

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [recommendedProperties, setRecommendedProperties] = useState<
    Property[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showLineQR, setShowLineQR] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState<{
    count: number;
    avgRating: number;
  }>({ count: 0, avgRating: 0 });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      setFormError(t("propertyDetail.fillRequired"));
      return;
    }

    setFormSubmitting(true);
    setFormError("");

    // Simulate API call with delay
    setTimeout(() => {
      setFormSuccess(true);
      setContactForm({ name: "", phone: "", message: "" });
      setFormSubmitting(false);
      // Reset success message after 5 seconds
      setTimeout(() => setFormSuccess(false), 5000);
    }, 500);
  };

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard navigation in lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen || !property) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev === property.imageUrls.length - 1 ? 0 : prev + 1
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev === 0 ? property.imageUrls.length - 1 : prev - 1
        );
      }
    },
    [lightboxOpen, property]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const propertyId = params.id as string;

        // Fetch property from NainaHub API
        const response = await fetch(`/api/nainahub/property/${propertyId}`);
        if (!response.ok) {
          throw new Error("Property not found");
        }
        const propertyData = await response.json();
        setProperty(propertyData);

        // Fetch recommended properties
        const recommendedResponse = await fetch(`/api/nainahub/properties?limit=4`);
        if (recommendedResponse.ok) {
          const recommendedData = await recommendedResponse.json();
          setRecommendedProperties(recommendedData.data.filter((p: any) => p.id !== propertyId).slice(0, 4));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading property:", error);
        setLoading(false);
      }
    };

    if (params.id) {
      loadProperty();
    }
  }, [params.id]);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getSize = () => {
    if (!property) return "-";
    if (property.propertyType === "Condo") {
      return property.roomSizeNum ? `${property.roomSizeNum}` : "-";
    }
    return property.usableAreaSqm ? `${property.usableAreaSqm}` : "-";
  };

  const nextImage = () => {
    if (property && property.imageUrls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === property.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.imageUrls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case "Condo":
        return t("search.condo");
      case "Townhouse":
        return t("search.townhouse");
      case "SingleHouse":
        return t("search.singleHouse");
      case "Land":
        return t("search.land");
      default:
        return type;
    }
  };

  const getListingTypeLabel = (type: string) => {
    switch (type) {
      case "rent":
        return t("property.forRent");
      case "sale":
        return t("property.forSale");
      case "both":
        return `${t("property.forSale")}/${t("property.forRent")}`;
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Skeleton */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#152238] shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="h-8 w-40 bg-[#1B2D44] rounded animate-pulse" />
          </div>
        </nav>

        {/* Content Skeleton */}
        <div className="pt-20 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-[#152238] rounded-2xl animate-pulse" />
              <div className="mt-6 space-y-4">
                <div className="h-8 bg-[#152238] rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-[#152238] rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="h-80 bg-[#152238] rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("propertyDetail.notFound")}
          </h2>
          <p className="text-gray-500 mb-6">
            {t("propertyDetail.notFoundDesc")}
          </p>
          <Link href="/">
            <Button className="bg-[#C9A227] hover:bg-[#A88B1F] text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("propertyDetail.backHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data for SEO */}
      <PropertyJsonLd property={property} />

      {/* Shared Header */}
      <Header />

      {/* Action Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#C9A227] transition-colors pt-6 pb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("propertyDetail.back")}</span>
          </button>

          <div className="flex items-center gap-3 pt-6 pb-4">
            <ShareButton title={getPropertyTitle(property) || "ทรัพย์สิน"} />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && property?.imageUrls && (
        <div className="fixed inset-0 z-[100] bg-black">
          {/* Close Button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
              {lightboxIndex + 1} / {property.imageUrls.length}
            </div>
          </div>

          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-16">
            <div className="relative w-full h-full">
              <Image
                src={property.imageUrls[lightboxIndex]}
                alt={property.propertyTitleEn || "Property"}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          {property.imageUrls.length > 1 && (
            <>
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === 0 ? property.imageUrls.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white group"
              >
                <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === property.imageUrls.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all text-white group"
              >
                <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex justify-center gap-2 overflow-x-auto pb-2">
              {property.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                    lightboxIndex === index
                      ? "ring-2 ring-white scale-105"
                      : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-32">
        {/* Premium Image Gallery - Bento Grid Layout */}
        <div className="container mx-auto px-4 py-6">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <div className="relative">
              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 rounded-2xl overflow-hidden">
                {/* Main Large Image */}
                <div
                  className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto md:h-[500px] cursor-pointer group"
                  onClick={() => openLightbox(0)}
                >
                  <Image
                    src={property.imageUrls[0]}
                    alt={property.propertyTitleEn || "Property"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Premium Badge */}
                  {property.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-[#C9A227] to-[#d4c07a] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4 fill-white" />
                        Premium
                      </span>
                    </div>
                  )}
                </div>

                {/* Secondary Images */}
                {property.imageUrls.slice(1, 5).map((url, index) => (
                  <div
                    key={index}
                    className={`relative aspect-[4/3] md:aspect-auto md:h-[245px] cursor-pointer group ${
                      index >= 2 ? "hidden md:block" : ""
                    }`}
                    onClick={() => openLightbox(index + 1)}
                  >
                    <Image
                      src={url}
                      alt={`Property image ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Show more overlay on last visible image */}
                    {index === 3 && property.imageUrls.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Images className="w-8 h-8 mx-auto mb-2" />
                          <span className="text-lg font-semibold">
                            +{property.imageUrls.length - 5}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* View All Photos Button */}
              <button
                onClick={() => openLightbox(0)}
                className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold shadow-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
              >
                <Images className="w-5 h-5" />
                ({property.imageUrls.length})
              </button>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-[#152238] to-[#1B2D44] rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Home className="w-20 h-20 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">{t("common.noResults")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Location */}
              <div
                className={`transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span className="bg-[#C9A227] text-white px-2 py-1 rounded-full">
                    {getPropertyTypeLabel(property.propertyType)}
                  </span>
                  <span>|</span>
                  <span>{t("common.code")}: {property.agentPropertyCode}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {getPropertyTitle(property)}
                </h1>
                {property.project && (
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building2 className="w-5 h-5 mr-2 text-[#C9A227]" />
                    {getProjectName(property.project)}
                  </div>
                )}
                {/* <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-[#C9A227]" />
                  {[property.address, property.district, property.province]
                    .filter(Boolean)
                    .join(", ")}
                </div> */}
              </div>

              {/* Price */}
              <Card
                className={`p-6 shadow-lg bg-white border border-gray-200 bg-gradient-to-r from-[#C9A227]/10 to-transparent transition-all duration-700 delay-100 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex flex-wrap gap-6">
                  {property.rentalRateNum && property.rentalRateNum > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {t("propertyDetail.rentPerMonth")}
                      </div>
                      <div className="text-3xl font-bold text-[#C9A227]">
                        ฿ {formatPrice(property.rentalRateNum)}
                      </div>
                    </div>
                  )}
                  {property.sellPriceNum && property.sellPriceNum > 0 && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{t("propertyDetail.salePrice")}</div>
                      <div className="text-3xl font-bold text-[#C9A227]">
                        ฿ {formatPrice(property.sellPriceNum)}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Features Grid */}
              <Card
                className={`p-6 shadow-lg bg-white border border-gray-200 transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {t("propertyDetail.propertyDetails")}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                      <Bed className="w-6 h-6 text-[#C9A227]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {property.bedRoomNum}
                      </div>
                      <div className="text-sm text-gray-500">{t("property.bedrooms")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                      <Bath className="w-6 h-6 text-[#C9A227]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {property.bathRoomNum}
                      </div>
                      <div className="text-sm text-gray-500">{t("property.bathrooms")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                      <Maximize className="w-6 h-6 text-[#C9A227]" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {getSize()}
                      </div>
                      <div className="text-sm text-gray-500">{t("common.sqm")}</div>
                    </div>
                  </div>
                  {property.landSizeSqw != null && property.landSizeSqw > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                        <Home className="w-6 h-6 text-[#C9A227]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {property.landSizeSqw}
                        </div>
                        <div className="text-sm text-gray-500">sqw</div>
                      </div>
                    </div>
                  )}
                  {property.floor && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                        <Layers className="w-6 h-6 text-[#C9A227]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {property.floor}
                        </div>
                        <div className="text-sm text-gray-500">{t("property.floor")}</div>
                      </div>
                    </div>
                  )}
                  {property.building && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                        <Building2 className="w-6 h-6 text-[#C9A227]" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {property.building}
                        </div>
                        <div className="text-sm text-gray-500">{t("property.building")}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Description */}
              {(property.descriptionTh || property.descriptionEn) && (
                <Card
                  className={`p-6 shadow-lg bg-white border border-gray-200 transition-all duration-700 delay-300 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {t("propertyDetail.moreDetails")}
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.descriptionTh || property.descriptionEn}
                  </p>
                </Card>
              )}

              {/* Amenities - Only show if property has amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card
                  className={`p-6 shadow-lg bg-white border border-gray-200 transition-all duration-700 delay-[400ms] ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {t("propertyDetail.amenities")}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A227]" />
                        <span className="text-gray-600">
                          {getAmenityLabelByLocale(amenity, locale)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Location Map */}
              {property.latitude && property.longitude && (
                <Card
                  className={`p-6 shadow-lg bg-white border border-gray-200 transition-all duration-700 delay-[500ms] ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#C9A227]" />
                    {t("propertyDetail.location")}
                  </h2>
                  <div className="rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1938.5!2d${property.longitude}!3d${property.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${property.latitude}!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth`}
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {/* <span className="font-medium">ที่อยู่: </span> */}
                      {[property.address, property.district, property.province]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#C9A227] hover:text-[#A88B1F] font-medium flex items-center gap-1"
                    >
                      <MapPin className="w-4 h-4" />
                      เปิดใน Google Maps
                    </a>
                  </div>
                </Card>
              )}

              {/* Updated Date */}
              {property.updatedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>
                    อัปเดต{" "}
                    {new Date(property.updatedAt).toLocaleDateString("th-TH")}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div
                className={`sticky top-24 transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8"
                }`}
              >
                <Card className="p-6 shadow-xl bg-white border border-gray-200 hover:shadow-2xl transition-shadow duration-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {t("propertyDetail.interested")}
                  </h3>

                  {/* Agent Info */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 bg-[#C9A227] rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-900">PW</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Sky Pro Property
                      </div>
                      <div className="text-sm text-gray-500">
                        {t("propertyDetail.agent")}
                      </div>
                      {reviewStats.count > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {reviewStats.avgRating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({reviewStats.count} {t("propertyDetail.reviews")})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {/* Phone Button */}
                    <Button
                      onClick={() => copyToClipboard("0655558989", "phone")}
                      className="w-full bg-[#C9A227] hover:bg-[#A88B1F] text-white py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      {copiedText === "phone" ? "คัดลอกแล้ว!" : "065-555-8989"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white py-6 text-base font-semibold rounded-xl transition-all"
                      onClick={() => setShowLineQR(true)}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Line
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 py-6 text-base font-medium rounded-xl transition-all"
                      onClick={() =>
                        copyToClipboard(
                          "skyproofficial88@gmail.com",
                          "email"
                        )
                      }
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      {copiedText === "email" ? t("propertyDetail.copied") : t("propertyDetail.copyEmail")}
                    </Button>
                  </div>

                  {/* Line QR Modal */}
                  {showLineQR && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="bg-[#1B2D44] rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-white">
                            {t("propertyDetail.addLineFriend")}
                          </h3>
                          <button
                            onClick={() => setShowLineQR(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-300" />
                          </button>
                        </div>
                        <div className="bg-white rounded-xl p-4 flex justify-center">
                          <Image
                            src="/skyproqrcode.png"
                            alt="Line QR Code"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        </div>
                        <p className="text-center text-sm text-gray-300 mt-4">
                          {t("propertyDetail.scanQR")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quick Contact Form */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      {t("propertyDetail.requestInfo")}
                    </h4>

                    {formSuccess ? (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                        <div className="text-green-400 font-semibold mb-1">
                          {t("propertyDetail.sentSuccess")}
                        </div>
                        <p className="text-sm text-green-400/80">
                          {t("propertyDetail.willContact")}
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleContactSubmit}
                        className="space-y-3"
                      >
                        <input
                          type="text"
                          placeholder={t("propertyDetail.namePlaceholder")}
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] transition-all text-gray-900 placeholder:text-gray-500"
                          disabled={formSubmitting}
                        />
                        <input
                          type="tel"
                          placeholder={t("propertyDetail.phonePlaceholder")}
                          value={contactForm.phone}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] transition-all text-gray-900 placeholder:text-gray-500"
                          disabled={formSubmitting}
                        />
                        <textarea
                          placeholder={t("propertyDetail.messagePlaceholder")}
                          rows={3}
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              message: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] transition-all resize-none text-gray-900 placeholder:text-gray-500"
                          disabled={formSubmitting}
                        />

                        {formError && (
                          <p className="text-sm text-red-600">{formError}</p>
                        )}

                        <Button
                          type="submit"
                          className="w-full bg-[#C9A227] hover:bg-[#A88B1F] text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={formSubmitting}
                        >
                          {formSubmitting ? t("propertyDetail.sending") : t("propertyDetail.sendInfo")}
                        </Button>
                      </form>
                    )}

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      เราจะติดต่อกลับภายใน 24 ชั่วโมง
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Properties Section */}
        {recommendedProperties.length > 0 && (
          <section className="bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {t("propertyDetail.recommended")}
                </h2>
                <div className="w-16 h-1 bg-[#C9A227] mx-auto mb-3"></div>
                <p className="text-gray-600">
                  {t("searchPage.subtitle")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProperties.map((rec, index) => (
                  <Link
                    key={rec.id}
                    href={`/property/${rec.id}`}
                    className={`group block transition-all duration-700 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        {rec.imageUrls && rec.imageUrls.length > 0 ? (
                          <Image
                            src={rec.imageUrls[0]}
                            alt={rec.propertyTitleEn || "Property"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Home className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-1">
                          {rec.rentalRateNum != null &&
                            rec.rentalRateNum > 0 && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500">
                                {t("property.forRent")}
                              </span>
                            )}
                          {rec.sellPriceNum != null && rec.sellPriceNum > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-amber-500">
                              {t("property.forSale")}
                            </span>
                          )}
                        </div>

                        {/* Property Type */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {rec.propertyType === "Condo"
                              ? t("search.condo")
                              : rec.propertyType === "Townhouse"
                              ? t("search.townhouse")
                              : rec.propertyType === "Land"
                              ? t("search.land")
                              : t("search.singleHouse")}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#C9A227] transition-colors duration-300">
                          {getPropertyTitle(rec)}
                        </h3>

                        {rec.project && (
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">
                              {getProjectName(rec.project)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-[#C9A227]" />
                            <span>{rec.bedRoomNum}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-[#C9A227]" />
                            <span>{rec.bathRoomNum}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Maximize className="w-4 h-4 text-[#C9A227]" />
                            <span>
                              {rec.propertyType === "Condo"
                                ? rec.roomSizeNum || "-"
                                : rec.usableAreaSqm || "-"}{" "}
                              {t("common.sqm")}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          {rec.rentalRateNum != null &&
                            rec.rentalRateNum > 0 && (
                              <div className="text-lg font-bold text-[#C9A227]">
                                <span className="text-xs font-normal text-gray-500 mr-1">
                                  {t("property.forRent")}:
                                </span>
                                ฿{formatPrice(rec.rentalRateNum)}
                                <span className="text-xs font-normal text-gray-500">
                                  {t("property.perMonth")}
                                </span>
                              </div>
                            )}
                          {rec.sellPriceNum != null && rec.sellPriceNum > 0 && (
                            <div
                              className={`text-lg font-bold text-[#C9A227] ${
                                rec.rentalRateNum != null &&
                                rec.rentalRateNum > 0
                                  ? "text-sm mt-1"
                                  : ""
                              }`}
                            >
                              <span className="text-xs font-normal text-gray-500 mr-1">
                                {t("property.forSale")}:
                              </span>
                              ฿{formatPrice(rec.sellPriceNum)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-10">
                <Link href="/search">
                  <Button
                    variant="outline"
                    className="border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  >
                    {t("common.viewAll")}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
