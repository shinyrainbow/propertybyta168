"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useFavorites } from "@/hooks/useFavorites";
import {
  Heart,
  Bed,
  Bath,
  Maximize,
  Train,
  Building2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Images,
  CheckCircle,
  Clock,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { generatePropertySlug } from "@/lib/slug";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    titleTh?: string;
    location: string;
    locationTh?: string;
    images: string[];
    rentPrice?: number;
    salePrice?: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    propertyType: string;
    listingType: "rent" | "sale" | "both";
    furnishing?: string;
    floor?: string;
    nearbyBts?: string;
    nearbyBtsDistance?: number;
    isVerified?: boolean;
    isAvailableToday?: boolean;
    isExclusive?: boolean;
    isFeatured?: boolean;
    updatedAt?: string;
    // Fields for SEO-friendly slug generation
    agentPropertyCode?: string;
    rentalRateNum?: number;
    sellPriceNum?: number;
    project?: {
      projectNameTh?: string;
      projectNameEn?: string;
    };
    propertyDistrict?: string;
  };
  locale?: string;
}

export default function PropertyCard({ property, locale = "th" }: PropertyCardProps) {
  const t = useTranslations("property");
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.images?.length > 0 ? property.images : ["/placeholder-property.jpg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const displayTitle = locale === "th" && property.titleTh ? property.titleTh : property.title;
  const displayLocation = locale === "th" && property.locationTh ? property.locationTh : property.location;

  const getTimeAgo = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t("justNow");
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return minutes === 1 ? t("minuteAgo") : t("minutesAgo", { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return hours === 1 ? t("hourAgo") : t("hoursAgo", { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return days === 1 ? t("dayAgo") : t("daysAgo", { count: days });
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return weeks === 1 ? t("weekAgo") : t("weeksAgo", { count: weeks });
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return months === 1 ? t("monthAgo") : t("monthsAgo", { count: months });
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return years === 1 ? t("yearAgo") : t("yearsAgo", { count: years });
    }
  };

  // Generate slug with fallback to ID if required fields are missing
  const propertySlug = property.agentPropertyCode
    ? generatePropertySlug(property, locale)
    : property.id;

  return (
    <Link href={`/property/${propertySlug}`}>
      <div
        className="property-card bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Confirmed Available Today Badge */}
            {property.isAvailableToday && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e] text-white text-xs font-semibold rounded-full shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{t("confirmedAvailable")}</span>
              </div>
            )}
            {/* Verified Badge */}
            {property.isVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900/90 text-white text-xs font-medium rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t("verified")}</span>
              </div>
            )}
          </div>

          {/* Image Count Badge */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900/70 text-white text-xs rounded-lg">
              <Images className="w-4 h-4" />
              <span>{images.length}</span>
            </div>
          )}

          {/* Image Navigation Arrows */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-md hover:bg-white transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full shadow-md hover:bg-white transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`transition-all duration-200 ${
                    index === currentImageIndex
                      ? "w-5 h-2 bg-[#eb3838] rounded-full"
                      : "w-2 h-2 bg-white/70 rounded-full hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title Row with Heart */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 flex-1">
              {displayTitle}
            </h3>
            <button
              onClick={handleToggleFavorite}
              className="flex-shrink-0 p-1"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isFavorite(property.id) ? "fill-[#eb3838] text-[#eb3838]" : "text-gray-300 hover:text-gray-400"
                }`}
              />
            </button>
          </div>

          {/* Location */}
          <p className="text-sm text-gray-500 mb-3">{displayLocation}</p>

          {/* Price */}
          <div className="mb-4">
            {property.rentPrice && property.rentPrice > 0 && (
              <div className="text-2xl font-bold text-gray-900">
                ฿{property.rentPrice.toLocaleString()}
                <span className="text-base font-normal text-gray-500">/{t("month")}</span>
              </div>
            )}
            {property.salePrice && property.salePrice > 0 && !property.rentPrice && (
              <div className="text-2xl font-bold text-gray-900">
                ฿{property.salePrice.toLocaleString()}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4" />

          {/* Property Details Grid - 2x3 */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Row 1 */}
            <div className="flex items-center gap-2 text-gray-600">
              <Bed className="w-5 h-5 text-gray-400" />
              <span>{property.bedrooms} {t("bedrooms")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Bath className="w-5 h-5 text-gray-400" />
              <span>{property.bathrooms} {t("bathrooms")}</span>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-2 text-gray-600">
              <Maximize className="w-5 h-5 text-gray-400" />
              <span>{property.area} m²</span>
            </div>
            {property.nearbyBts ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Train className="w-5 h-5 text-gray-400" />
                <span className="truncate">
                  {property.nearbyBtsDistance && `${property.nearbyBtsDistance}m `}
                  {t("to")} {property.nearbyBts}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-600">
                <Train className="w-5 h-5 text-gray-400" />
                <span>-</span>
              </div>
            )}

            {/* Row 3 */}
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="w-5 h-5 text-gray-400" />
              <span>{property.propertyType}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Layers className="w-5 h-5 text-gray-400" />
              <span>{property.floor || "-"}</span>
            </div>
          </div>

          {/* Time Ago */}
          {property.updatedAt && (
            <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{t("updated")} {getTimeAgo(property.updatedAt)}</span>
            </div>
          )}

          {/* CTA Button */}
          <button className="w-full mt-5 py-3.5 bg-[#eb3838] text-white font-semibold rounded-xl hover:bg-[#d32f2f] transition-colors text-base">
            {t("inquireNow")}
          </button>
        </div>
      </div>
    </Link>
  );
}
