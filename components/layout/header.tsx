"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { X, Phone, ChevronDown, Building2, Home, LandPlot, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const tPropertyTypes = useTranslations("propertyTypes");
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Property type categories for dropdown
  const propertyCategories = {
    living: {
      label: tPropertyTypes("main.living"),
      icon: Home,
      items: [
        { value: "Condo", label: tSearch("condo") },
        { value: "Townhouse", label: tSearch("townhouse") },
        { value: "SingleHouse", label: tSearch("singleHouse") },
        { value: "Villa", label: tSearch("villa") },
      ],
    },
    land: {
      label: tPropertyTypes("main.land"),
      icon: LandPlot,
      items: [
        { value: "Land", label: tSearch("land") },
      ],
    },
    commercial: {
      label: tPropertyTypes("main.commercial"),
      icon: Store,
      items: [
        { value: "Office", label: tSearch("office") },
        { value: "Store", label: tSearch("store") },
        { value: "Factory", label: tSearch("factory") },
        { value: "Hotel", label: tSearch("hotel") },
        { value: "Building", label: tSearch("building") },
        { value: "Apartment", label: tSearch("apartment") },
      ],
    },
  };

  useEffect(() => {
    const alreadyVisible = sessionStorage.getItem("header-visible") === "true";
    if (alreadyVisible) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(true);
        sessionStorage.setItem("header-visible", "true");
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolled = scrollY > 50;

  const leftNavLinks = [
    { href: "/search?listingType=rent", label: t("rent") },
    { href: "/search?listingType=sale", label: t("sale") },
    { href: "/map-search", label: t("mapSearch") },
  ];

  const rightNavLinks = [
    { href: "/list-property", label: t("listProperty") },
    { href: "/blog", label: t("blog") },
  ];

  const allNavLinks = [...leftNavLinks, ...rightNavLinks];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg shadow-black/10"
            : transparent ? "bg-transparent" : "bg-white/95 backdrop-blur-sm"
        } ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        {/* Red accent from left - diagonal edge (desktop only) - always visible */}
        <div
          className="hidden md:block absolute top-0 bottom-0 left-0 overflow-hidden pointer-events-none"
          style={{
            width: isScrolled ? "380px" : "340px",
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "#eb3838",
              clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)"
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative">
          {/* Desktop: Logo left, nav center, contact + language right */}
          <div className="hidden md:grid md:grid-cols-3 items-center py-2">
            {/* Left - Logo */}
            <Link href="/" className="flex items-center group">
              <div className={`relative transition-all duration-500 ease-out ${isScrolled ? "h-12" : "h-14"} w-auto`}>
                <Image
                  src="/logo.png"
                  alt="Property by TA168"
                  height={56}
                  width={168}
                  className="object-contain h-full w-auto"
                  unoptimized
                />
              </div>
            </Link>

            {/* Center - Navigation */}
            <div className="flex items-center justify-center gap-6">
              {/* Rent with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("rent")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/search?listingType=rent"
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
                    isScrolled || !transparent
                      ? "text-gray-700 hover:text-[#eb3838]"
                      : "text-white hover:text-[#eb3838]"
                  }`}
                >
                  {t("rent")}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "rent" ? "rotate-180" : ""}`} />
                </Link>

                {/* Rent Dropdown */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                  activeDropdown === "rent" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}>
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[480px]">
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(propertyCategories).map(([key, category]) => (
                        <div key={key}>
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <category.icon className="w-4 h-4 text-[#eb3838]" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{category.label}</span>
                          </div>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <Link
                                key={item.value}
                                href={`/search?listingType=rent&propertyType=${item.value}`}
                                className="block px-2 py-1.5 text-sm text-gray-700 hover:text-[#eb3838] hover:bg-[#eb3838]/5 rounded-md transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        href="/search?listingType=rent"
                        className="text-sm text-[#eb3838] hover:text-[#d32f2f] font-medium"
                      >
                        {tSearch("all")} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sale with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("sale")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/search?listingType=sale"
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
                    isScrolled || !transparent
                      ? "text-gray-700 hover:text-[#eb3838]"
                      : "text-white hover:text-[#eb3838]"
                  }`}
                >
                  {t("sale")}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === "sale" ? "rotate-180" : ""}`} />
                </Link>

                {/* Sale Dropdown */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
                  activeDropdown === "sale" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}>
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[480px]">
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(propertyCategories).map(([key, category]) => (
                        <div key={key}>
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                            <category.icon className="w-4 h-4 text-[#eb3838]" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{category.label}</span>
                          </div>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <Link
                                key={item.value}
                                href={`/search?listingType=sale&propertyType=${item.value}`}
                                className="block px-2 py-1.5 text-sm text-gray-700 hover:text-[#eb3838] hover:bg-[#eb3838]/5 rounded-md transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Link
                        href="/search?listingType=sale"
                        className="text-sm text-[#eb3838] hover:text-[#d32f2f] font-medium"
                      >
                        {tSearch("all")} →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Search link */}
              <Link
                href="/map-search"
                className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  isScrolled || !transparent
                    ? "text-gray-700 hover:text-[#eb3838]"
                    : "text-white hover:text-[#eb3838]"
                }`}
              >
                {t("mapSearch")}
              </Link>
              {/* Other nav links without dropdown */}
              {rightNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    isScrolled || !transparent
                      ? "text-gray-700 hover:text-[#eb3838]"
                      : "text-white hover:text-[#eb3838]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right - Contact Button + Language Switcher */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#eb3838] text-white font-medium rounded-lg hover:bg-[#d32f2f] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Phone className="w-4 h-4" />
                {t("contact")}
              </Link>
              <LanguageSwitcher variant={isScrolled || !transparent ? "dark" : "light"} compact />
            </div>
          </div>

          {/* Mobile: Logo left, menu right */}
          <div className="flex md:hidden items-center justify-between py-3">
            <Link href="/" className="flex items-center">
              <div className={`relative transition-all duration-500 ease-out ${isScrolled ? "h-10" : "h-11"} w-auto`}>
                <Image
                  src="/logo.png"
                  alt="Property by TA168"
                  height={44}
                  width={132}
                  className="object-contain h-full w-auto"
                  unoptimized
                />
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#eb3838] text-white text-sm font-medium rounded-lg hover:bg-[#d32f2f] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t("contact")}</span>
              </Link>
              <LanguageSwitcher variant={isScrolled || !transparent ? "dark" : "light"} compact />
              <button
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled || !transparent
                    ? "hover:bg-gray-100 text-gray-700"
                    : "hover:bg-white/10 text-white"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute left-0 block h-0.5 w-5 transform transition-all duration-200 ${
                    isScrolled || !transparent ? "bg-gray-700" : "bg-white"
                  } ${mobileMenuOpen ? "top-2.5 rotate-45" : "top-1"}`} />
                  <span className={`absolute left-0 top-2.5 block h-0.5 w-5 transition-all duration-200 ${
                    isScrolled || !transparent ? "bg-gray-700" : "bg-white"
                  } ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                  <span className={`absolute left-0 block h-0.5 w-5 transform transition-all duration-200 ${
                    isScrolled || !transparent ? "bg-gray-700" : "bg-white"
                  } ${mobileMenuOpen ? "top-2.5 -rotate-45" : "top-4"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-60 md:hidden transition-all duration-300 ${
        mobileMenuOpen ? "block" : "hidden"
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel - Light Mode */}
        <div className={`absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-white shadow-xl transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logo */}
          <div className="pt-16 px-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Property by TA168"
                width={140}
                height={46}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Nav Links */}
          <div className="px-4 py-6 space-y-1">
            {allNavLinks.filter(link => link.href !== "/map-search").map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-[#eb3838] rounded-lg transition-all duration-200 font-medium text-sm ${
                  mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: mobileMenuOpen ? `${index * 40 + 80}ms` : "0ms" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Contact Button in Mobile Menu */}
            <Link
              href="/contact"
              className={`block py-3 px-4 mt-4 bg-[#eb3838] text-white text-center rounded-lg font-medium text-sm hover:bg-[#d32f2f] transition-all duration-200 ${
                mobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${allNavLinks.length * 40 + 120}ms` : "0ms" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("contact")}
            </Link>
          </div>

          {/* Red accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#eb3838]" />
        </div>
      </div>
    </>
  );
}
