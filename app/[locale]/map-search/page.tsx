"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { NainaHubProperty } from "@/lib/nainahub";

type Property = NainaHubProperty;

// Dynamically import the map component to avoid SSR issues
const PropertyMap = dynamic(() => import("@/components/map/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function MapSearchPage() {
  const t = useTranslations();
  const locale = useLocale();

  // Helper functions for language-based field selection
  const useEnglish = locale === "en" || locale === "zh";
  const getProjectName = (project: { projectNameTh?: string; projectNameEn?: string } | null | undefined) => {
    if (!project) return "";
    return useEnglish
      ? (project.projectNameEn || project.projectNameTh || "")
      : (project.projectNameTh || project.projectNameEn || "");
  };
  const getPropertyTitle = (property: { propertyTitleTh?: string; propertyTitleEn?: string }) => {
    return useEnglish
      ? (property.propertyTitleEn || property.propertyTitleTh || "")
      : (property.propertyTitleTh || property.propertyTitleEn || "");
  };

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Map state
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.7883, 98.9853]); // Chiang Mai center
  const [mapZoom, setMapZoom] = useState(12);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop (lg breakpoint = 1024px)
  // This prevents the map from rendering on mobile which causes LatLng errors
  const checkIsDesktop = useCallback(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, [checkIsDesktop]);

  // Filter drawer state (for mobile/tablet)
  const [filterOpen, setFilterOpen] = useState(false);

  // Filters (user input - not applied until search button clicked)
  const [searchText, setSearchText] = useState<string>("");
  const [subPropertyType, setSubPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minSize, setMinSize] = useState<string>("");
  const [maxSize, setMaxSize] = useState<string>("");

  // Applied filters (actually used for filtering)
  const [appliedSearchText, setAppliedSearchText] = useState<string>("");
  const [appliedSubPropertyType, setAppliedSubPropertyType] = useState<string>("");
  const [appliedListingType, setAppliedListingType] = useState<string>("");
  const [appliedBedrooms, setAppliedBedrooms] = useState<string>("");
  const [appliedBathrooms, setAppliedBathrooms] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<string>("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<string>("");
  const [appliedMinSize, setAppliedMinSize] = useState<string>("");
  const [appliedMaxSize, setAppliedMaxSize] = useState<string>("");

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/nainahub/properties?limit=100");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data.data);
        setFilteredProperties(data.data);
      } catch (error) {
        console.error("Error loading properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Apply filters - only uses "applied" filter states
  useEffect(() => {
    let filtered = [...properties];

    // Filter by search text
    if (appliedSearchText) {
      const searchLower = appliedSearchText.toLowerCase();
      filtered = filtered.filter((p) => {
        // If no property type filter selected (ทั้งหมด), search ALL fields
        if (!appliedSubPropertyType || appliedSubPropertyType === "" || appliedSubPropertyType === "all") {
          return (
            // Search project fields
            p.project?.projectNameEn?.toLowerCase().includes(searchLower) ||
            p.project?.projectNameTh?.toLowerCase().includes(searchLower) ||
            p.project?.projectLocationText?.toLowerCase().includes(searchLower) ||
            // AND property fields
            p.propertyTitleEn?.toLowerCase().includes(searchLower) ||
            p.propertyTitleTh?.toLowerCase().includes(searchLower) ||
            p.propertyLocationText?.toLowerCase().includes(searchLower)
          );
        }
        // If specific property type selected, use conditional logic
        else {
          // If property type is Condo, search in project fields
          if (p.propertyType === "Condo") {
            return (
              p.project?.projectNameEn?.toLowerCase().includes(searchLower) ||
              p.project?.projectNameTh?.toLowerCase().includes(searchLower) ||
              p.project?.projectLocationText?.toLowerCase().includes(searchLower)
            );
          }
          // For other property types, search in property fields
          else {
            return (
              p.propertyTitleEn?.toLowerCase().includes(searchLower) ||
              p.propertyTitleTh?.toLowerCase().includes(searchLower) ||
              p.propertyLocationText?.toLowerCase().includes(searchLower)
            );
          }
        }
      });
    }

    // Filter by subPropertyType if selected
    if (appliedSubPropertyType && appliedSubPropertyType !== "all") {
      filtered = filtered.filter((p) => p.propertyType === appliedSubPropertyType);
    }

    if (appliedListingType && appliedListingType !== "all") {
      if (appliedListingType === "rent") {
        filtered = filtered.filter((p) => p.rentalRateNum && p.rentalRateNum > 0);
      } else if (appliedListingType === "sale") {
        filtered = filtered.filter((p) => p.sellPriceNum && p.sellPriceNum > 0);
      }
    }

    if (appliedBedrooms && appliedBedrooms !== "all") {
      const bedroomNum = parseInt(appliedBedrooms);
      // For 5+, use >= ; otherwise use exact match
      if (bedroomNum >= 5) {
        filtered = filtered.filter((p) => p.bedRoomNum >= bedroomNum);
      } else {
        filtered = filtered.filter((p) => p.bedRoomNum === bedroomNum);
      }
    }

    if (appliedBathrooms && appliedBathrooms !== "all") {
      const bathroomNum = parseInt(appliedBathrooms);
      // For 4+, use >= ; otherwise use exact match
      if (bathroomNum >= 4) {
        filtered = filtered.filter((p) => p.bathRoomNum >= bathroomNum);
      } else {
        filtered = filtered.filter((p) => p.bathRoomNum === bathroomNum);
      }
    }

    if (appliedMinPrice) {
      const min = parseInt(appliedMinPrice);
      filtered = filtered.filter((p) => {
        const price = p.rentalRateNum || p.sellPriceNum || 0;
        return price >= min;
      });
    }

    if (appliedMaxPrice) {
      const max = parseInt(appliedMaxPrice);
      filtered = filtered.filter((p) => {
        const price = p.rentalRateNum || p.sellPriceNum || 0;
        return price <= max;
      });
    }

    if (appliedMinSize) {
      const min = parseInt(appliedMinSize);
      filtered = filtered.filter((p) => {
        const size = p.usableAreaSqm || p.roomSizeNum || 0;
        return size >= min;
      });
    }

    if (appliedMaxSize) {
      const max = parseInt(appliedMaxSize);
      filtered = filtered.filter((p) => {
        const size = p.usableAreaSqm || p.roomSizeNum || 0;
        return size <= max;
      });
    }

    setFilteredProperties(filtered);
  }, [properties, appliedSearchText, appliedSubPropertyType, appliedListingType, appliedBedrooms, appliedBathrooms, appliedMinPrice, appliedMaxPrice, appliedMinSize, appliedMaxSize]);

  // Handle search button click - apply all filters
  const handleApplySearch = () => {
    setAppliedSearchText(searchText);
    setAppliedSubPropertyType(subPropertyType);
    setAppliedListingType(listingType);
    setAppliedBedrooms(bedrooms);
    setAppliedBathrooms(bathrooms);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setAppliedMinSize(minSize);
    setAppliedMaxSize(maxSize);
    setFilterOpen(false); // Close filter drawer after applying
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  const getSize = (property: Property) => {
    if (property.propertyType === "Condo") {
      return property.roomSizeNum ? `${property.roomSizeNum}` : "-";
    }
    return property.usableAreaSqm ? `${property.usableAreaSqm}` : "-";
  };

  const handleClearFilters = () => {
    // Clear user input states
    setSearchText("");
    setSubPropertyType("");
    setListingType("");
    setBedrooms("");
    setBathrooms("");
    setMinPrice("");
    setMaxPrice("");
    setMinSize("");
    setMaxSize("");

    // Clear applied filter states
    setAppliedSearchText("");
    setAppliedSubPropertyType("");
    setAppliedListingType("");
    setAppliedBedrooms("");
    setAppliedBathrooms("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
    setAppliedMinSize("");
    setAppliedMaxSize("");
  };

  const handlePropertyClick = (property: Property) => {
    // Determine which coordinates to use based on property type
    let lat: number | undefined;
    let lng: number | undefined;

    if (
      property.propertyType === "Condo" &&
      property.project?.projectLatitude &&
      property.project?.projectLongitude
    ) {
      // Use project coordinates for Condos with project location
      lat = property.project.projectLatitude;
      lng = property.project.projectLongitude;
    } else if (property.latitude && property.longitude) {
      // Use property coordinates for all other cases
      lat = property.latitude;
      lng = property.longitude;
    }

    // Only update map center if we have valid coordinates
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      setMapCenter([lat, lng]);
      setMapZoom(16); // Close zoom level to see the property clearly
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mobile Filter Button - Shows on mobile and tablet */}
      <div className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-white border-b border-gray-200 p-3 shadow-md">
        <Button
          onClick={() => setFilterOpen(true)}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>{t("search.filters")}</span>
          <span className="ml-auto text-xs text-gray-600">
            {filteredProperties.length} {t("common.properties")}
          </span>
        </Button>
      </div>

      {/* Filters - Fixed at Top (Desktop only - lg and above) */}
      <div className="hidden lg:block fixed top-16 left-0 right-0 z-60 bg-white border-b border-gray-200 p-4 shadow-md pointer-events-auto" style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto" style={{ overflow: 'visible' }}>
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5 text-[#C9A227]" />
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                  {t("search.filters")}
                </h2>
                <span className="hidden sm:inline text-xs md:text-sm text-gray-600">
                  {filteredProperties.length} {t("common.properties")} {t("search.found")}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-[#C9A227] hover:text-[#C9A227]/80"
              >
                {t("search.clearAll")}
              </Button>
            </div>

            {/* Filter Controls - Horizontal Layout */}
            <div className="grid grid-cols-2 lg:grid-cols-9 gap-2 pb-2 items-end">
              {/* Search Input */}
              <div className="col-span-2 lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t("search.search")}
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t("searchPage.searchPlaceholder")}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApplySearch();
                      }
                    }}
                    className="h-9 pl-8 bg-white border-gray-300 text-gray-900 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t("search.propertyType")}
                </label>
                <Select value={subPropertyType} onValueChange={setSubPropertyType}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-9 text-sm">
                    <SelectValue placeholder={t("search.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.all")}</SelectItem>

                    <SelectSeparator />
                    <SelectLabel>{t("propertyTypes.main.living")}</SelectLabel>
                    <SelectItem value="Condo">{t("search.condo")}</SelectItem>
                    <SelectItem value="Townhouse">{t("search.townhouse")}</SelectItem>
                    <SelectItem value="SingleHouse">{t("search.singleHouse")}</SelectItem>
                    <SelectItem value="Villa">{t("search.villa")}</SelectItem>

                    <SelectSeparator />
                    <SelectLabel>{t("propertyTypes.main.land")}</SelectLabel>
                    <SelectItem value="Land">{t("search.land")}</SelectItem>

                    <SelectSeparator />
                    <SelectLabel>{t("propertyTypes.main.commercial")}</SelectLabel>
                    <SelectItem value="Office">{t("search.office")}</SelectItem>
                    <SelectItem value="Store">{t("search.store")}</SelectItem>
                    <SelectItem value="Factory">{t("search.factory")}</SelectItem>
                    <SelectItem value="Hotel">{t("search.hotel")}</SelectItem>
                    <SelectItem value="Building">{t("search.building")}</SelectItem>
                    <SelectItem value="Apartment">{t("search.apartment")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Listing Type */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t("search.listingType")}
                </label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-9 text-sm">
                    <SelectValue placeholder={t("search.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.all")}</SelectItem>
                    <SelectItem value="rent">{t("search.forRent")}</SelectItem>
                    <SelectItem value="sale">{t("search.forSale")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms / Bathrooms Combined */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t("search.bedroomsAndBathrooms")}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-9 text-sm">
                        <SelectValue placeholder={t("search.beds")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("search.all")}</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Select value={bathrooms} onValueChange={setBathrooms}>
                      <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 h-9 text-sm">
                        <SelectValue placeholder={t("search.baths")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("search.all")}</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Price Range Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t("search.priceRange")}
                </label>
                <Select
                  value={minPrice && maxPrice ? `${minPrice}-${maxPrice}` : minPrice ? `${minPrice}-` : maxPrice ? `-${maxPrice}` : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setMinPrice("");
                      setMaxPrice("");
                    } else {
                      const [min, max] = value.split("-");
                      setMinPrice(min || "");
                      setMaxPrice(max || "");
                    }
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-9 text-sm">
                    <SelectValue placeholder={t("search.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.all")}</SelectItem>
                    <SelectItem value="-5000">&lt; 5,000</SelectItem>
                    <SelectItem value="5000-10000">5,000 - 10,000</SelectItem>
                    <SelectItem value="10000-20000">10,000 - 20,000</SelectItem>
                    <SelectItem value="20000-30000">20,000 - 30,000</SelectItem>
                    <SelectItem value="30000-50000">30,000 - 50,000</SelectItem>
                    <SelectItem value="50000-">&gt; 50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size Range Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t("search.sizeSqm")}
                </label>
                <Select
                  value={minSize && maxSize ? `${minSize}-${maxSize}` : minSize ? `${minSize}-` : maxSize ? `-${maxSize}` : "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setMinSize("");
                      setMaxSize("");
                    } else {
                      const [min, max] = value.split("-");
                      setMinSize(min || "");
                      setMaxSize(max || "");
                    }
                  }}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-9 text-sm">
                    <SelectValue placeholder={t("search.all")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.all")}</SelectItem>
                    <SelectItem value="-30">&lt; 30</SelectItem>
                    <SelectItem value="30-50">30 - 50</SelectItem>
                    <SelectItem value="50-80">50 - 80</SelectItem>
                    <SelectItem value="80-100">80 - 100</SelectItem>
                    <SelectItem value="100-150">100 - 150</SelectItem>
                    <SelectItem value="150-">&gt; 150</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="col-span-2 lg:col-span-1">
                <Button
                  onClick={handleApplySearch}
                  className="h-9 w-full bg-[#C9A227] hover:bg-[#A88B1F] text-white px-4"
                >
                  <Search className="w-4 h-4 mr-2" />
                  ค้นหา
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Mobile Filter Drawer */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="overflow-y-auto max-h-[85vh] p-0">
          <SheetHeader className="sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#C9A227]" />
                {t("search.filters")}
              </SheetTitle>
              <SheetClose />
            </div>
          </SheetHeader>

          <div className="p-4 space-y-6">
            {/* Filter Count */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                {filteredProperties.length} {t("common.properties")} {t("search.found")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-[#C9A227] hover:text-[#C9A227]/80"
              >
                {t("search.clearAll")}
              </Button>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.propertyType")}
              </label>
              <Select value={subPropertyType} onValueChange={setSubPropertyType}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder={t("search.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("search.all")}</SelectItem>

                  <SelectSeparator />
                  <SelectLabel>{t("propertyTypes.main.living")}</SelectLabel>
                  <SelectItem value="Condo">{t("search.condo")}</SelectItem>
                  <SelectItem value="Townhouse">{t("search.townhouse")}</SelectItem>
                  <SelectItem value="SingleHouse">{t("search.singleHouse")}</SelectItem>
                  <SelectItem value="Villa">{t("search.villa")}</SelectItem>

                  <SelectSeparator />
                  <SelectLabel>{t("propertyTypes.main.land")}</SelectLabel>
                  <SelectItem value="Land">{t("search.land")}</SelectItem>

                  <SelectSeparator />
                  <SelectLabel>{t("propertyTypes.main.commercial")}</SelectLabel>
                  <SelectItem value="Office">{t("search.office")}</SelectItem>
                  <SelectItem value="Store">{t("search.store")}</SelectItem>
                  <SelectItem value="Factory">{t("search.factory")}</SelectItem>
                  <SelectItem value="Hotel">{t("search.hotel")}</SelectItem>
                  <SelectItem value="Building">{t("search.building")}</SelectItem>
                  <SelectItem value="Apartment">{t("search.apartment")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Listing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.listingType")}
              </label>
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value="rent">{t("search.forRent")}</SelectItem>
                  <SelectItem value="sale">{t("search.forSale")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.bedrooms")}
              </label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.bathrooms")}
              </label>
              <Select value={bathrooms} onValueChange={setBathrooms}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder={t("common.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.priceRange")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={t("search.min")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
                <Input
                  type="number"
                  placeholder={t("search.max")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Size Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("search.sizeRange")} ({t("common.sqm")})
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder={t("search.min")}
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
                <Input
                  type="number"
                  placeholder={t("search.max")}
                  value={maxSize}
                  onChange={(e) => setMaxSize(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Apply Button */}
            <Button
              onClick={handleApplySearch}
              variant="gold"
              className="w-full"
            >
              {t("search.applyFilters")} ({filteredProperties.length})
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content - Map (Left) and Cards (Right) */}
      <div className="pt-32 lg:pt-[240px] min-h-screen">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-320px)] lg:h-[calc(100vh-240px)]">
          {/* Left - Map (Only render on desktop to prevent Leaflet LatLng errors on mobile) */}
          {isDesktop && (
            <div className="lg:w-1/2 relative lg:h-auto">
              {!loading &&
                mapCenter &&
                Array.isArray(mapCenter) &&
                mapCenter.length === 2 &&
                typeof mapCenter[0] === 'number' &&
                typeof mapCenter[1] === 'number' &&
                !isNaN(mapCenter[0]) &&
                !isNaN(mapCenter[1]) &&
                isFinite(mapCenter[0]) &&
                isFinite(mapCenter[1]) && (
                <PropertyMap
                  properties={filteredProperties}
                  center={mapCenter}
                  zoom={mapZoom}
                  formatPrice={formatPrice}
                  getSize={getSize}
                  t={t}
                />
              )}

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <p className="text-gray-600">{t("common.loading")}</p>
                </div>
              )}
            </div>
          )}

          {/* Right - Property Cards */}
          <div className="w-full lg:w-1/2 bg-gray-50 overflow-y-auto">
            <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {/* Skeleton Loading */}
              {loading && (
                <>
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="block animate-pulse">
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        {/* Image Skeleton */}
                        <div className="h-48 bg-gray-200" />
                        {/* Content Skeleton */}
                        <div className="p-4">
                          {/* Project name */}
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                          {/* Title */}
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                          {/* Specs */}
                          <div className="flex gap-3 mb-3 pb-3 border-b border-gray-100">
                            <div className="h-4 bg-gray-200 rounded w-12" />
                            <div className="h-4 bg-gray-200 rounded w-12" />
                            <div className="h-4 bg-gray-200 rounded w-16" />
                          </div>
                          {/* Price */}
                          <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                          {/* Code */}
                          <div className="h-3 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Property Cards */}
              {!loading && filteredProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => handlePropertyClick(property)}
                  className="block"
                >
                  <div className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-[#C9A227]/50 rounded-lg">
                    {/* Property Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {property.imageUrls && property.imageUrls.length > 0 ? (
                        <Image
                          src={property.imageUrls[0]}
                          alt={getPropertyTitle(property)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <MapPin className="w-12 h-12 text-gray-500" />
                        </div>
                      )}

                      {/* Property Type Badge */}
                      <div className="absolute top-2 left-2">
                        <div className="bg-[#C9A227] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {property.propertyType === "Condo"
                            ? t("search.condo")
                            : property.propertyType === "Townhouse"
                            ? t("search.townhouse")
                            : property.propertyType === "SingleHouse"
                            ? t("search.singleHouse")
                            : property.propertyType === "Villa"
                            ? t("search.villa")
                            : property.propertyType === "Land"
                            ? t("search.land")
                            : property.propertyType === "Office"
                            ? t("search.office")
                            : property.propertyType === "Store"
                            ? t("search.store")
                            : property.propertyType === "Factory"
                            ? t("search.factory")
                            : property.propertyType === "Hotel"
                            ? t("search.hotel")
                            : property.propertyType === "Building"
                            ? t("search.building")
                            : property.propertyType === "Apartment"
                            ? t("search.apartment")
                            : property.propertyType}
                        </div>
                      </div>

                      {/* Listing Type Badge */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {property.rentalRateNum != null && property.rentalRateNum > 0 && (
                          <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {t("property.forRent")}
                          </div>
                        )}
                        {property.sellPriceNum != null && property.sellPriceNum > 0 && (
                          <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                            {t("property.forSale")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="p-4">
                      {property.project && (
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {getProjectName(property.project)}
                        </div>
                      )}

                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#C9A227] transition-colors">
                        {getPropertyTitle(property)}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3 h-3 text-[#C9A227]" />
                          <span className="font-semibold">{property.bedRoomNum}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3 h-3 text-[#C9A227]" />
                          <span className="font-semibold">{property.bathRoomNum}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="w-3 h-3 text-[#C9A227]" />
                          <span className="font-semibold">
                            {getSize(property)} {t("common.sqm")}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        {property.rentalRateNum != null && property.rentalRateNum > 0 && (
                          <div className="text-lg font-bold text-[#C9A227]">
                            <span className="text-xs font-normal text-gray-500 mr-1">
                              {t("property.forRent")}:
                            </span>
                            ฿{formatPrice(property.rentalRateNum)}
                            <span className="text-xs font-normal text-gray-400">
                              {t("property.perMonth")}
                            </span>
                          </div>
                        )}
                        {property.sellPriceNum != null && property.sellPriceNum > 0 && (
                          <div
                            className={`font-bold text-[#C9A227] ${
                              property.rentalRateNum != null && property.rentalRateNum > 0
                                ? "text-sm mt-1"
                                : "text-lg"
                            }`}
                          >
                            <span className="text-xs font-normal text-gray-500 mr-1">
                              {t("property.forSale")}:
                            </span>
                            ฿{formatPrice(property.sellPriceNum)}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-400 mt-2">
                        {t("common.code")}: {property.agentPropertyCode}
                      </div>

                      <Link href={`/property/${property.id}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white"
                        >
                          {t("property.viewDetails")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && filteredProperties.length === 0 && (
                <div className="col-span-1 lg:col-span-2 text-center py-12">
                  <p className="text-gray-400">{t("search.noResults")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
