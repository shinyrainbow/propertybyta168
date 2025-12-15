"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { MapPin, Phone } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footerNav");

  const quickLinks = [
    { href: "/search?listingType=rent", label: tNav("rent") },
    { href: "/search?listingType=sale", label: tNav("sale") },
    { href: "/blog", label: tNav("blog") },
    // { href: "/reviews", label: tNav("reviews") },
  ];

  return (
    <footer className="bg-[#111928]">
      {/* Gold accent line at top */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent" />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center mb-4">
              <Image
                src="/skypro-logo-gold.jpg"
                alt="Sky Pro Property"
                width={192}
                height={64}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-xs leading-relaxed text-center">
              {t("tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">{tFooter("quickLinks")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-xs hover:text-[#C9A227] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">{tFooter("contact")}</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <Phone className="w-3 h-3 text-[#C9A227] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-xs">063-956-2446</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-[#C9A227] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-xs leading-relaxed">
                  บริษัท สกายโปรพร้อมเพอร์ตี้ จำกัด<br />
                  111 หมู่ที่ 2 ตำบลไชยสถาน<br />
                  อำเภอสารภี จังหวัดเชียงใหม่ 50140
                </span>
              </li>
            </ul>
          </div>

          {/* Social / LINE */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">{tFooter("connect")}</h4>
            <p className="text-gray-400 text-xs mb-3">
              {tFooter("addLineSupport")}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#06C755] rounded-lg text-white text-xs font-medium">
              <span>@skypro</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-[10px]">
              {t("copyright")}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-gray-500 text-[10px] hover:text-gray-400 transition-colors">
                {tFooter("privacyPolicy")}
              </Link>
              <Link href="/terms" className="text-gray-500 text-[10px] hover:text-gray-400 transition-colors">
                {tFooter("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
