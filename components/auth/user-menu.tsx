"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

interface UserMenuProps {
  scrolled?: boolean;
}

export default function UserMenu({ scrolled = false }: UserMenuProps) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <Link href="/admin">
        <Button
          className={`transition-all duration-300 transform hover:scale-105 ${
            scrolled
              ? "bg-[#C9A227] hover:bg-[#A88B1F] text-white"
              : "bg-white text-gray-900 hover:bg-gray-100"
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          เข้าสู่ระบบ
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-gray-100 hover:bg-gray-200 text-gray-900"
            : "bg-white/20 hover:bg-white/30 text-white"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            scrolled ? "bg-[#C9A227] text-white" : "bg-white text-[#C9A227]"
          }`}
        >
          {session.user?.name?.charAt(0).toUpperCase() ||
            session.user?.email?.charAt(0).toUpperCase() ||
            "U"}
        </div>
        <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
          {session.user?.name || session.user?.email?.split("@")[0]}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>

            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 text-gray-400" />
                ตั้งค่าบัญชี
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                ออกจากระบบ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
