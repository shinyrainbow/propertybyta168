"use client";

import { useEffect, useState } from "react";
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
  Search,
  Eye,
  Bed,
  Bath,
  Maximize,
  Percent,
  CheckCircle,
  XCircle,
  Flame,
  Sparkles,
  Award,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
  imageUrls: string[];
  rentalRateNum: number;
  sellPriceNum: number;
  project: NainaHubProject;
  status: PropertyStatus;
  extension: PropertyExtension | null;
}

const PROMOTION_TYPES = [
  { value: "hot", label: "HOT", color: "bg-red-500", icon: Flame },
  { value: "new", label: "NEW", color: "bg-green-500", icon: Sparkles },
  { value: "discount", label: "DISCOUNT", color: "bg-blue-500", icon: Percent },
  { value: "featured", label: "FEATURED", color: "bg-purple-500", icon: Award },
];

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [extensionFilter, setExtensionFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  // Modal states
  const [showPromotionModal, setShowPromotionModal] = useState<Property | null>(null);
  const [promotionForm, setPromotionForm] = useState({
    label: "",
    type: "hot" as "hot" | "new" | "discount" | "featured",
    startDate: "",
    endDate: "",
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(typeFilter && typeFilter !== "all" && { propertyType: typeFilter }),
      });

      const res = await fetch(`/api/nainahub/properties?${params}`);
      const data = await res.json();

      if (data.success) {
        let filteredData = data.data;

        // Client-side search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredData = filteredData.filter(
            (p: Property) =>
              p.propertyTitleTh?.toLowerCase().includes(searchLower) ||
              p.propertyTitleEn?.toLowerCase().includes(searchLower) ||
              p.agentPropertyCode?.toLowerCase().includes(searchLower) ||
              p.project?.projectNameTh?.toLowerCase().includes(searchLower) ||
              p.project?.projectNameEn?.toLowerCase().includes(searchLower)
          );
        }

        // Extension filter
        if (extensionFilter && extensionFilter !== "all") {
          filteredData = filteredData.filter((p: Property) => {
            switch (extensionFilter) {
              case "popular":
                return p.extension?.isFeaturedPopular;
              case "has_promotions":
                return p.extension?.promotions && p.extension.promotions.length > 0;
              case "closed_deal":
                return p.status === "sold" || p.status === "rented";
              case "hidden":
                return p.extension?.isHidden;
              default:
                return true;
            }
          });
        }

        setProperties(filteredData);
        setTotal(data.pagination?.total || filteredData.length);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, typeFilter, extensionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProperties();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const togglePopular = async (propertyId: string, currentValue: boolean) => {
    setUpdating(propertyId);
    try {
      const res = await fetch(`/api/admin/extensions/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeaturedPopular: !currentValue }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? { ...p, extension: data.data || { ...p.extension, isFeaturedPopular: !currentValue } }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle popular:", error);
    } finally {
      setUpdating(null);
    }
  };

  const toggleHidden = async (propertyId: string, currentValue: boolean) => {
    setUpdating(propertyId);
    try {
      const res = await fetch(`/api/admin/extensions/${propertyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !currentValue }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? { ...p, extension: data.data || { ...p.extension, isHidden: !currentValue } }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle hidden:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleAddPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPromotionModal || !promotionForm.label || !promotionForm.type) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/extensions/${showPromotionModal.id}/promotions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: promotionForm.label,
          type: promotionForm.type,
          startDate: promotionForm.startDate || null,
          endDate: promotionForm.endDate || null,
          isActive: promotionForm.isActive,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === showPromotionModal.id
              ? { ...p, extension: data.data }
              : p
          )
        );
        setShowPromotionModal(null);
        setPromotionForm({ label: "", type: "hot", startDate: "", endDate: "", isActive: true });
      } else {
        const data = await res.json();
        toast.error(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Failed to add promotion:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePromotion = async (propertyId: string, promotionId: string) => {
    setUpdating(propertyId);
    try {
      const res = await fetch(`/api/admin/extensions/${propertyId}/promotions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotionId }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state instead of refetching
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId
              ? { ...p, extension: data.data }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to remove promotion:", error);
    } finally {
      setUpdating(null);
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
      Villa: "วิลล่า",
      Land: "ที่ดิน",
      Office: "สำนักงาน",
      Store: "ร้านค้า",
      Factory: "โรงงาน",
      Hotel: "โรงแรม",
      Building: "อาคาร",
    };
    return labels[type] || type;
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายการทรัพย์สิน</h1>
          <p className="text-gray-600 mt-1">
            จัดการทรัพย์สินจาก NainaHub - กำหนด Popular
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            ทรัพย์ทั้งหมด
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ชื่อโครงการ ทำเล.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="ประเภททั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ประเภททั้งหมด</SelectItem>
                <SelectItem value="Condo">คอนโด</SelectItem>
                <SelectItem value="Townhouse">ทาวน์เฮ้าส์</SelectItem>
                <SelectItem value="SingleHouse">บ้านเดี่ยว</SelectItem>
                <SelectItem value="Villa">วิลล่า</SelectItem>
                <SelectItem value="Land">ที่ดิน</SelectItem>
                <SelectItem value="Office">สำนักงาน</SelectItem>
                <SelectItem value="Store">ร้านค้า</SelectItem>
                <SelectItem value="Factory">โรงงาน</SelectItem>
                <SelectItem value="Hotel">โรงแรม</SelectItem>
                <SelectItem value="Building">อาคาร</SelectItem>
                <SelectItem value="Apartment">อพาร์ทเมนต์</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={extensionFilter} onValueChange={setExtensionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะพิเศษ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="popular">
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Popular
                  </span>
                </SelectItem>
                <SelectItem value="closed_deal">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Closed Deals
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          แสดง {properties.length} จาก {total} รายการ
        </p>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-gray-200" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ไม่พบทรัพย์สิน
          </h3>
          <p className="text-gray-600 mb-4">ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <Card
              key={property.id}
              className={`p-4 hover:shadow-lg transition-shadow ${
                property.extension?.isHidden ? "opacity-50" : ""
              } ${property.status === "sold" || property.status === "rented" ? "border-green-300 bg-green-50/30" : ""}`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Image */}
                <div className="relative w-full lg:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <Image
                      src={property.imageUrls[0]}
                      alt={property.propertyTitleTh}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {property.extension?.isFeaturedPopular && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Popular
                      </span>
                    )}
                    {(property.status === "sold" || property.status === "rented") && (
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {property.status === "sold" ? "ขายแล้ว" : "ปล่อยเช่าแล้ว"}
                      </span>
                    )}
                    {property.extension?.promotions && property.extension.promotions.length > 0 && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {property.extension.promotions.length} Promo
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">
                          {property.agentPropertyCode || property.id.slice(0, 8)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getPropertyTypeLabel(property.propertyType)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {property.propertyTitleTh || property.propertyTitleEn}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {property.project?.projectNameTh || property.project?.projectNameEn || "ไม่ระบุโครงการ"}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedRoomNum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathRoomNum}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="w-4 h-4" />
                      <span>
                        {property.roomSizeNum || property.usableAreaSqm || "-"} ตร.ม.
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-2">
                    {property.rentalRateNum > 0 && (
                      <span className="text-lg font-bold text-[#C9A227]">
                        ฿{formatPrice(property.rentalRateNum)}
                        <span className="text-sm font-normal text-gray-500">/เดือน</span>
                      </span>
                    )}
                    {property.sellPriceNum > 0 && (
                      <span className={`text-lg font-bold text-[#C9A227] ${property.rentalRateNum ? "ml-4" : ""}`}>
                        ฿{formatPrice(property.sellPriceNum)}
                      </span>
                    )}
                  </div>

                  {/* Promotions list */}
                  {/* {property.extension?.promotions && property.extension.promotions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {property.extension.promotions.map((promo) => {
                        const typeInfo = PROMOTION_TYPES.find((t) => t.value === promo.type);
                        const Icon = typeInfo?.icon || Percent;
                        const bgColor = typeInfo?.value === "hot" ? "bg-red-100 text-red-700" :
                                       typeInfo?.value === "new" ? "bg-green-100 text-green-700" :
                                       typeInfo?.value === "discount" ? "bg-blue-100 text-blue-700" :
                                       typeInfo?.value === "featured" ? "bg-purple-100 text-purple-700" :
                                       "bg-red-100 text-red-700";
                        return (
                          <span
                            key={promo.id}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${bgColor}`}
                          >
                            <Icon className="w-3 h-3" />
                            {promo.label}
                            <button
                              onClick={() => handleRemovePromotion(property.id, promo.id)}
                              className="ml-1 hover:opacity-70"
                              disabled={updating === property.id}
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )} */}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 flex-shrink-0 flex-wrap">
                  {/* Toggle Popular */}
                  <Button
                    variant={property.extension?.isFeaturedPopular ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePopular(property.id, !!property.extension?.isFeaturedPopular)}
                    disabled={updating === property.id || property.status === "sold" || property.status === "rented"}
                    className={property.extension?.isFeaturedPopular ? "bg-orange-500 hover:bg-orange-600" : "text-gray-900"}
                  >
                    <Flame className="w-4 h-4 mr-1" />
                    Popular
                  </Button>


                  {/* View Property */}
                  <Link href={`/property/${property.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="w-full text-gray-900">
                      <Eye className="w-4 h-4 mr-1" />
                      ดู
                    </Button>
                  </Link>

                  {/* Toggle Hidden */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleHidden(property.id, !!property.extension?.isHidden)}
                    disabled={updating === property.id}
                    className={property.extension?.isHidden ? "text-gray-400" : ""}
                  >
                    {property.extension?.isHidden ? (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        แสดง
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-1" />
                        ซ่อน
                      </>
                    )}
                  </Button> */}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="text-gray-900"
          >
            ก่อนหน้า
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  size="sm"
                  variant={page === pageNum ? "default" : "outline"}
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? "bg-[#C9A227] hover:bg-[#A88B1F]" : "text-gray-900"}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="text-gray-900"
          >
            ถัดไป
          </Button>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                เพิ่มโปรโมชันใหม่
              </h2>
              <button
                onClick={() => {
                  setShowPromotionModal(null);
                  setPromotionForm({ label: "", type: "hot", startDate: "", endDate: "", isActive: true });
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPromotion} className="p-4 space-y-4">
              {/* Property Info (Read-only) */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500 mb-1">ทรัพย์สินที่เลือก</p>
                <p className="font-medium text-gray-900">
                  {showPromotionModal.propertyTitleTh || showPromotionModal.propertyTitleEn}
                </p>
                <p className="text-sm text-gray-500">
                  รหัส: {showPromotionModal.agentPropertyCode || showPromotionModal.id.slice(0, 8)}
                  {showPromotionModal.project && (
                    <span> • {showPromotionModal.project.projectNameTh || showPromotionModal.project.projectNameEn}</span>
                  )}
                </p>
              </div>

              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อโปรโมชัน *
                </label>
                <Input
                  value={promotionForm.label}
                  onChange={(e) =>
                    setPromotionForm((prev) => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="เช่น ลด 10%, ฟรีค่าโอน"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภท *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROMOTION_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setPromotionForm((prev) => ({
                            ...prev,
                            type: type.value as typeof promotionForm.type,
                          }))
                        }
                        className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                          promotionForm.type === type.value
                            ? "border-[#C9A227] bg-[#C9A227]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 ${type.color} rounded flex items-center justify-center`}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันเริ่มต้น
                  </label>
                  <Input
                    type="date"
                    value={promotionForm.startDate}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันสิ้นสุด
                  </label>
                  <Input
                    type="date"
                    value={promotionForm.endDate}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">
                  เปิดใช้งาน
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPromotionForm((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    promotionForm.isActive ? "bg-[#C9A227]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      promotionForm.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 text-gray-900"
                  onClick={() => {
                    setShowPromotionModal(null);
                    setPromotionForm({ label: "", type: "hot", startDate: "", endDate: "", isActive: true });
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#C9A227] hover:bg-[#A88B1F] text-white"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    "เพิ่มโปรโมชัน"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function Building2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
