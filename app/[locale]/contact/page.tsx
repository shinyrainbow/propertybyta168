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
import Footer from "@/components/layout/footer";
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
      details: ["061-259-6657"],
      color: "from-[#eb3838] to-[#d32f2f]",
      links: ["tel:0612596657"],
    },
    {
      icon: MapPin,
      title: t("contactPage.address"),
      details: [
        t("contactPage.companyName"),
        t("contactPage.addressLine1"),
        t("contactPage.addressLine2"),
      ],
      color: "from-gray-700 to-gray-800",
      links: [],
    },
    {
      icon: Clock,
      title: t("contactPage.businessHours"),
      details: [t("contactPage.daysOpen"), t("contactPage.hoursOpen")],
      color: "from-gray-600 to-gray-700",
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
      href: "https://web.facebook.com/p/Property-By-Ta-168-100093155621525/",
      color: "bg-blue-600 hover:bg-blue-700",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@propertybyta",
      color: "bg-black hover:bg-gray-800",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section - Light with Red Accent */}
      <section className="relative py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            {/* Red Line */}
            <div className="w-20 h-1 bg-[#eb3838] mx-auto mb-6" />

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {t("contactPage.title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t("contactPage.subtitle")}
              <br className="hidden md:block" />
              {t("contactPage.subtitle2")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className={`group relative bg-white border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-8 hover:shadow-lg hover:border-[#eb3838]/30 transition-all duration-500 ${
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
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-3">
                      {info.title}
                    </h3>

                    {info.details.map((detail, i) =>
                      info.links && info.links[i] ? (
                        <a
                          key={i}
                          href={info.links[i]}
                          className="block text-[#eb3838] hover:text-[#d32f2f] transition-colors text-base md:text-lg font-medium"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p key={i} className="text-gray-500 text-xs md:text-sm leading-relaxed">
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
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Line QR Code */}
              <div
                className={`bg-gradient-to-br from-[#00B900]/10 to-[#00B900]/5 border border-[#00B900]/30 rounded-xl md:rounded-2xl p-6 md:p-8 text-center transition-all duration-700 ${
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

                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {t("footerNav.lineOfficial")}
                </h3>
                <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">
                  {t("contactPage.scanQr")}
                </p>

                <div className="bg-white p-3 md:p-4 rounded-xl inline-block mb-3 md:mb-4 shadow-sm">
                  <Image
                    src="/line.png"
                    alt="Line QR Code"
                    width={150}
                    height={150}
                    className="rounded-lg w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
                  />
                </div>

                <p className="text-[#00B900] font-medium text-sm md:text-base">@propertybyta168</p>
              </div>

              {/* Social & Map */}
              <div className="space-y-4 md:space-y-6">
                {/* Social Media */}
                <div
                  className={`bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-5 md:p-8 transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: "400ms" }}
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
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
                  className={`bg-gray-100 border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: "500ms" }}
                >
                  <div className="h-36 md:h-48 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#eb3838]/10 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#eb3838]" />
                      </div>
                      <p className="text-gray-900 font-medium text-sm md:text-base">
                        Property by TA168
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-1 bg-[#eb3838] mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900">{t("contactPage.faq")}</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#eb3838] flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="p-6 pt-0 text-gray-600 leading-relaxed">
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
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("contactPage.ctaTitle")}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
            {t("contactPage.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/search">
              <Button
                size="lg"
                className="w-full sm:w-auto !bg-[#eb3838] !text-white hover:!bg-[#d32f2f] px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold rounded-xl"
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

      <Footer />
    </div>
  );
}
