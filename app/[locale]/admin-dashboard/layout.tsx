"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  Tag,
  Star,
  Wrench,
  MessageSquare,
  FileText,
  Text,
} from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "แดชบอร์ด",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "รายการทรัพย์สิน",
    href: "/admin-dashboard/properties",
    icon: Home,
  },
  {
    label: "ข้อความติดต่อ",
    href: "/admin-dashboard/inquiries",
    icon: MessageSquare,
  },
   {
    label: "ฝากขาย/เช่า",
    href: "/admin-dashboard/property-listings",
    icon: Text,
  },
 
  {
    label: "จัดการบล็อก",
    href: "/admin-dashboard/blog",
    icon: FileText,
  },
  {
    label: "ตั้งค่า",
    href: "/admin-dashboard/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin?callbackUrl=/admin-dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <Link href="/admin-dashboard" className="flex items-center gap-2">
            <Image
              src="/header-logo.png"
              alt="Sky Pro Property"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              unoptimized
            />
            <Image
              src="/name-logo.png"
              alt="Sky Pro Property"
              height={36}
              width={108}
              className="object-contain h-9 w-auto"
              unoptimized
            />
          </Link>
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#C9A227] text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">กลับหน้าหลัก</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 mt-1"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top navbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page title - hidden on mobile */}
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-gray-900">
              {menuItems.find((item) => item.href === pathname)?.label ||
                "Admin Dashboard"}
            </h1>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-8 h-8 bg-[#C9A227] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {session?.user?.name || session?.user?.email}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Link
                    href="/admin-dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    ตั้งค่า
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
