"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Home, Search, Heart, Phone } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations();

  const navItems = [
    { href: "/", icon: Home, label: t("nav.home") || "Home" },
    { href: "/search", icon: Search, label: t("common.search") },
    { href: "/properties", icon: Heart, label: t("common.properties") },
    { href: "/contact", icon: Phone, label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/th" || pathname === "/en";
    return pathname.includes(href);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active
                    ? "text-[#C9A227]"
                    : "text-gray-500 hover:text-[#C9A227]"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${active ? "fill-current" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-16 md:hidden" />

      <style jsx global>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
}
