"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Building,
  Flame,
  Percent,
  CheckCircle,
  XCircle,
  Plus,
  Save,
} from "lucide-react";
import Image from "next/image";
import {
  getMainPropertyTypes,
  getSubPropertyTypes,
  getMainPropertyType,
  getSubPropertyType,
  type MainPropertyType,
  type SubPropertyType,
} from "@/lib/propertyTypes";

interface Promotion {
  id: string;
  label: string;
  type: string;
  isActive: boolean;
}

interface PropertyTag {
  id: string;
  name: string;
  color: string | null;
}

interface PropertyExtension {
  id: string;
  externalPropertyId: string;
  priority: number;
  internalNotes: string | null;
  isHidden: boolean;
  isFeaturedPopular: boolean;
  mainPropertyType: string | null;
  subPropertyType: string | null;
  promotions: Promotion[];
  tags: PropertyTag[];
}

interface NainaHubProject {
  projectCode: string;
  projectNameEn: string;
  projectNameTh: string;
}

type PropertyStatus =
  | "pending"
  | "available"
  | "reserved"
  | "under_contract"
  | "sold"
  | "rented"
  | "under_maintenance"
  | "off_market";

interface Property {
  id: string;
  projectPropertyCode: string | null;
  agentPropertyCode: string | null;
  propertyType: "Condo" | "Townhouse" | "SingleHouse" | "Land";
  propertyTitleEn: string;
  propertyTitleTh: string;
  bedRoomNum: number;
  bathRoomNum: number;
  roomSizeNum: number;
  usableAreaSqm: number;
  landSizeSqw: number;
  floor: string;
  building: string;
  imageUrls: string[];
  rentalRateNum: number;
  sellPriceNum: number;
  status: PropertyStatus;
  project: NainaHubProject;
  extension: PropertyExtension | null;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Extension form state
  const [extensionForm, setExtensionForm] = useState({
    priority: 0,
    internalNotes: "",
    isFeaturedPopular: false,
    isHidden: false,
    mainPropertyType: "" as string,
    subPropertyType: "" as string,
  });

