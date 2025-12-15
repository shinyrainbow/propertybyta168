"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import Header from "@/components/layout/header";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const contactInfo = [
    {
      icon: Phone,
      title: t("contactPage.phone"),
      details: ["063-956-2446"],
      color: "from-green-500 to-green-600",
      links: ["tel:0639562446"],
    },
    {
      icon: MapPin,
      title: t("contactPage.address"),
      details: [
        t("contactPage.companyName"),
        t("contactPage.addressLine1"),
        t("contactPage.addressLine2"),
      ],
      color: "from-red-500 to-red-600",
      links: [],
    },
    {
      icon: Clock,
      title: t("contactPage.businessHours"),
      details: [t("contactPage.daysOpen"), t("contactPage.hoursOpen")],
      color: "from-purple-500 to-purple-600",
      links: [],
    },
  ];

  const faqs = [
    { q: t("contactPage.faq1Q"), a: t("contactPage.faq1A") },
    { q: t("contactPage.faq2Q"), a: t("contactPage.faq2A") },
    { q: t("contactPage.faq3Q"), a: t("contactPage.faq3A") },
    { q: t("contactPage.faq4Q"), a: t("contactPage.faq4A") },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/share/1BqpBqLF4x/",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/skyproproperty?igsh=dmQ3NzkwMGMzNjI5",
      color:
        "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@skyproproperty?_r=1&_t=ZS-9291zppaPLT",
      color: "bg-black hover:bg-gray-800",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Header />
      <div className="h-16" />

      {/* Hero Section - Dark Premium Style */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E1A] via-transparent to-[#0A0E1A]" />

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            {/* Gold Line */}
            <div className="w-20 h-1 bg-gradient-to-r from-[#C9A227] to-[#E8D48B] mx-auto mb-6" />

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              {t("contactPage.title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              {t("contactPage.subtitle")}
              <br className="hidden md:block" />
              {t("contactPage.subtitle2")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-[#0A0E1A] to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/10 transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4 md:block">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${info.color} rounded-xl md:rounded-2xl flex items-center justify-center md:mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                  >
                    <info.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-3">
                      {info.title}
                    </h3>

                    {info.details.map((detail, i) =>
                      info.links && info.links[i] ? (
                        <a
                          key={i}
                          href={info.links[i]}
                          className="block text-[#C9A227] md:text-gray-400 hover:text-[#C9A227] transition-colors text-base md:text-lg font-medium md:font-normal"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p key={i} className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          {detail}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Line & Social Section */}
      <section className="py-10 md:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Line QR Code */}
              <div
                className={`bg-gradient-to-br from-[#00B900]/20 to-[#00B900]/5 border border-[#00B900]/30 rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#00B900] rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg
                    className="w-9 h-9 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {t("footerNav.lineOfficial")}
                </h3>
                <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">
                  {t("contactPage.scanQr")}
                </p>

                <div className="bg-white p-3 md:p-4 rounded-xl inline-block mb-3 md:mb-4">
                  <Image
                    src="/skyproqrcode.png"
                    alt="Line QR Code"
                    width={150}
                    height={150}
                    className="rounded-lg w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
                  />
                </div>

                <p className="text-[#00B900] font-medium text-sm md:text-base">@skyproproperty</p>
              </div>

              {/* Social & Map */}
              <div className="space-y-4 md:space-y-6">
                {/* Social Media */}
                <div
                  className={`bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                    {t("contactPage.followUs")}
                  </h3>

                  <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-3 py-3 md:px-5 md:py-3 ${social.color} text-white rounded-xl transition-all duration-300 hover:scale-105`}
                      >
                        {social.icon}
                        <span className="font-medium text-xs md:text-base">{social.name}</span>
                        <ExternalLink className="hidden md:block w-4 h-4 opacity-60" />
                      </a>
                    ))}
                  </div>

                  <p className="text-gray-500 text-xs md:text-sm mt-4 md:mt-6 text-center md:text-left">
                    {t("contactPage.followUsDesc")}
                  </p>
                </div>

                {/* Map */}
                <div
                  className={`bg-white/5 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <div className="h-36 md:h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#C9A227]/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#C9A227]" />
                      </div>
                      <p className="text-white font-medium text-sm md:text-base">
                        Sky Pro Property
                      </p>
                      <p className="text-gray-500 text-xs md:text-sm">
                        {t("contactPage.location")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#0A0E1A]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-1 bg-gradient-to-r from-[#C9A227] to-[#E8D48B] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white">{t("contactPage.faq")}</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <span className="font-semibold text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#C9A227] flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 pt-0 text-gray-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#C9A227] to-[#A88B1F] relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("contactPage.ctaTitle")}
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
            {t("contactPage.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/search">
              <Button
                size="lg"
                className="w-full sm:w-auto !bg-white !text-gray-900 hover:!bg-gray-100 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl"
              >
                {t("contactPage.searchProperty")}
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl"
              >
                {t("contactPage.backHome")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0E1A] border-t border-white/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-10 h-10 text-[#C9A227]" />
            <span className="text-2xl font-bold text-white">
              Sky Pro Property
            </span>
          </div>
          <p className="text-gray-500 mb-2">
            Premium Real Estate Solutions | Chiangmai, Thailand
          </p>
          <p className="text-gray-600 text-sm">
            © 2025 บริษัท สกายโปรพร้อมเพอร์ตี้ จำกัด. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
