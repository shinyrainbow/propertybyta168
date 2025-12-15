"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Phone,
  User,
  Clock,
  Home,
  CheckCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  ExternalLink,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";

interface Inquiry {
  id: string;
  propertyId: string | null;
  propertyCode: string | null;
  propertyTitle: string | null;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusOptions = [
  { value: "new", label: "ใหม่", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  { value: "contacted", label: "ติดต่อแล้ว", color: "bg-yellow-100 text-yellow-800", icon: Phone },
  { value: "resolved", label: "เสร็จสิ้น", color: "bg-green-100 text-green-800", icon: CheckCircle },
];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [modalStatus, setModalStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `/api/public/inquiries?status=${filterStatus}`
        : "/api/public/inquiries";
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [filterStatus]);

  const handleSaveInquiry = async () => {
    if (!selectedInquiry) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: modalStatus, notes }),
      });

      if (response.ok) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === selectedInquiry.id ? { ...inq, status: modalStatus, notes } : inq
          )
        );
        setSelectedInquiry(null);
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id ? { ...inq, status: newStatus } : inq
          )
        );
      }
    } catch (error) {
      console.error("Failed to update inquiry:", error);
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

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ข้อความติดต่อ</h1>
          <p className="text-gray-600">
            จัดการข้อความติดต่อจากลูกค้า
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
            onClick={fetchInquiries}
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
              className={filterStatus === "" ? "bg-[#C9A227] hover:bg-[#A88B1F]" : "text-gray-900"}
            >
              ทั้งหมด ({inquiries.length})
            </Button>
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={filterStatus === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(option.value)}
                className={filterStatus === option.value ? "bg-[#C9A227] hover:bg-[#A88B1F]" : "text-gray-900"}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Inquiries List */}
      <div className="grid gap-4">
        {loading ? (
          // Loading skeleton
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
        ) : inquiries.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ไม่มีข้อความติดต่อ
            </h3>
            <p className="text-gray-600">
              {filterStatus
                ? "ไม่พบข้อความในสถานะนี้"
                : "ยังไม่มีข้อความติดต่อจากลูกค้า"}
            </p>
          </Card>
        ) : (
          inquiries.map((inquiry) => {
            const statusConfig = getStatusConfig(inquiry.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={inquiry.id}
                className={`p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                  inquiry.status === "new" ? "border-l-4 border-l-blue-500" : ""
                }`}
                onClick={() => {
                  setSelectedInquiry(inquiry);
                  setNotes(inquiry.notes || "");
                  setModalStatus(inquiry.status);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-[#C9A227]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-[#C9A227]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="hover:text-[#C9A227]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {inquiry.phone}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </div>

                    {inquiry.propertyCode && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Home className="w-4 h-4" />
                        <span>ทรัพย์: {inquiry.propertyCode}</span>
                        {inquiry.propertyId && (
                          <Link
                            href={`/property/${inquiry.propertyId}`}
                            target="_blank"
                            className="text-[#C9A227] hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            ดูทรัพย์
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}

                    {inquiry.message && (
                      <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-2 rounded">
                        <MessageSquare className="w-4 h-4 inline mr-1 text-gray-400" />
                        {inquiry.message}
                      </p>
                    )}

                    {inquiry.notes && (
                      <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        บันทึก: {inquiry.notes}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex sm:flex-col gap-2">
                    {inquiry.status !== "resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickStatusUpdate(inquiry.id, inquiry.status === "new" ? "contacted" : "resolved");
                        }}
                        disabled={updating}
                      >
                        {inquiry.status === "new" ? "ติดต่อแล้ว" : "เสร็จสิ้น"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">รายละเอียดข้อความ</h2>
                  <p className="text-sm text-gray-500">ID: {selectedInquiry.id}</p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#C9A227]/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedInquiry.name}</h3>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="text-[#C9A227] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedInquiry.phone}
                    </a>
                  </div>
                </div>

                {selectedInquiry.propertyTitle && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">ทรัพย์ที่สนใจ</div>
                    <div className="font-medium text-gray-900">{selectedInquiry.propertyTitle}</div>
                    {selectedInquiry.propertyCode && (
                      <div className="text-sm text-gray-600">รหัส: {selectedInquiry.propertyCode}</div>
                    )}
                    {selectedInquiry.propertyId && (
                      <Link
                        href={`/property/${selectedInquiry.propertyId}`}
                        target="_blank"
                        className="text-sm text-[#C9A227] hover:underline flex items-center gap-1 mt-1"
                      >
                        ดูหน้าทรัพย์
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                )}

                {selectedInquiry.message && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">ข้อความ</div>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-900">
                      {selectedInquiry.message}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  ส่งเมื่อ {formatDate(selectedInquiry.createdAt)}
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
                          className={isActive ? "bg-[#C9A227] hover:bg-[#A88B1F]" : ""}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] text-gray-900"
                  />
                  <Button
                    size="sm"
                    className="mt-2 bg-[#C9A227] hover:bg-[#A88B1F]"
                    onClick={handleSaveInquiry}
                    disabled={updating}
                  >
                    บันทึก
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
