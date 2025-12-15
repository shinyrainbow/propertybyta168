"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const profile = {
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  };

  // Password change state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChangePassword = async () => {
    // Client-side validation
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setPasswordMessage({ type: "error", text: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: "error", text: "รหัสผ่านใหม่ไม่ตรงกัน" });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    setChangingPassword(true);
    setPasswordMessage(null);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });

      const data = await res.json();

      if (data.success) {
        setPasswordMessage({ type: "success", text: "เปลี่ยนรหัสผ่านสำเร็จ" });
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMessage({ type: "error", text: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch (error) {
      setPasswordMessage({ type: "error", text: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ตั้งค่า</h1>
        <p className="text-gray-600 mt-1">จัดการบัญชีและการตั้งค่าของคุณ</p>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A227]/10 rounded-lg">
            <User className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ข้อมูลส่วนตัว</h2>
            {/* <p className="text-sm text-gray-500">อัพเดทข้อมูลบัญชีของคุณ</p> */}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อ
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={profile.name}
                className="pl-10 bg-gray-100 cursor-not-allowed"
                placeholder="ชื่อของคุณ"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                value={profile.email}
                className="pl-10 bg-gray-100 cursor-not-allowed"
                placeholder="email@example.com"
                disabled
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Password Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A227]/10 rounded-lg">
            <Lock className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              เปลี่ยนรหัสผ่าน
            </h2>
            <p className="text-sm text-gray-500">อัพเดทรหัสผ่านของคุณ</p>
          </div>
        </div>

        {passwordMessage && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
              passwordMessage.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {passwordMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{passwordMessage.text}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านปัจจุบัน
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสผ่านใหม่
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ยืนยันรหัสผ่านใหม่
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>

          <Button
            variant="outline"
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="text-gray-900"
          >
            {changingPassword ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                กำลังเปลี่ยน...
              </>
            ) : (
              "เปลี่ยนรหัสผ่าน"
            )}
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      {/* <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A227]/10 rounded-lg">
            <Bell className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              การแจ้งเตือน
            </h2>
            <p className="text-sm text-gray-500">ตั้งค่าการแจ้งเตือนทางอีเมล</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "emailNewLead",
              label: "ลูกค้าใหม่สนใจทรัพย์สิน",
              desc: "รับอีเมลเมื่อมีลูกค้าติดต่อสอบถาม",
            },
            {
              key: "emailPropertyView",
              label: "มีคนเข้าชมทรัพย์สิน",
              desc: "รับอีเมลเมื่อทรัพย์สินของคุณมียอดเข้าชมสูง",
            },
            {
              key: "emailWeeklyReport",
              label: "รายงานประจำสัปดาห์",
              desc: "รับสรุปยอดเข้าชมและสถิติทุกสัปดาห์",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications]
                    ? "bg-[#C9A227]"
                    : "bg-gray-200"
                }`}
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof notifications],
                  }))
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card> */}

      {/* Security Settings */}
      {/* <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#C9A227]/10 rounded-lg">
            <Shield className="w-5 h-5 text-[#C9A227]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ความปลอดภัย</h2>
            <p className="text-sm text-gray-500">ตั้งค่าความปลอดภัยของบัญชี</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">
                การยืนยันตัวตนสองชั้น (2FA)
              </p>
              <p className="text-xs text-gray-500">
                เพิ่มความปลอดภัยด้วยการยืนยันตัวตนเพิ่มเติม
              </p>
            </div>
            <Button variant="outline" size="sm">
              ตั้งค่า
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">
                ประวัติการเข้าสู่ระบบ
              </p>
              <p className="text-xs text-gray-500">
                ดูประวัติการเข้าสู่ระบบทั้งหมด
              </p>
            </div>
            <Button variant="outline" size="sm">
              ดู
            </Button>
          </div>
        </div>
      </Card> */}
    </div>
  );
}
