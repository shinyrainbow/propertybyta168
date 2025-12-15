"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useState, useRef, useEffect, useTransition } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
  compact?: boolean;
}

export default function LanguageSwitcher({
  variant = "dark",
  compact = false,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const textColor =
    variant === "light"
      ? "text-white hover:text-white/80"
      : "text-gray-700 hover:text-[#C9A227]";

  const bgColor =
    variant === "light"
      ? "bg-white/10 hover:bg-white/20"
      : "bg-white hover:bg-gray-50";

  const dropdownBg = "bg-white";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${bgColor} ${textColor} ${isPending ? "opacity-50" : ""}`}
      >
        {compact ? (
          <>
            <span className="text-lg">{localeFlags[locale]}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        ) : (
          <>
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{localeNames[locale]}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-40 rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 z-100 ${dropdownBg} ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            disabled={isPending}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
              locale === loc
                ? "bg-[#C9A227]/10 text-[#C9A227]"
                : "hover:bg-gray-50 text-gray-700"
            } ${isPending ? "opacity-50" : ""}`}
          >
            <span className="text-lg">{localeFlags[loc]}</span>
            <span className="text-sm font-medium">{localeNames[loc]}</span>
            {locale === loc && (
              <span className="ml-auto text-[#C9A227]">&#10003;</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
