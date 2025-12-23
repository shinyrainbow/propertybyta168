"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { type ReactNode } from "react";

interface FooterProps {
  seoContent?: ReactNode;
}

export default function Footer({ seoContent }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footerNav");

  const quickLinks = [
    { href: "/search?listingType=rent", label: tNav("rent") },
    { href: "/search?listingType=sale", label: tNav("sale") },
    { href: "/blog", label: tNav("blog") },
    { href: "/contact", label: tNav("contact") },
  ];

  const propertyTypes = [
    { href: "/search?propertyType=Condo", label: "Condo" },
    { href: "/search?propertyType=Townhouse", label: "Townhouse" },
    { href: "/search?propertyType=SingleHouse", label: "House" },
    { href: "/search?propertyType=Land", label: "Land" },
  ];

  return (
    <footer className="bg-[#1a1a1a]">
      {/* Red Accent Line */}
      <div className="h-1 bg-[#eb3838]" />

      {/* SEO Content Section */}
      {seoContent && (
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-10 lg:py-12">
            {seoContent}
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo-trans.png"
                alt="property by ta168"
                width={180}
                height={60}
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t("tagline")}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://web.facebook.com/p/Property-By-Ta-168-100093155621525/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] transition-colors duration-300"
                title="Facebook"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@propertybyta"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 group"
                title="TikTok"
              >
                <svg className="w-5 h-5 text-white group-hover:text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {tFooter("quickLinks")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#eb3838] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-[#eb3838]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {tFooter("propertyTypes") || "Property Types"}
            </h4>
            <ul className="space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#eb3838] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-[#eb3838]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              {tFooter("contact")}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:096-262-2888"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#eb3838]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#eb3838] transition-colors duration-300">
                    <Phone className="w-4 h-4 text-[#eb3838] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">{tFooter("callUs") || "Call Us"}</p>
                    <p className="text-white text-sm font-medium">096-262-2888</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:propertybyta168@gmail.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#eb3838]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#eb3838] transition-colors duration-300">
                    <Mail className="w-4 h-4 text-[#eb3838] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Email</p>
                    <p className="text-white text-sm font-medium">propertybyta168@gmail.com</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eb3838]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#eb3838]" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">{tFooter("address") || "Address"}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    propertybyta168
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-[#141414]">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs">
              {t("copyright")}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-500 text-xs hover:text-[#eb3838] transition-colors">
                {tFooter("privacyPolicy")}
              </Link>
              <Link href="/terms" className="text-gray-500 text-xs hover:text-[#eb3838] transition-colors">
                {tFooter("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
