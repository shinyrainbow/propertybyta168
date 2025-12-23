"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Search,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  Building2,
  CheckCircle,
  Heart,
  Home,
  Phone,
  User,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import {
  type NainaHubProperty,
  type FetchPropertiesParams,
  type NainaHubResponse,
  getPropertyAddressString,
} from "@/lib/nainahub";
import { generatePropertySlug } from "@/lib/slug";

// Use NainaHub property type
type Property = NainaHubProperty;

interface Project {
  projectCode: string;
  projectNameEn: string;
  projectNameTh: string;
  count: number;
  image: string;
}

// Helper function to fetch properties from API route
async function fetchPropertiesFromAPI(params: FetchPropertiesParams = {}): Promise<NainaHubResponse> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.propertyType) searchParams.set("propertyType", params.propertyType);
  if (params.listingType) searchParams.set("listingType", params.listingType);
  if (params.bedrooms) searchParams.set("bedrooms", params.bedrooms.toString());
  if (params.minPrice) searchParams.set("minPrice", params.minPrice.toString());
  if (params.maxPrice) searchParams.set("maxPrice", params.maxPrice.toString());

  const url = `/api/nainahub/properties?${searchParams.toString()}`;
  console.log("🌐 Fetching from:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const { isFavorite, toggleFavorite } = useFavorites();

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

  // Read all filter params from URL
  const projectParam = searchParams.get("project") || "";
  const propertyTypeParam = searchParams.get("propertyType") || "";
  const listingTypeParam = searchParams.get("listingType") || "";
  const bedroomsParam = searchParams.get("bedrooms") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(projectParam);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Set default view mode based on screen size (list for mobile, grid for tablet/desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("list");
      }
    };
    // Check on mount
    handleResize();
  }, []);

  // Filters - initialized from URL params
  const [searchText, setSearchText] = useState<string>(searchParams.get("q") || "");
  const [propertyType, setPropertyType] = useState<string>(propertyTypeParam);
  const [listingType, setListingType] = useState<string>(listingTypeParam);
  const [bedrooms, setBedrooms] = useState<string>(bedroomsParam);
  const [minPrice, setMinPrice] = useState<string>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<string>(maxPriceParam);
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger for manual search
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    phone: "",
    budget: "",
    location: "",
    lineId: "",
    whatsapp: "",
    wechat: "",
    propertyType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build message with optional fields
      const messageParts = [];
      if (inquiryForm.budget) messageParts.push(`งบประมาณ: ${inquiryForm.budget}`);
      if (inquiryForm.location) messageParts.push(`ทำเลที่สนใจ: ${inquiryForm.location}`);
      if (inquiryForm.lineId) messageParts.push(`Line ID: ${inquiryForm.lineId}`);
      if (inquiryForm.whatsapp) messageParts.push(`WhatsApp: ${inquiryForm.whatsapp}`);
      if (inquiryForm.wechat) messageParts.push(`WeChat: ${inquiryForm.wechat}`);
      if (inquiryForm.propertyType) messageParts.push(`อสังหาริมทรัพย์: ${inquiryForm.propertyType}`);
      if (inquiryForm.message) messageParts.push(inquiryForm.message);

      const response = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryForm.name,
          phone: inquiryForm.phone,
          message: messageParts.length > 0 ? messageParts.join("\n") : null,
          source: "search-page",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sync state with URL params when they change (e.g., navigating from homepage)
  useEffect(() => {
    const newSearchText = searchParams.get("q") || "";
    const newProject = searchParams.get("project") || "";
    const newPropertyType = searchParams.get("propertyType") || "";
    const newListingType = searchParams.get("listingType") || "";
    const newBedrooms = searchParams.get("bedrooms") || "";
    const newMinPrice = searchParams.get("minPrice") || "";
    const newMaxPrice = searchParams.get("maxPrice") || "";

    setSearchText(newSearchText);
    setSelectedProject(newProject);
    setPropertyType(newPropertyType);
    setListingType(newListingType);
    setBedrooms(newBedrooms);
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);

    // Trigger search when URL params change (e.g., from header dropdown)
    setSearchTrigger(prev => prev + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);


  // Load properties from NainaHub API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use URL params directly for accurate filtering
        // Note: searchText is filtered client-side, not via API
        const currentPropertyType = searchParams.get("propertyType") || "";
        const currentListingType = searchParams.get("listingType") || "";
        const currentBedrooms = searchParams.get("bedrooms") || "";
        const currentMinPrice = searchParams.get("minPrice") || "";
        const currentMaxPrice = searchParams.get("maxPrice") || "";

        console.log("📡 Loading properties... searchTrigger:", searchTrigger);
        setLoading(true);
        // Note: We don't use q param for API because NainaHub's search doesn't work well
        // for location text. Instead, we fetch all and filter client-side.
        const params: FetchPropertiesParams = {
          limit: 1000, // Fetch all properties for client-side filtering
          ...(currentPropertyType && currentPropertyType !== "all" && { propertyType: currentPropertyType as any }),
          ...(currentListingType && currentListingType !== "all" && { listingType: currentListingType as any }),
          ...(currentBedrooms && currentBedrooms !== "all" && { bedrooms: parseInt(currentBedrooms) }),
          ...(currentMinPrice && { minPrice: parseInt(currentMinPrice) }),
          ...(currentMaxPrice && { maxPrice: parseInt(currentMaxPrice) }),
        };
        console.log("🚀 API call params:", params);
        const response = await fetchPropertiesFromAPI(params);
        console.log("✅ API response received:", response.data.length, "properties");

        // Filter out sold/rented - they should only appear in Recent Deals on homepage
        const activeProperties = response.data.filter(
          (p: NainaHubProperty) => p.status !== "sold" && p.status !== "rented"
        );
        setAllProperties(activeProperties);

        // Generate projects from active properties only
        const projectsMap = new Map<string, { count: number; image: string; project: any }>();
        activeProperties.forEach((property: NainaHubProperty) => {
          if (property.project) {
            const existing = projectsMap.get(property.projectCode);
            if (existing) {
              existing.count++;
            } else {
              projectsMap.set(property.projectCode, {
                count: 1,
                image: property.imageUrls[0] || "",
                project: property.project,
              });
            }
          }
        });

        const projectsArray: Project[] = Array.from(projectsMap.entries()).map(
          ([code, data]) => ({
            projectCode: code,
            projectNameEn: data.project.projectNameEn,
            projectNameTh: data.project.projectNameTh,
            count: data.count,
            image: data.image,
          })
        );

        setProjects(projectsArray);
      } catch (error) {
        console.error("Error loading properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger, searchParams.toString()]); // Search when searchTrigger or URL params change

  // Handle search button click
  const handleSearch = () => {
    console.log("🔍 Search button clicked! Current filters:", {
      searchText,
      propertyType,
      listingType,
      bedrooms,
      minPrice,
      maxPrice,
    });

    // Update URL with current filter values
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (selectedProject) params.set("project", selectedProject);
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
    if (listingType && listingType !== "all") params.set("listingType", listingType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });

    setSearchTrigger(prev => prev + 1);
  };

  // Filter properties based on selected project and search text (client-side)
  // Note: NainaHub API's q param doesn't search through location fields well,
  // so we do client-side filtering for search text
  useEffect(() => {
    let filtered = [...allProperties];

    // Filter by search text (client-side - searches through multiple fields)
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((p) => {
        const searchableText = [
          p.propertyTitleEn,
          p.propertyTitleTh,
          p.propertyLocationText,
          p.propertyLocationTextEn,
          p.project?.projectNameEn,
          p.project?.projectNameTh,
          p.project?.projectLocationText,
          p.project?.projectLocationTextEn,
          p.propertyDistrict,
          p.propertySubDistrict,
          p.propertyProvince,
          p.project?.addressDistrict,
          p.project?.addressSubDistrict,
          p.project?.addressProvince,
        ].filter(Boolean).join(" ").toLowerCase();

        return searchableText.includes(searchLower);
      });
    }

    // Filter by project (UI-only feature)
    if (selectedProject) {
      filtered = filtered.filter((p) => p.projectCode === selectedProject);
    }

    setProperties(filtered);
  }, [allProperties, selectedProject, searchText]);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  // Helper functions for comma-formatted price input
  const formatPriceInput = (value: string) => {
    // Remove non-digit characters
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    // Format with commas
    return new Intl.NumberFormat("th-TH").format(parseInt(numericValue));
  };

  const parsePriceInput = (formattedValue: string) => {
    // Remove commas to get raw number string
    return formattedValue.replace(/,/g, "");
  };

  const getSize = (property: Property) => {
    if (property.propertyType === "Condo") {
      return property.roomSizeNum ? `${property.roomSizeNum}` : "-";
    }
    return property.usableAreaSqm ? `${property.usableAreaSqm}` : "-";
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedProject("");
    setPropertyType("");
    setListingType("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
  };

  const handleProjectSelect = (projectCode: string) => {
    setSelectedProject(projectCode === selectedProject ? "" : projectCode);
  };

  // Get selected project for display
  const selectedProjectObj = projects.find(p => p.projectCode === selectedProject);

  // Get first property from selected project to extract location info
  const firstPropertyInProject = selectedProject
    ? properties.find(p => p.projectCode === selectedProject)
    : null;

  // Get location string from property/project
  const getLocationString = () => {
    if (!firstPropertyInProject) return "";
    const district = firstPropertyInProject.project?.addressDistrict || firstPropertyInProject.propertyDistrict || "";
    const subDistrict = firstPropertyInProject.project?.addressSubDistrict || firstPropertyInProject.propertySubDistrict || "";
    return [subDistrict, district].filter(Boolean).join(" ");
  };

  // Get listing type text based on filter and property type
  const getListingTypeText = () => {
    const isCondo = firstPropertyInProject?.propertyType === "Condo" || !firstPropertyInProject;
    if (listingType === "sale") {
      return isCondo ? t("searchPage.condoForSale") : t("searchPage.propertyForSale");
    }
    // Default to rent
    return isCondo ? t("searchPage.condoForRent") : t("searchPage.propertyForRent");
  };

  // Build H1 title for project page
  const getProjectH1 = () => {
    if (!selectedProjectObj) return t("searchPage.title");
    const projectNameEn = selectedProjectObj.projectNameEn || "";
    const projectNameTh = selectedProjectObj.projectNameTh || "";
    const listingText = getListingTypeText();
    const location = getLocationString();

    // Format: "The saint residences (เดอะ เซนต์ เรซิเดนเซส) – คอนโดให้เช่า ทําเล ลาดพร้าว จตุจักร"
    const projectDisplay = projectNameTh
      ? `${projectNameEn} (${projectNameTh})`
      : projectNameEn;
    const locationPart = location ? ` ${t("searchPage.locationPrefix")} ${location}` : "";
    return `${projectDisplay} – ${listingText}${locationPart}`;
  };

  // Build H2 subtitle for project page
  const getProjectH2 = () => {
    if (!selectedProjectObj) return t("searchPage.title");
    const projectNameEn = selectedProjectObj.projectNameEn || "";
    const projectNameTh = selectedProjectObj.projectNameTh || "";
    const listingText = getListingTypeText();
    const location = getLocationString();

    // Format: "รวมคอนโดให้เช่า The saint residences (เดอะ เซนต์ เรซิเดนเซส) – คอนโดให้เช่า ทําเล ลาดพร้าว จตุจักร"
    const projectDisplay = projectNameTh
      ? `${projectNameEn} (${projectNameTh})`
      : projectNameEn;
    const locationPart = location ? ` ${t("searchPage.locationPrefix")} ${location}` : "";
    return `${t("searchPage.allListingsPrefix")}${listingText} ${projectDisplay} – ${listingText}${locationPart}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section - Light with Red Accent */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div
          className={`container mx-auto px-4 text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="w-16 h-1 bg-[#eb3838] mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedProject
              ? getProjectH1()
              : !propertyType && !bedrooms && !minPrice && !maxPrice && !searchText && listingType === "rent"
                ? t("searchPage.rentTitle")
                : !propertyType && !bedrooms && !minPrice && !maxPrice && !searchText && listingType === "sale"
                  ? t("searchPage.saleTitle")
                  : t("searchPage.title")}
          </h1>
          <h2 className="text-lg text-gray-600 mb-6 font-normal">
            {selectedProject
              ? getProjectH2()
              : !propertyType && !bedrooms && !minPrice && !maxPrice && !searchText && listingType === "rent"
                ? t("searchPage.rentSubtitle")
                : !propertyType && !bedrooms && !minPrice && !maxPrice && !searchText && listingType === "sale"
                  ? t("searchPage.saleSubtitle")
                  : t("searchPage.subtitle")}
          </h2>

          {selectedProject && (
            <Button
              variant="outline"
              className="border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
              onClick={() => setSelectedProject("")}
            >
              <X className="w-4 h-4 mr-2" />
              {t("search.resetFilters")}
            </Button>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Top Filter Bar */}
        <Card className="p-4 mb-6 shadow-lg bg-white border border-gray-200">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showFilters ? t("searchPage.hideFilters") : t("searchPage.showFilters")}
            </Button>
          </div>

          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{t("searchPage.filters")}</h2>
              <Button
                variant="outline"
                size="sm"
                className="border-0 text-[#eb3838] hover:text-[#d32f2f] hover:bg-transparent"
                onClick={handleResetFilters}
              >
                {t("search.resetFilters")}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Text Search */}
              <div className="lg:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  {t("common.search")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder={t("searchPage.searchPlaceholder")}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setShowSuggestions(false);
                        handleSearch();
                      }
                    }}
                    className="pl-10 h-10 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  />
                  <SearchSuggestions
                    searchText={searchText}
                    onSelect={(value) => {
                      setSearchText(value);
                      setShowSuggestions(false);
                      // Trigger search after selecting suggestion
                      setTimeout(() => {
                        const params = new URLSearchParams();
                        params.set("q", value);
                        if (selectedProject) params.set("project", selectedProject);
                        if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
                        if (listingType && listingType !== "all") params.set("listingType", listingType);
                        if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
                        if (minPrice) params.set("minPrice", minPrice);
                        if (maxPrice) params.set("maxPrice", maxPrice);
                        router.push(`/search?${params.toString()}`, { scroll: false });
                      }, 0);
                    }}
                    isOpen={showSuggestions}
                    onClose={() => setShowSuggestions(false)}
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  {t("search.propertyType")}
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-10 border-gray-200 bg-gray-50 text-gray-900">
                    <SelectValue placeholder={t("search.all")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">{t("search.all")}</SelectItem>
                    <SelectItem value="Condo">{t("search.condo")}</SelectItem>
                    <SelectItem value="Townhouse">{t("search.townhouse")}</SelectItem>
                    <SelectItem value="SingleHouse">{t("search.singleHouse")}</SelectItem>
                    <SelectItem value="Villa">{t("search.villa")}</SelectItem>
                    <SelectItem value="Land">{t("search.land")}</SelectItem>
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
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  {t("search.listingType")}
                </label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger className="h-10 border-gray-200 bg-gray-50 text-gray-900">
                    <SelectValue placeholder={t("search.all")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">{t("search.all")}</SelectItem>
                    <SelectItem value="rent">{t("search.rent")}</SelectItem>
                    <SelectItem value="sale">{t("search.sale")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  {t("search.bedrooms")}
                </label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger className="h-10 border-gray-200 bg-gray-50 text-gray-900">
                    <SelectValue placeholder={t("common.notSpecified")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all">{t("common.notSpecified")}</SelectItem>
                    <SelectItem value="1">1 {t("common.room")}</SelectItem>
                    <SelectItem value="2">2 {t("common.rooms")}</SelectItem>
                    <SelectItem value="3">3 {t("common.rooms")}</SelectItem>
                    <SelectItem value="4">4 {t("common.rooms")}</SelectItem>
                    <SelectItem value="5">5+ {t("common.rooms")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full h-10 bg-[#eb3838] hover:bg-[#d32f2f] text-white"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {t("search.searchButton")}
                </Button>
              </div>
            </div>

            {/* Price Range - Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mt-4">
              <div className="lg:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">
                  {t("search.minPrice")} - {t("search.maxPrice")}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder={t("search.minPrice")}
                    value={formatPriceInput(minPrice)}
                    onChange={(e) => setMinPrice(parsePriceInput(e.target.value))}
                    className="h-10 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  />
                  <Input
                    type="text"
                    placeholder={t("search.maxPrice")}
                    value={formatPriceInput(maxPrice)}
                    onChange={(e) => setMaxPrice(parsePriceInput(e.target.value))}
                    className="h-10 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Project Tags - Horizontal Scrollable (Always visible) */}
          {projects.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                {t("common.projects")}
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {projects.map((project) => (
                  <button
                    key={project.projectCode}
                    type="button"
                    onClick={() => handleProjectSelect(project.projectCode)}
                    className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                      selectedProject === project.projectCode
                        ? "bg-[#eb3838] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-[#eb3838]/10 hover:text-[#eb3838]"
                    }`}
                  >
                    <Building2 className="w-3 h-3" />
                    {getProjectName(project)}
                    <span className="opacity-70">({project.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedProject
                    ? getProjectH2()
                    : !propertyType && !bedrooms && !minPrice && !maxPrice && !searchText && listingType === "rent"
                      ? t("searchPage.rentTitle")
                      : !propertyType && !bedrooms && !minPrice && !maxPrice && !searchText && listingType === "sale"
                        ? t("searchPage.saleTitle")
                        : t("searchPage.title")}
                </h3>
                {!loading && (
                  <p className="text-sm text-gray-500">
                    {properties.length} {t("common.properties")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "grid"
                      ? "bg-[#eb3838] hover:bg-[#d32f2f]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "list"
                      ? "bg-[#eb3838] hover:bg-[#d32f2f]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className={`animate-pulse bg-gray-200 ${
                      viewMode === "grid" ? "h-80" : "h-40"
                    }`}
                  />
                ))}
              </div>
            ) : properties.length === 0 ? (
              /* Empty State */
              <Card className="p-12 text-center shadow-lg bg-white border border-gray-200">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t("search.noPropertiesFound")}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("search.tryAdjustFilters")}
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#eb3838] hover:bg-[#d32f2f] text-white"
                >
                  {t("search.resetFilters")}
                </Button>
              </Card>
            ) : (
              /* Properties Grid/List */
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {properties.map((property, index) => (
                  <Link
                    key={property.id}
                    href={`/property/${generatePropertySlug(property, locale)}`}
                    className={`transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <Card
                      className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-[#eb3838]/50 ${
                        viewMode === "list" ? "flex flex-row" : ""
                      }`}
                    >
                      {/* Property Image */}
                      <div
                        className={`relative overflow-hidden bg-gray-100 flex-shrink-0 ${
                          viewMode === "list" ? "w-48 h-48" : "h-48"
                        }`}
                      >
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

                        {/* Status Badge */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {property.status === "available" ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#22c55e] text-white text-xs font-medium rounded-md shadow-lg">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{t("property.confirmedAvailable")}</span>
                            </div>
                          ) : property.status === "sold" || property.status === "rented" ? (
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 text-white text-xs font-medium rounded-md shadow-lg ${property.status === "sold" ? "bg-[#eb3838]" : "bg-blue-500"}`}>
                              <span>{t(`property.${property.status}`)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-500 text-white text-xs font-medium rounded-md shadow-lg">
                              <span>{t(`property.${property.status}`)}</span>
                            </div>
                          )}
                        </div>

                        {/* Listing Type Badge */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {property.rentalRateNum != null && property.rentalRateNum > 0 && (
                            <div className="bg-[#eb3838] text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-lg">
                              {t("property.forRent")}
                            </div>
                          )}
                          {property.sellPriceNum != null && property.sellPriceNum > 0 && (
                            <div className="bg-gray-900 text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-lg">
                              {t("property.forSale")}
                            </div>
                          )}
                          {property.isAcceptShortTerm && property.isAcceptShortTerm !== "no" && property.isAcceptShortTerm !== "false" && (
                            <div className="flex items-center gap-1 bg-purple-600 text-white px-2.5 py-1 rounded-md text-xs font-medium shadow-lg">
                              <Calendar className="w-3 h-3" />
                              <span>{property.isAcceptShortTerm}</span>
                            </div>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(property.id);
                          }}
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md z-10"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFavorite(property.id)
                                ? "fill-[#eb3838] text-[#eb3838]"
                                : "text-gray-400 hover:text-[#eb3838]"
                            }`}
                          />
                        </button>

                        {/* Bottom overlay - Location */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                          <div className="flex items-center gap-1 text-white text-xs">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{getPropertyAddressString(property, locale) || "Bangkok"}</span>
                          </div>
                        </div>

                      </div>

                      {/* Property Details */}
                      <div className={`p-4 flex-1 flex flex-col ${viewMode === "list" ? "justify-between" : ""}`}>
                        <div>
                          <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-[#eb3838] transition-colors ${viewMode === "list" ? "line-clamp-1" : "line-clamp-2"}`}>
                            {property.propertyType === "Condo" && property.project
                              ? getProjectName(property.project)
                              : getPropertyTitle(property)}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <Bed className="w-3 h-3 text-[#eb3838]" />
                              <span className="font-semibold">
                                {property.bedRoomNum}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-3 h-3 text-[#eb3838]" />
                              <span className="font-semibold">
                                {property.bathRoomNum}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Maximize className="w-3 h-3 text-[#eb3838]" />
                              <span className="font-semibold">
                                {getSize(property)} {t("common.sqm")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div>
                          {property.rentalRateNum != null &&
                            property.rentalRateNum > 0 && (
                              <div className={`font-bold text-[#eb3838] ${viewMode === "list" ? "text-base" : "text-lg"}`}>
                                <span className="text-xs font-normal text-gray-500 mr-1">{t("property.forRent")}:</span>
                                ฿{formatPrice(property.rentalRateNum)}
                                <span className="text-xs font-normal text-gray-400">
                                  {t("property.perMonth")}
                                </span>
                              </div>
                            )}
                          {property.sellPriceNum != null &&
                            property.sellPriceNum > 0 && (
                              <div className={`font-bold text-[#eb3838] ${property.rentalRateNum != null && property.rentalRateNum > 0 ? "text-sm mt-1" : viewMode === "list" ? "text-base" : "text-lg"}`}>
                                <span className="text-xs font-normal text-gray-500 mr-1">{t("property.forSale")}:</span>
                                ฿{formatPrice(property.sellPriceNum)}
                              </div>
                            )}

                          <div className="text-xs text-gray-400 mt-2">
                            {t("common.code")}: {property.agentPropertyCode}
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
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar - Inquiry Form */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <Card className="p-5 sticky top-24 shadow-lg bg-white border border-gray-200 max-h-[calc(100vh-7rem)] overflow-y-auto">
              {isSubmitted ? (
                /* Success State */
                <div className="text-center py-6">
                  <div className="w-14 h-14 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("listPropertyPopup.successTitle")}</h3>
                  <p className="text-gray-500 text-sm">{t("listPropertyPopup.successMessage")}</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[#eb3838]/10 rounded-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-[#eb3838]" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{t("listPropertyPopup.title")}</h2>
                    <p className="text-gray-500 text-xs mt-1">{t("listPropertyPopup.subtitle")}</p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.nameLabel")}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                          placeholder={t("listPropertyPopup.namePlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.phoneLabel")}
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                          placeholder={t("listPropertyPopup.phonePlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.budgetLabel")}
                      </label>
                      <input
                        type="text"
                        value={inquiryForm.budget}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                        placeholder={t("listPropertyPopup.budgetPlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.locationLabel")}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={inquiryForm.location}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, location: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                          placeholder={t("listPropertyPopup.locationPlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.lineIdLabel")}
                      </label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={inquiryForm.lineId}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, lineId: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                          placeholder={t("listPropertyPopup.lineIdPlaceholder")}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.whatsappLabel")}
                      </label>
                      <input
                        type="text"
                        value={inquiryForm.whatsapp}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                        placeholder={t("listPropertyPopup.whatsappPlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.wechatLabel")}
                      </label>
                      <input
                        type="text"
                        value={inquiryForm.wechat}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, wechat: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                        placeholder={t("listPropertyPopup.wechatPlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.propertyTypeLabel")}
                      </label>
                      <select
                        value={inquiryForm.propertyType}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, propertyType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838] bg-white"
                      >
                        <option value="">{t("listPropertyPopup.propertyTypePlaceholder")}</option>
                        <option value="condo">{t("search.condo")}</option>
                        <option value="house">{t("search.singleHouse")}</option>
                        <option value="townhouse">{t("search.townhouse")}</option>
                        <option value="villa">{t("search.villa")}</option>
                        <option value="land">{t("search.land")}</option>
                        <option value="office">{t("search.office")}</option>
                        <option value="store">{t("search.store")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t("listPropertyPopup.messageLabel")}
                      </label>
                      <textarea
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838] resize-none"
                        placeholder={t("listPropertyPopup.messagePlaceholder")}
                        rows={2}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-[#eb3838] text-white text-sm font-semibold rounded-lg hover:bg-[#d32f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? t("listPropertyPopup.submitting") : t("listPropertyPopup.submitButton")}
                    </button>
                  </form>
                </>
              )}
            </Card>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12">
        <Footer
          seoContent={
            listingType === "rent" || listingType === "sale" ? (
              <div className="space-y-6 text-gray-300">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3">
                    {t(listingType === "rent" ? "seoRent.title1" : "seoSale.title1")}
                  </h2>
                  <p className="text-sm leading-relaxed">
                    {t(listingType === "rent" ? "seoRent.desc1" : "seoSale.desc1")}
                  </p>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-3">
                    {t(listingType === "rent" ? "seoRent.title2" : "seoSale.title2")}
                  </h2>
                  <p className="text-sm leading-relaxed">
                    {t(listingType === "rent" ? "seoRent.desc2" : "seoSale.desc2")}
                  </p>
                </div>
              </div>
            ) : undefined
          }
        />
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-64 h-10 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-48 h-6 bg-gray-200 rounded mx-auto animate-pulse" />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
