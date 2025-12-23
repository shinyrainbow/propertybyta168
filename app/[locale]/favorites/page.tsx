"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Trash2,
  Search,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { type NainaHubProperty, getPropertyAddressString } from "@/lib/nainahub";
import { generatePropertySlug } from "@/lib/slug";

type Property = NainaHubProperty;

export default function FavoritesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { favorites, removeFavorite, isLoaded } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const useEnglish = locale === "en" || locale === "zh";
  const getPropertyTitle = (property: Property) => {
    return useEnglish
      ? property.propertyTitleEn || property.propertyTitleTh || ""
      : property.propertyTitleTh || property.propertyTitleEn || "";
  };

  const getProjectName = (project: { projectNameTh?: string; projectNameEn?: string } | null | undefined) => {
    if (!project) return "";
    return useEnglish
      ? project.projectNameEn || project.projectNameTh || ""
      : project.projectNameTh || project.projectNameEn || "";
  };

  const getTimeAgo = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return t("property.justNow");
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return minutes === 1 ? t("property.minuteAgo") : t("property.minutesAgo", { count: minutes });
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return hours === 1 ? t("property.hourAgo") : t("property.hoursAgo", { count: hours });
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return days === 1 ? t("property.dayAgo") : t("property.daysAgo", { count: days });
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return weeks === 1 ? t("property.weekAgo") : t("property.weeksAgo", { count: weeks });
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return months === 1 ? t("property.monthAgo") : t("property.monthsAgo", { count: months });
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return years === 1 ? t("property.yearAgo") : t("property.yearsAgo", { count: years });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadFavoriteProperties = async () => {
      if (!isLoaded) return;

      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all properties and filter by favorites
        const response = await fetch("/api/nainahub/properties?limit=500");
        if (!response.ok) throw new Error("Failed to fetch properties");

        const data = await response.json();
        const favoriteProperties = data.data.filter((p: Property) =>
          favorites.includes(p.id)
        );
        setProperties(favoriteProperties);
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProperties();
  }, [favorites, isLoaded]);

  const formatPrice = (price: number | null | undefined) => {
    if (!price || price <= 0 || isNaN(price)) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getValidPrice = (property: Property) => {
    const rent = property.rentalRateNum;
    const sale = property.sellPriceNum;
    if (rent && rent > 0 && !isNaN(rent)) return { price: rent, isRent: true };
    if (sale && sale > 0 && !isNaN(sale)) return { price: sale, isRent: false };
    return null;
  };

  const getSize = (property: Property) => {
    if (property.propertyType === "Condo") {
      return property.roomSizeNum ? `${property.roomSizeNum}` : "-";
    }
    return property.usableAreaSqm ? `${property.usableAreaSqm}` : "-";
  };

  const handleRemove = (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(propertyId);
    toast.success(t("favoritesPage.remove"));
  };

  const handleClearAll = () => {
    if (window.confirm(t("favoritesPage.clearConfirm"))) {
      favorites.forEach((id) => removeFavorite(id));
      toast.success(t("favoritesPage.clearAll"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`text-center transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="w-20 h-1 bg-[#eb3838] mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {t("favoritesPage.title")}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {t("favoritesPage.subtitle")}
            </p>
            {properties.length > 0 && (
              <p className="mt-4 text-gray-500">
                {properties.length} {properties.length === 1 ? t("favoritesPage.property") : t("favoritesPage.properties")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Favorites Content */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[#eb3838] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            /* Empty State */
            <div
              className={`text-center py-16 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("favoritesPage.noFavorites")}
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t("favoritesPage.noFavoritesDesc")}
              </p>
              <Link href="/search">
                <Button className="!bg-[#eb3838] !text-white hover:!bg-[#d32f2f] px-8 py-6 text-lg font-semibold rounded-xl">
                  <Search className="w-5 h-5 mr-2" />
                  {t("favoritesPage.browseProperties")}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Clear All Button */}
              {properties.length > 1 && (
                <div className="flex justify-end mb-6">
                  <Button
                    variant="outline"
                    onClick={handleClearAll}
                    className="text-gray-500 hover:text-[#eb3838] hover:border-[#eb3838]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("favoritesPage.clearAll")}
                  </Button>
                </div>
              )}

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property, index) => {
                  const priceInfo = getValidPrice(property);

                  return (
                    <Link
                      key={property.id}
                      href={`/property/${generatePropertySlug(property, locale)}`}
                      className={`group block transition-all duration-500 ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#eb3838]/20">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={property.imageUrls[0] || "/placeholder.jpg"}
                            alt={getPropertyTitle(property)}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                          {/* Status Badge */}
                          <div className="absolute top-3 left-3">
                            {property.rentalRateNum && property.rentalRateNum > 0 ? (
                              <span className="px-3 py-1 bg-[#eb3838] text-white text-xs font-medium rounded-md">
                                {t("property.forRent")}
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-md">
                                {t("property.forSale")}
                              </span>
                            )}
                          </div>

                          {/* Remove Favorite Button */}
                          <button
                            onClick={(e) => handleRemove(property.id, e)}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                          >
                            <Heart className="w-5 h-5 fill-[#eb3838] text-[#eb3838]" />
                          </button>

                          {/* Price */}
                          {priceInfo && (
                            <div className="absolute bottom-3 left-3 right-3">
                              <p className="text-white font-bold text-lg drop-shadow-lg">
                                {formatPrice(priceInfo.price)}
                                {priceInfo.isRent && (
                                  <span className="text-sm font-normal">
                                    {" "}
                                    {t("property.perMonth")}
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#eb3838] transition-colors">
                            {getPropertyTitle(property) || getProjectName(property.project)}
                          </h3>

                          {getPropertyAddressString(property, locale) && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {getPropertyAddressString(property, locale)}
                              </span>
                            </div>
                          )}

                          {/* Features */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {property.bedRoomNum !== undefined && property.bedRoomNum > 0 && (
                              <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4 text-gray-400" />
                                <span>{property.bedRoomNum}</span>
                              </div>
                            )}
                            {property.bathRoomNum !== undefined && property.bathRoomNum > 0 && (
                              <div className="flex items-center gap-1">
                                <Bath className="w-4 h-4 text-gray-400" />
                                <span>{property.bathRoomNum}</span>
                              </div>
                            )}
                            {getSize(property) !== "-" && (
                              <div className="flex items-center gap-1">
                                <Maximize className="w-4 h-4 text-gray-400" />
                                <span>{getSize(property)} {t("property.sqm")}</span>
                              </div>
                            )}
                          </div>

                          {/* Time Ago */}
                          {property.updatedAt && (
                            <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{t("property.updated")} {getTimeAgo(property.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button
                size="lg"
                className="w-full sm:w-auto !bg-[#eb3838] !text-white hover:!bg-[#d32f2f] px-8 py-6 text-lg font-semibold rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                {t("favoritesPage.browseProperties")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold rounded-xl"
              >
                {t("nav.contact")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
