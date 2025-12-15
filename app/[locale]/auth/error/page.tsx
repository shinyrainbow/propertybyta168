"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, AlertCircle } from "lucide-react";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "เกิดข้อผิดพลาดในการกำหนดค่าระบบ";
      case "AccessDenied":
        return "การเข้าถึงถูกปฏิเสธ";
      case "Verification":
        return "ลิงก์การยืนยันหมดอายุหรือถูกใช้ไปแล้ว";
      default:
        return "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        เกิดข้อผิดพลาด
      </h1>

      <p className="text-gray-600 mb-6">{getErrorMessage(error)}</p>

      <div className="space-y-3">
        <Link href="/admin">
          <Button className="w-full bg-[#C9A227] hover:bg-[#A88B1F] text-white">
            กลับไปหน้าเข้าสู่ระบบ
          </Button>
        </Link>

        <Link href="/">
          <Button variant="outline" className="w-full">
            กลับสู่หน้าหลัก
          </Button>
        </Link>
      </div>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NCAwLTE4IDguMDYtMTggMThzOC4wNiAxOCAxOCAxOCAxOC04LjA2IDE4LTE4LTguMDYtMTgtMTgtMTh6bS00LjUgMjcuNUMxOC42IDQzLjIgOCAzMi43IDggMjBjMC03LjcgNi4zLTE0IDE0LTE0czE0IDYuMyAxNCAxNC02LjMgMTQtMTQgMTR6IiBmaWxsPSIjYzZhZjZjIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-[#C9A227]" />
            <span className="text-3xl font-bold text-gray-900">
              Sky Pro Property
            </span>
          </Link>
        </div>

        {/* Error Card */}
        <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <Suspense
            fallback={
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6" />
              </div>
            }
          >
            <AuthErrorContent />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
