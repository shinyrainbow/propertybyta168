"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Phone,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  FileText,
  X,
  Mail,
  MapPin,
  Trash2,
  Loader2,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

interface PropertyListing {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  listingType: string;
  propertyType: string;
  location: string | null;
  size: string | null;
  price: string | null;
  details: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "new", label: "ใหม่", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  { value: "contacted", label: "ติดต่อแล้ว", color: "bg-yellow-100 text-yellow-800", icon: Phone },
  { value: "in_progress", label: "กำลังดำเนินการ", color: "bg-purple-100 text-purple-800", icon: ArrowUpRight },
  { value: "completed", label: "เสร็จสิ้น", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "cancelled", label: "ยกเลิก", color: "bg-red-100 text-red-800", icon: X },
];

const propertyTypeLabels: Record<string, string> = {
  Condo: "คอนโดมิเนียม",
  Townhouse: "ทาวน์เฮ้าส์",
  SingleHouse: "บ้านเดี่ยว",
  Land: "ที่ดิน",
};

const listingTypeLabels: Record<string, string> = {
  sell: "ขาย",
  rent: "เช่า",
};

export default function PropertyListingsPage() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedListing, setSelectedListing] = useState<PropertyListing | null>(null);
  const [notes, setNotes] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { confirm } = useConfirmDialog();

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/property-listings");
      const data = await response.json();
      if (data.success) {
        setListings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      toast.error("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = filterStatus
    ? listings.filter((l) => l.status === filterStatus)
    : listings;

  const handleSaveListing = async () => {
    if (!selectedListing) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/admin/property-listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedListing.id, status: modalStatus, notes }),
      });

      if (response.ok) {
        setListings((prev) =>
          prev.map((l) =>
            l.id === selectedListing.id ? { ...l, status: modalStatus, notes } : l
          )
        );
        setSelectedListing(null);
        toast.success("บันทึกเรียบร้อยแล้ว");
      }
    } catch (error) {
      console.error("Failed to update listing:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/property-listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        setListings((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        toast.success("อัปเดตสถานะเรียบร้อยแล้ว");
      }
    } catch (error) {
      console.error("Failed to update listing:", error);
      toast.error("เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "ยืนยันการลบ",
      message: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?",
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
      variant: "danger",
    });
    if (!confirmed) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/admin/property-listings?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setListings((prev) => prev.filter((l) => l.id !== id));
        toast.success("ลบรายการเรียบร้อยแล้ว");
      }
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  const newCount = listings.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ฝากขาย/เช่า</h1>
          <p className="text-gray-600">
            จัดการรายการฝากขาย/เช่าจากลูกค้า
            {newCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {newCount} ใหม่
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchListings}
            disabled={loading}
            className="text-gray-900"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">กรองสถานะ:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("")}
              className={filterStatus === "" ? "bg-[#c6af6c] hover:bg-[#b39d5b]" : "text-gray-900"}
            >
              ทั้งหมด ({listings.length})
            </Button>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={filterStatus === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(option.value)}
                className={filterStatus === option.value ? "bg-[#c6af6c] hover:bg-[#b39d5b]" : "text-gray-900"}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Listings List */}
      <div className="grid gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredListings.length === 0 ? (
          <Card className="p-12 text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ไม่มีรายการฝากขาย/เช่า
            </h3>
            <p className="text-gray-600">
              {filterStatus
                ? "ไม่พบรายการในสถานะนี้"
                : "ยังไม่มีรายการฝากขาย/เช่าจากลูกค้า"}
            </p>
          </Card>
        ) : (
          filteredListings.map((listing) => {
            const statusConfig = getStatusConfig(listing.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={listing.id}
                className={`p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                  listing.status === "new" ? "border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => {
                  setSelectedListing(listing);
                  setNotes(listing.notes || "");
                  setModalStatus(listing.status);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-[#c6af6c]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#c6af6c]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{listing.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${listing.phone}`}
                          className="hover:text-[#c6af6c]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {listing.phone}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(listing.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        listing.listingType === "sell" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {listingTypeLabels[listing.listingType] || listing.listingType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {propertyTypeLabels[listing.propertyType] || listing.propertyType}
                      </span>
                    </div>

                    {listing.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </div>
                    )}

                    {listing.price && (
                      <p className="text-sm text-[#c6af6c] font-medium mb-2">
                        ราคาที่ต้องการ: {listing.price}
                      </p>
                    )}

                    {listing.details && (
                      <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded">
                        <FileText className="w-4 h-4 inline mr-1 text-gray-400" />
                        {listing.details}
                      </p>
                    )}

                    {listing.notes && (
                      <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        บันทึก: {listing.notes}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex sm:flex-col gap-2">
                    {listing.status !== "completed" && listing.status !== "cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus = listing.status === "new" ? "contacted" :
                                            listing.status === "contacted" ? "in_progress" : "completed";
                          handleQuickStatusUpdate(listing.id, nextStatus);
                        }}
                        disabled={updating}
                      >
                        {listing.status === "new" ? "ติดต่อแล้ว" :
                         listing.status === "contacted" ? "ดำเนินการ" : "เสร็จสิ้น"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(listing.id);
                      }}
                      disabled={deleting === listing.id}
                    >
                      {deleting === listing.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">รายละเอียดการฝากขาย/เช่า</h2>
                  <p className="text-sm text-gray-500">ID: {selectedListing.id}</p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#c6af6c]/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#c6af6c]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedListing.name}</h3>
                    <a
                      href={`tel:${selectedListing.phone}`}
                      className="text-[#c6af6c] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedListing.phone}
                    </a>
                    {selectedListing.email && (
                      <a
                        href={`mailto:${selectedListing.email}`}
                        className="text-gray-600 hover:text-[#c6af6c] flex items-center gap-1 text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        {selectedListing.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      selectedListing.listingType === "sell" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {listingTypeLabels[selectedListing.listingType] || selectedListing.listingType}
                    </span>
                    <span className="text-sm text-gray-600">
                      {propertyTypeLabels[selectedListing.propertyType] || selectedListing.propertyType}
                    </span>
                  </div>
                  {selectedListing.location && (
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedListing.location}
                    </div>
                  )}
                  {selectedListing.size && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">ขนาด:</span> {selectedListing.size}
                    </div>
                  )}
                  {selectedListing.price && (
                    <div className="text-sm text-[#c6af6c] font-medium">
                      ราคาที่ต้องการ: {selectedListing.price}
                    </div>
                  )}
                </div>

                {selectedListing.details && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">รายละเอียดเพิ่มเติม</div>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-900">
                      {selectedListing.details}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  ส่งเมื่อ {formatDate(selectedListing.createdAt)}
                </div>
              </div>

              {/* Status Update */}
              <div className="border-t pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    สถานะ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => {
                      const isActive = modalStatus === option.value;
                      return (
                        <Button
                          key={option.value}
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          className={isActive ? "bg-[#c6af6c] hover:bg-[#b39d5b]" : "text-gray-900"}
                          onClick={() => setModalStatus(option.value)}
                        >
                          <option.icon className="w-4 h-4 mr-1" />
                          {option.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    บันทึกเพิ่มเติม (Admin)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="เพิ่มบันทึก เช่น ติดต่อแล้ว รอนัดดู..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c6af6c]/50 focus:border-[#c6af6c] text-gray-900"
                  />
                  <Button
                    size="sm"
                    className="mt-2 bg-[#c6af6c] hover:bg-[#b39d5b]"
                    onClick={handleSaveListing}
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      "บันทึก"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