  // Promotion form state
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [promotionForm, setPromotionForm] = useState({ label: "", type: "discount" });


  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/nainahub/property/${id}`);
      const data = await res.json();

      if (data.success && data.data) {
        setProperty(data.data);
        // Initialize form with existing extension data
        if (data.data.extension) {
          // Auto-populate property types from NainaHub if not set
          const autoMain = getMainPropertyType(data.data.propertyType);
          const autoSub = getSubPropertyType(data.data.propertyType);

          setExtensionForm({
            priority: data.data.extension.priority || 0,
            internalNotes: data.data.extension.internalNotes || "",
            isFeaturedPopular: data.data.extension.isFeaturedPopular || false,
            isHidden: data.data.extension.isHidden || false,
            mainPropertyType: data.data.extension.mainPropertyType || autoMain || "",
            subPropertyType: data.data.extension.subPropertyType || autoSub || "",
          });
        } else {
          // No extension yet, auto-populate from NainaHub
          const autoMain = getMainPropertyType(data.data.propertyType);
          const autoSub = getSubPropertyType(data.data.propertyType);

          setExtensionForm({
            priority: 0,
            internalNotes: "",
            isFeaturedPopular: false,
            isHidden: false,
            mainPropertyType: autoMain || "",
            subPropertyType: autoSub || "",
          });
        }
      } else {
        setError("Property not found");
      }
    } catch (err) {
      setError("Failed to load property");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExtension = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/extensions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extensionForm),
      });

      if (res.ok) {
        fetchProperty();
      }
    } catch (error) {
      console.error("Failed to save extension:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPromotion = async () => {
    if (!promotionForm.label) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/extensions/${id}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promotionForm),
      });

      if (res.ok) {
        setShowPromotionForm(false);
        setPromotionForm({ label: "", type: "discount" });
        fetchProperty();
      }
    } catch (error) {
      console.error("Failed to add promotion:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePromotion = async (promotionId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/extensions/${id}/promotions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotionId }),
      });

      if (res.ok) {
        fetchProperty();
      }
    } catch (error) {
      console.error("Failed to remove promotion:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "-";
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      Condo: "คอนโด",
      Townhouse: "ทาวน์เฮ้าส์",
      SingleHouse: "บ้านเดี่ยว",
      Land: "ที่ดิน",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="h-12 w-64 animate-pulse bg-gray-200" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="h-64 animate-pulse bg-gray-200" />
            <Card className="h-48 animate-pulse bg-gray-200" />
          </div>
          <div className="space-y-6">
            <Card className="h-32 animate-pulse bg-gray-200" />
            <Card className="h-48 animate-pulse bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">{error || "Property not found"}</p>
        <Link href="/admin-dashboard/properties">
          <Button variant="outline">กลับไปรายการทรัพย์สิน</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin-dashboard/properties">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการทรัพย์สิน</h1>
          <p className="text-gray-600 mt-1">
            {property.agentPropertyCode || property.id.slice(0, 8)} - ข้อมูลจาก NainaHub (อ่านอย่างเดียว)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Info (Read-only) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">รูปภาพ</h2>
            {property.imageUrls && property.imageUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.imageUrls.slice(0, 6).map((url, index) => (
                  <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">ไม่มีรูปภาพ</p>
            )}
          </Card>

          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทรัพย์สิน</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ชื่อ (ไทย)</p>
                <p className="font-medium">{property.propertyTitleTh || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ชื่อ (อังกฤษ)</p>
                <p className="font-medium">{property.propertyTitleEn || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">ประเภท</p>
                <p className="font-medium">{getPropertyTypeLabel(property.propertyType)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">โครงการ</p>
                <p className="font-medium">
                  {property.project?.projectNameTh || property.project?.projectNameEn || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedRoomNum} ห้องนอน</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathRoomNum} ห้องน้ำ</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{property.roomSizeNum || property.usableAreaSqm || "-"} ตร.ม.</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">ราคา</p>
              <div className="flex gap-4 mt-1">
                {property.rentalRateNum > 0 && (
                  <span className="text-lg font-bold text-[#C9A227]">
                    ฿{formatPrice(property.rentalRateNum)}/เดือน
                  </span>
                )}
                {property.sellPriceNum > 0 && (
                  <span className="text-lg font-bold text-[#C9A227]">
                    ฿{formatPrice(property.sellPriceNum)}
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Promotions Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">โปรโมชั่น</h2>
              {property.status !== "sold" && property.status !== "rented" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPromotionForm(!showPromotionForm)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  เพิ่ม
                </Button>
              )}
            </div>

            {showPromotionForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <Input
                  value={promotionForm.label}
                  onChange={(e) => setPromotionForm({ ...promotionForm, label: e.target.value })}
                  placeholder="ข้อความโปรโมชั่น เช่น: ลด 10%"
                />
                <div className="flex gap-2">
                  <Select
                    value={promotionForm.type}
                    onValueChange={(v) => setPromotionForm({ ...promotionForm, type: v })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">ส่วนลด</SelectItem>
                      <SelectItem value="free">ฟรี</SelectItem>
                      <SelectItem value="special">พิเศษ</SelectItem>
                      <SelectItem value="limited">จำกัดเวลา</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddPromotion} disabled={saving || !promotionForm.label}>
                    เพิ่ม
                  </Button>
                  <Button variant="outline" onClick={() => setShowPromotionForm(false)}>
                    ยกเลิก
                  </Button>
                </div>
              </div>
            )}

            {property.extension?.promotions && property.extension.promotions.length > 0 ? (
              <div className="space-y-2">
                {property.extension.promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-red-700">{promo.label}</span>
                      <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded">
                        {promo.type}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleRemovePromotion(promo.id)}
                      disabled={saving}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">ไม่มีโปรโมชั่น</p>
            )}
          </Card>
        </div>

        {/* Extension Settings */}
        <div className="space-y-6">
          {/* Status Badges */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะพิเศษ</h2>

            {/* Popular Toggle */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>Popular</span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  extensionForm.isFeaturedPopular ? "bg-orange-500" : "bg-gray-200"
                }`}
                onClick={() =>
                  setExtensionForm({ ...extensionForm, isFeaturedPopular: !extensionForm.isFeaturedPopular })
                }
                disabled={property.status === "sold" || property.status === "rented"}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    extensionForm.isFeaturedPopular ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Hidden Toggle */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-gray-500" />
                <span>ซ่อนจากหน้าเว็บ</span>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  extensionForm.isHidden ? "bg-gray-500" : "bg-gray-200"
                }`}
                onClick={() => setExtensionForm({ ...extensionForm, isHidden: !extensionForm.isHidden })}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    extensionForm.isHidden ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Priority */}
            <div className="py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ลำดับความสำคัญ (สูง = แสดงก่อน)
              </label>
              <Input
                type="number"
                value={extensionForm.priority}
                onChange={(e) => setExtensionForm({ ...extensionForm, priority: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Main Property Type */}
            <div className="py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทหลัก (Main Type)
              </label>
              <Select
                value={extensionForm.mainPropertyType}
                onValueChange={(value) => {
                  setExtensionForm({
                    ...extensionForm,
                    mainPropertyType: value,
                    subPropertyType: "" // Reset sub type when main type changes
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทหลัก" />
                </SelectTrigger>
                <SelectContent>
                  {getMainPropertyTypes().map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "Living" ? "ที่อยู่อาศัย" : type === "Land" ? "ที่ดิน" : "พาณิชย์"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Property Type */}
            {extensionForm.mainPropertyType && (
              <div className="py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทย่อย (Sub Type)
                </label>
                <Select
                  value={extensionForm.subPropertyType}
                  onValueChange={(value) => setExtensionForm({ ...extensionForm, subPropertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกประเภทย่อย" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubPropertyTypes(extensionForm.mainPropertyType as MainPropertyType).map((subType) => (
                      <SelectItem key={subType} value={subType}>
                        {subType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Internal Notes */}
            <div className="py-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                บันทึกภายใน
              </label>
              <textarea
                value={extensionForm.internalNotes}
                onChange={(e) => setExtensionForm({ ...extensionForm, internalNotes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                placeholder="บันทึกสำหรับทีมงาน..."
              />
            </div>

            <Button
              className="w-full bg-[#C9A227] hover:bg-[#A88B1F] text-white mt-4"
              onClick={handleSaveExtension}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </Button>
          </Card>

          {/* Status from NainaHub */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะจาก NainaHub</h2>

            {property.status === "sold" || property.status === "rented" ? (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">
                    {property.status === "sold" ? "ขายแล้ว" : "ปล่อยเช่าแล้ว"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  สถานะนี้จัดการผ่าน NainaHub
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {property.status === "available" ? "พร้อมขาย/เช่า" :
                     property.status === "reserved" ? "จอง" :
                     property.status === "under_contract" ? "อยู่ระหว่างทำสัญญา" :
                     property.status === "pending" ? "รอดำเนินการ" :
                     property.status === "under_maintenance" ? "ปรับปรุง" :
                     property.status === "off_market" ? "ปิดการขาย" :
                     property.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  สถานะนี้จัดการผ่าน NainaHub
                </p>
              </div>
            )}
          </Card>

          {/* View on Website */}
          <Card className="p-6">
            <Link href={`/property/${property.id}`} target="_blank">
              <Button variant="outline" className="w-full">
                ดูบนเว็บไซต์
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
