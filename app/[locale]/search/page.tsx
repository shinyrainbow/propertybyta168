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
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  type NainaHubProperty,
  type FetchPropertiesParams,
  type NainaHubResponse,
} from "@/lib/nainahub";

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
  const [showFilters, setShowFilters] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Filters - initialized from URL params
  const [searchText, setSearchText] = useState<string>(searchParams.get("q") || "");
  const [propertyType, setPropertyType] = useState<string>(propertyTypeParam);
  const [listingType, setListingType] = useState<string>(listingTypeParam);
  const [bedrooms, setBedrooms] = useState<string>(bedroomsParam);
  const [minPrice, setMinPrice] = useState<string>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<string>(maxPriceParam);
  const [searchTrigger, setSearchTrigger] = useState(0); // Trigger for manual search

  // Sync state with URL params when they change (e.g., navigating from homepage)
  useEffect(() => {
    setSearchText(searchParams.get("q") || "");
    setSelectedProject(searchParams.get("project") || "");
    setPropertyType(searchParams.get("propertyType") || "");
    setListingType(searchParams.get("listingType") || "");
    setBedrooms(searchParams.get("bedrooms") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  // Animation trigger and initial search
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    setSearchTrigger(1); // Trigger initial search
    return () => clearTimeout(timer);
  }, []);


  // Load properties from NainaHub API
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("📡 Loading properties... searchTrigger:", searchTrigger);
        setLoading(true);
        const params: FetchPropertiesParams = {
          limit: 100,
          ...(searchText && { q: searchText }), // API does conditional search when propertyType is specified
          ...(propertyType && propertyType !== "all" && { propertyType: propertyType as any }),
          ...(listingType && listingType !== "all" && { listingType: listingType as any }),
          ...(bedrooms && bedrooms !== "all" && { bedrooms: parseInt(bedrooms) }),
          ...(minPrice && { minPrice: parseInt(minPrice) }),
          ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
        };
        console.log("🚀 API call params:", params);
        const response = await fetchPropertiesFromAPI(params);
        console.log("✅ API response received:", response.data.length, "properties");
        setAllProperties(response.data);

        // Generate projects from properties
        const projectsMap = new Map<string, { count: number; image: string; project: any }>();
        response.data.forEach((property: NainaHubProperty) => {
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
  }, [searchTrigger]); // Only search when searchTrigger changes

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

  // Filter properties based on selected project (UI-only filter)
  // All other filters (propertyType, listingType, bedrooms, prices, searchText) are handled by the API
  useEffect(() => {
    let filtered = [...allProperties];

    // Filter by project (UI-only feature)
    if (selectedProject) {
      filtered = filtered.filter((p) => p.projectCode === selectedProject);
    }

    setProperties(filtered);
  }, [allProperties, selectedProject]);

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

  // Get selected project name for display
  const selectedProjectObj = projects.find(p => p.projectCode === selectedProject);
  const selectedProjectName = selectedProjectObj ? getProjectName(selectedProjectObj) : selectedProject;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shared Header */}
      <Header />

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#C9A227] to-[#A88B1F] py-12">
        <div
          className={`container mx-auto px-4 text-center text-white transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedProject
              ? `${t("searchPage.title")} - ${selectedProjectName}`
              : t("searchPage.title")}
          </h1>
          <p className="text-lg text-white/90 mb-6">
            {selectedProject
              ? `${properties.length} ${t("common.properties")} - ${selectedProjectName}`
              : t("searchPage.subtitle")}
          </p>

          {selectedProject && (
            <Button
              variant="outline"
              className="bg-white/20 border-white text-white hover:bg-white hover:text-[#C9A227]"
              onClick={() => setSelectedProject("")}
            >
              <X className="w-4 h-4 mr-2" />
              {t("search.resetFilters")}
            </Button>
          )}
        </div>
      </section>

      {/* Projects Quick Select */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {projects.map((project) => (
              <Button
                key={project.projectCode}
                variant={
                  selectedProject === project.projectCode ? "default" : "outline"
                }
                className={`transition-all duration-300 ${
                  selectedProject === project.projectCode
                    ? "bg-[#C9A227] hover:bg-[#A88B1F] text-white border-[#C9A227]"
                    : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#C9A227] hover:bg-[#C9A227]/10 hover:text-[#C9A227]"
                }`}
                onClick={() => handleProjectSelect(project.projectCode)}
              >
                <Building2 className="w-4 h-4 mr-1" />
                {getProjectName(project)}
                <span className="ml-1 text-xs opacity-75">
                  ({project.count})
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showFilters ? t("searchPage.hideFilters") : t("searchPage.showFilters")}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-72 ${
              showFilters ? "block" : "hidden"
            } lg:block transition-all duration-300`}
          >
            <Card className="p-6 sticky top-24 shadow-lg bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t("searchPage.filters")}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-0 text-[#C9A227] hover:text-[#A88B1F] hover:bg-transparent"
                  onClick={handleResetFilters}
                >
                  {t("search.resetFilters")}
                </Button>
              </div>

              <div className="space-y-5">
                {/* Text Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t("common.search")}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t("searchPage.searchPlaceholder")}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="pl-10 border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t("search.propertyType")}
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="border-gray-200 bg-gray-50 text-gray-900">
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t("search.listingType")}
                  </label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="border-gray-200 bg-gray-50 text-gray-900">
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t("search.bedrooms")}
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="border-gray-200 bg-gray-50 text-gray-900">
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

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t("search.minPrice")} - {t("search.maxPrice")}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={t("search.minPrice")}
                      value={formatPriceInput(minPrice)}
                      onChange={(e) => setMinPrice(parsePriceInput(e.target.value))}
                      className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                    />
                    <Input
                      type="text"
                      placeholder={t("search.maxPrice")}
                      value={formatPriceInput(maxPrice)}
                      onChange={(e) => setMaxPrice(parsePriceInput(e.target.value))}
                      className="border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="mt-4">
                  <Button
                    onClick={handleSearch}
                    className="w-full bg-[#C9A227] hover:bg-[#A88B1F] text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {t("search.searchButton")}
                  </Button>
                </div>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {t("searchPage.title")}
                </h2>
                <p className="text-sm text-gray-500">
                  {properties.length} {t("common.properties")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "grid"
                      ? "bg-[#C9A227] hover:bg-[#A88B1F]"
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
                      ? "bg-[#C9A227] hover:bg-[#A88B1F]"
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
                  className="bg-[#C9A227] hover:bg-[#A88B1F] text-white"
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
                    href={`/property/${property.id}`}
                    className={`transition-all duration-500 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <Card
                      className={`group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-gray-200 hover:border-[#C9A227]/50 ${
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

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
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

                        {/* Listing Type & Closed Deal Badge */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          {property.status === "sold" || property.status === "rented" ? (
                            <div className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {property.status === "sold" ? t("property.sold") : t("property.rented")}
                            </div>
                          ) : (
                            <>
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
                            </>
                          )}
                        </div>

                      </div>

                      {/* Property Details */}
                      <div className={`p-4 flex-1 flex flex-col ${viewMode === "list" ? "justify-between" : ""}`}>
                        <div>
                          {property.project && (
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {getProjectName(property.project)}
                            </div>
                          )}

                          <h3 className={`font-bold text-gray-900 mb-2 group-hover:text-[#C9A227] transition-colors ${viewMode === "list" ? "line-clamp-1" : "line-clamp-2"}`}>
                            {getPropertyTitle(property)}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-1">
                              <Bed className="w-3 h-3 text-[#C9A227]" />
                              <span className="font-semibold">
                                {property.bedRoomNum}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-3 h-3 text-[#C9A227]" />
                              <span className="font-semibold">
                                {property.bathRoomNum}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Maximize className="w-3 h-3 text-[#C9A227]" />
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
                              <div className={`font-bold text-[#C9A227] ${viewMode === "list" ? "text-base" : "text-lg"}`}>
                                <span className="text-xs font-normal text-gray-500 mr-1">{t("property.forRent")}:</span>
                                ฿{formatPrice(property.rentalRateNum)}
                                <span className="text-xs font-normal text-gray-400">
                                  {t("property.perMonth")}
                                </span>
                              </div>
                            )}
                          {property.sellPriceNum != null &&
                            property.sellPriceNum > 0 && (
                              <div className={`font-bold text-[#C9A227] ${property.rentalRateNum != null && property.rentalRateNum > 0 ? "text-sm mt-1" : viewMode === "list" ? "text-base" : "text-lg"}`}>
                                <span className="text-xs font-normal text-gray-500 mr-1">{t("property.forSale")}:</span>
                                ฿{formatPrice(property.sellPriceNum)}
                              </div>
                            )}

                          <div className="text-xs text-gray-400 mt-2">
                            {t("common.code")}: {property.agentPropertyCode}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#152238] shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1B2D44] rounded animate-pulse" />
            <div className="w-32 h-6 bg-[#1B2D44] rounded animate-pulse" />
          </div>
        </div>
      </header>
      <section className="bg-gradient-to-r from-[#C9A227] to-[#A88B1F] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-64 h-10 bg-white/30 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-48 h-6 bg-white/30 rounded mx-auto animate-pulse" />
        </div>
      </section>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-[#152238] rounded-xl animate-pulse" />
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
