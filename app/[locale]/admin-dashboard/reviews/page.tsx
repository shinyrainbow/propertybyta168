"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  ThumbsUp,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

interface Review {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rating: number;
  comment: string;
  transactionType: string;
  location: string;
  helpful: number;
  status: "published" | "pending" | "rejected";
  createdAt: string;
}

interface Stats {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  averageRating: number;
}

// Generate avatar background color based on name
function getAvatarBg(name: string): string {
  const colors = [
    "bg-[#C9A227]",
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-pink-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-rose-500",
    "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// Format date to Thai
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    published: 0,
    pending: 0,
    rejected: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { confirm } = useConfirmDialog();

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();

      if (data.success) {
        setReviews(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to update review:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "ยืนยันการลบ",
      message: "คุณแน่ใจหรือไม่ว่าต้องการลบรีวิวนี้?",
      confirmText: "ลบ",
      cancelText: "ยกเลิก",
      variant: "danger",
    });
    if (!confirmed) return;

    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("ลบรีวิวเรียบร้อยแล้ว");
        fetchReviews();
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUpdating(null);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            เผยแพร่แล้ว
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
            รอตรวจสอบ
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
            ไม่อนุมัติ
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-20 animate-pulse bg-gray-200" />
          ))}
        </div>
        <Card className="h-16 animate-pulse bg-gray-200" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">จัดการรีวิว</h1>
        <p className="text-gray-600 mt-1">
          ตรวจสอบและจัดการรีวิวจากลูกค้าทั้งหมด
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">คะแนนเฉลี่ย</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">เผยแพร่แล้ว</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.published}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รอตรวจสอบ</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">รีวิวทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="ค้นหาชื่อหรือความคิดเห็น..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className={
                filterStatus === "all" ? "bg-[#C9A227] hover:bg-[#A88B1F]" : "text-gray-900"
              }
            >
              ทั้งหมด
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
              className={
                filterStatus === "pending"
                  ? "bg-[#C9A227] hover:bg-[#A88B1F]"
                  : "text-gray-900"
              }
            >
              รอตรวจสอบ ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === "published" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("published")}
              className={
                filterStatus === "published"
                  ? "bg-[#C9A227] hover:bg-[#A88B1F]"
                  : "text-gray-900"
              }
            >
              เผยแพร่แล้ว
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("rejected")}
              className={
                filterStatus === "rejected"
                  ? "bg-[#C9A227] hover:bg-[#A88B1F]"
                  : "text-gray-900"
              }
            >
              ไม่อนุมัติ
            </Button>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">ไม่พบรีวิว</p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 ${getAvatarBg(
                    review.name
                  )} rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-lg font-bold">
                    {review.name.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {getStatusBadge(review.status)}
                  </div>

                  <p className="text-gray-600 mb-3">{review.comment}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span>{review.transactionType}</span>
                    <span>•</span>
                    <span>{review.location}</span>
                    <span>•</span>
                    <span>{formatDate(review.createdAt)}</span>
                    {review.email && (
                      <>
                        <span>•</span>
                        <span>{review.email}</span>
                      </>
                    )}
                    {review.phone && (
                      <>
                        <span>•</span>
                        <span>{review.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {updating === review.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <>
                      {review.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() =>
                              handleUpdateStatus(review.id, "published")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            อนุมัติ
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleUpdateStatus(review.id, "rejected")
                            }
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            ไม่อนุมัติ
                          </Button>
                        </>
                      )}
                      {review.status === "published" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          onClick={() =>
                            handleUpdateStatus(review.id, "pending")
                          }
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ยกเลิกเผยแพร่
                        </Button>
                      )}
                      {review.status === "rejected" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() =>
                            handleUpdateStatus(review.id, "published")
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          อนุมัติ
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
