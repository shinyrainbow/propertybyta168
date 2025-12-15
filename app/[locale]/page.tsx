"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
  MapPin,
  Search,
  Phone,
  ChevronDown,
  ArrowRight,
  Play,
  Home,
  FileCheck,
  PhoneCall,
  Award,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
  LandPlot,
  Grid2x2,
  Square,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PartnersSection from "@/components/sections/partners";
import { toast } from "sonner";
import {
  type NainaHubProperty,
  type FetchPropertiesParams,
  type NainaHubResponse,
} from "@/lib/nainahub";

// Hero background images for slideshow
const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1920",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920",
];

// Projects will be generated from real property data

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

  const response = await fetch(`/api/nainahub/properties?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export default function PublicPropertiesPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

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
  const [popularProperties, setPopularProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const popularSliderRef = useRef<HTMLDivElement>(null);

  // Closed Deals slider
  const [closedDeals, setClosedDeals] = useState<Property[]>([]);
  const closedDealsSliderRef = useRef<HTMLDivElement>(null);
  const [closedCanScrollLeft, setClosedCanScrollLeft] = useState(false);
  const [closedCanScrollRight, setClosedCanScrollRight] = useState(false);

  // Hero background slideshow
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero content animation
  const [heroVisible, setHeroVisible] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Handle search - navigate to /search with filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (propertyType && propertyType !== "all")
      params.set("propertyType", propertyType);
    if (listingType && listingType !== "all")
      params.set("listingType", listingType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero background image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Trigger hero content animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Load properties from NainaHub API with filters
  const loadProperties = async () => {
    try {
      setLoading(true);
      const params: FetchPropertiesParams = {
        page,
        limit: 12,
      };

      // Apply filters
      if (propertyType && propertyType !== "all") {
        params.propertyType = propertyType as any;
      }
      if (listingType && listingType !== "all") {
        params.listingType = listingType as any;
      }
      if (bedrooms && bedrooms !== "all") {
        params.bedrooms = parseInt(bedrooms);
      }
      if (minPrice) {
        params.minPrice = parseInt(minPrice);
      }
      if (maxPrice) {
        params.maxPrice = parseInt(maxPrice);
      }

      const response = await fetchPropertiesFromAPI(params);
      setProperties(response.data);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error("Error loading properties:", error);
      toast.error("Failed to load properties");
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [page]);

  // Check slider scroll state
  const checkSliderScroll = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, sliderType: string) => {
      if (!ref.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;

      if (sliderType === "closed") {
        setClosedCanScrollLeft(canScrollLeft);
        setClosedCanScrollRight(canScrollRight);
      }
    },
    []
  );

  // Scroll slider helper function
  const scrollSlider = useCallback(
    (
      ref: React.RefObject<HTMLDivElement | null>,
      direction: "left" | "right",
      sliderType: string
    ) => {
      if (!ref.current) return;
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Check scroll state after animation
      setTimeout(() => checkSliderScroll(ref, sliderType), 300);
    },
    [checkSliderScroll]
  );

  // Load popular properties, closed deals, and generate projects from real data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load more properties to get popular ones and generate projects
        const response = await fetchPropertiesFromAPI({ limit: 100 });

        // Get latest 10 properties as "popular"
        const popular = response.data.slice(0, 10);
        setPopularProperties(popular);

        // Get closed deals (sold/rented properties) - limit to 10
        const closed = response.data
          .filter((p: NainaHubProperty) => p.status === "sold" || p.status === "rented")
          .slice(0, 10);
        setClosedDeals(closed);

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

        // Convert to projects array
        const projectsArray: Project[] = Array.from(projectsMap.entries())
          .map(([code, data]) => ({
            projectCode: code,
            projectNameEn: data.project.projectNameEn,
            projectNameTh: data.project.projectNameTh,
            count: data.count,
            image: data.image,
          }))
          .slice(0, 8); // Limit to 8 projects

        setProjects(projectsArray);

        // Check initial scroll state for closed deals slider after data loads
        setTimeout(() => {
          if (closedDealsSliderRef.current) {
            checkSliderScroll(closedDealsSliderRef, "closed");
          }
        }, 100);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [checkSliderScroll]);


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
    setPropertyType("");
    setListingType("");
    setBedrooms("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Shared Header */}
      <Header transparent />

      {/* Unified Gradient Background Container */}
      <div className="bg-gradient-to-br from-[#21273b] via-[#0d1117] to-[#0A0E1A]">

      {/* Hero Section - Overlapping + Angled Divider Layout */}
      <section className="relative h-[85vh] overflow-hidden">
        {/* // bg-[#0A0E1A] */}
        <div className="relative h-full">
          {/* Right Side - Image with Angled Divider */}
          <div
            className="absolute top-0 right-0 bottom-0 hidden lg:block w-[60%]"
            style={{
              clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)"
            }}
          >
            {/* Main Image with slideshow */}
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={image}
                  alt="Luxury property"
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Dark overlay to make images darker */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Gradient overlay on the angled edge for blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A] via-transparent to-transparent" style={{ width: "25%" }} />
          </div>

          {/* Left Side - Overlapping Content Card */}
          <div className="relative z-10 h-full flex items-start md:items-center px-6 md:px-12 lg:pl-[calc((100vw-1024px)/2+2rem)] xl:pl-[calc((100vw-1280px)/2+2rem)] 2xl:pl-[calc((100vw-1536px)/2+2rem)] pt-20 pb-6 md:py-20 lg:pr-0">
            <div className={`w-full max-w-3xl lg:max-w-2xl xl:max-w-3xl bg-black/30 md:bg-black/20 lg:bg-white/5 backdrop-blur-sm p-6 md:p-8 lg:p-12 border-l-4 border-[#C9A227] transition-all duration-700 ${heroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              {/* Gold accent line */}
              <div className={`w-12 h-0.5 bg-[#C9A227] mb-6 transition-all duration-500 ${heroVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`} style={{ transitionDelay: "200ms", transformOrigin: "left" }} />

              {/* Headline */}
              <h1 className={`font-heading text-3xl md:text-4xl lg:text-3xl xl:text-4xl text-white mb-6 leading-tight tracking-wide transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "300ms" }}>
                <span className="font-medium">{t("homePage.sellOrRent")}</span>
                <br />
                <span className="font-medium">{t("homePage.yourHomeAt")}</span>
                <br />
                <span className="font-bold text-[#C9A227]">{t("homePage.bestPrice")}</span>
              </h1>

              {/* Subtitle */}
              <p className={`text-base md:text-sm text-gray-300 mb-8 leading-relaxed transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "450ms" }}>
                {t("hero.subtitle")}
              </p>

              {/* Key Features */}
              <div className={`grid grid-cols-2 gap-4 mb-8 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "600ms" }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                    <Home className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">{t("homePage.premiumProperties")}</h3>
                    <p className="text-gray-400 text-xs">{t("homePage.handPickedLuxury")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-4 h-4 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">{t("homePage.guaranteedService")}</h3>
                    <p className="text-gray-400 text-xs">{t("homePage.professionalSupport")}</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 mb-10 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "750ms" }}>
                <Button
                  variant="gold"
                  size="default"
                  onClick={() => router.push("/contact")}
                  className="group px-8 font-heading tracking-wider text-sm"
                >
                  {t("homePage.getInTouch")}
                </Button>
                <Button
                  variant="dark-ghost"
                  size="default"
                  onClick={() => router.push("/search")}
                  className="group font-heading tracking-wider text-sm"
                >
                  {/* <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center mr-2 group-hover:border-[#C9A227] group-hover:bg-[#C9A227]/10 transition-all">
                    <Play className="w-3 h-3 fill-white" />
                  </div> */}
                  {t("homePage.howItWorks")}
                </Button>
              </div>

              {/* Stats Row */}
              <div className={`flex flex-wrap gap-6 pt-8 border-t border-white/10 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "900ms" }}>
                <div className={`transition-all duration-500 ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: "1000ms" }}>
                  <div className="text-2xl md:text-xl font-semibold text-white">500+</div>
                  <div className="text-sm md:text-xs text-gray-400">
                    {t("hero.stats.properties")}
                  </div>
                </div>
                <div className={`transition-all duration-500 ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: "1100ms" }}>
                  <div className="text-2xl md:text-xl font-semibold text-white">1000+</div>
                  <div className="text-sm md:text-xs text-gray-400">
                    {t("hero.stats.happyClients")}
                  </div>
                </div>
                <div className={`transition-all duration-500 ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: "1200ms" }}>
                  <div className="text-2xl md:text-xl font-semibold text-white">15+</div>
                  <div className="text-sm md:text-xs text-gray-400">
                    {t("hero.stats.years")}
                  </div>
                </div>
                <div className={`transition-all duration-500 ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ transitionDelay: "1300ms" }}>
                  <div className="text-2xl md:text-xl font-semibold text-white">95%</div>
                  <div className="text-sm md:text-xs text-gray-400">
                    {t("homePage.clientSatisfaction")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/iPad background image */}
        <div className="absolute inset-0 lg:hidden">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt="Luxury property"
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Dark overlay for mobile/iPad */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-float z-50 cursor-pointer">
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div> */}
      </section>

      {/* Search Section - Dark Mode */}
      <section
        id="search"
        ref={(el) => {
          observerRefs.current["search"] = el;
        }}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-white mb-1">
                {t("search.searchButton")}
              </h2>
              <p className="text-gray-400 text-sm">{t("hero.subtitle")}</p>
            </div>

            {/* Search filters - Dark card */}
            <div className="rounded-xl p-4 border border-white/40">
              {/* Search Input - Full width in its own row */}
              <div className="mb-3">
                <label className="text-[10px] font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">
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
                        handleSearch();
                      }
                    }}
                    className="h-9 pl-8 bg-white border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400 w-full"
                  />
                </div>
              </div>

              {/* Other filters in a grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                {/* Listing Type */}
                <div>
                  <label className="text-[10px] font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">
                    {t("search.listingType")}
                  </label>
                  <Select value={listingType} onValueChange={setListingType}>
                    <SelectTrigger className="h-9 bg-[#1F2937] border-white/10 rounded-lg text-white text-sm">
                      <SelectValue placeholder={t("search.all")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F2937] border-white/10">
                      <SelectItem value="all">{t("search.all")}</SelectItem>
                      <SelectItem value="rent">{t("search.rent")}</SelectItem>
                      <SelectItem value="sale">{t("search.sale")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-[10px] font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">
                    {t("search.propertyType")}
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-9 bg-[#1F2937] border-white/10 rounded-lg text-white text-sm">
                      <SelectValue placeholder={t("search.all")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F2937] border-white/10">
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

                {/* Bedrooms */}
                <div>
                  <label className="text-[10px] font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">
                    {t("search.bedrooms")}
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="h-9 bg-[#1F2937] border-white/10 rounded-lg text-white text-sm">
                      <SelectValue placeholder={t("common.notSpecified")} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F2937] border-white/10">
                      <SelectItem value="all">
                        {t("common.notSpecified")}
                      </SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Price */}
                <div>
                  <label className="text-[10px] font-medium text-gray-400 mb-1.5 block uppercase tracking-wider">
                    {t("search.maxPrice")}
                  </label>
                  <Input
                    type="text"
                    placeholder="฿"
                    value={formatPriceInput(maxPrice)}
                    onChange={(e) => setMaxPrice(parsePriceInput(e.target.value))}
                    className="h-9 bg-white border-gray-200 rounded-lg text-gray-900 text-sm placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Search Button - Full width in its own row */}
              <Button
                variant="gold"
                className="h-9 w-full text-sm"
                onClick={handleSearch}
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                {t("search.searchButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Properties Section - Dark Mode */}
      <section
        id="popular"
        ref={(el) => {
          observerRefs.current["popular"] = el;
        }}
        className="py-12"
      >
        <div className="container mx-auto px-4">
          {/* Section Header - Split Layout */}
          <div
            className={`flex flex-col lg:grid lg:grid-cols-3 items-center gap-6 mb-8 transition-all duration-700 ${
              isVisible["popular"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Left - Title (hidden on mobile, shown on desktop) */}
            <div className="hidden lg:block">
              <h2 className="text-xl md:text-2xl font-heading text-white tracking-wide">
                {t("sections.popularProperties2")}
              </h2>
            </div>

            {/* Center - Logo + Title on mobile */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                <Image
                  src="/header-logo.png"
                  alt="Sky Pro Property"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              {/* Title only on mobile */}
              <div className="lg:hidden text-center">
                <h2 className="text-base sm:text-xl font-heading text-white tracking-wide">
                  {t("sections.popularProperties2")}
                </h2>
              </div>
            </div>

            {/* Right - Description */}
            <p className="text-gray-400 text-xs sm:text-sm max-w-md text-center lg:text-right mx-auto lg:mx-0">
              {t("homePage.realEstateGuru")}
              <br/>
              {t("homePage.buyAnd")}
                 <br/>
              {t("homePage.contactUs")}
            </p>
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularProperties.slice(0, 6).map((property, index) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className={`block transition-all duration-500 ${
                  isVisible["popular"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="group relative rounded-lg overflow-hidden h-80">
                  {/* Full Card Image */}
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <Image
                      src={property.imageUrls[0]}
                      alt={getPropertyTitle(property)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-gray-600" />
                    </div>
                  )}

                  {/* Dark overlay - lighter for better image visibility */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

                  {/* Bottom Gradient for Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end">
                    {/* Content with padding */}
                    <div className="px-4 pb-3">
                      {/* Price */}
                      <div className="mb-1">
                        <span className="text-xl font-light text-white">
                          {property.rentalRateNum
                            ? formatPrice(property.rentalRateNum)
                            : formatPrice(property.sellPriceNum)}
                        </span>
                        <span className="text-xs text-gray-300 ml-1.5">
                          {property.rentalRateNum ? "THB/mo" : "THB"}
                        </span>
                      </div>

                      {/* Location/Title */}
                      <p className="text-gray-300 text-xs mb-3 line-clamp-1">
                        {getProjectName(property.project) || getPropertyTitle(property)}
                      </p>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-white">
                        <div className="text-center">
                          <div className="text-lg font-light">
                            {String(property.bedRoomNum).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {t("propertyDetail.beds")}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-light">
                            {String(property.bathRoomNum).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {t("propertyDetail.baths")}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-light">
                            {getSize(property)}m<sup>2</sup>
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                            {t("propertyDetail.area")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Learn More Button - Edge to Edge, Dark Gold */}
                    <button className="w-full py-3 bg-gradient-to-r from-[#9A7B06] via-[#8A6B05] to-[#7A5B04] text-white font-heading font-semibold tracking-widest text-xs hover:from-[#C9A227] hover:via-[#B8960B] hover:to-[#9A7B06] transition-all">
                      {t("propertyDetail.learnMore")}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      </div>
      {/* End Unified Gradient Background Container */}

      {/* Projects Section - Dark Mode */}
      <section
        id="projects"
        ref={(el) => {
          observerRefs.current["projects"] = el;
        }}
        className="py-12 bg-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-8 transition-all duration-700 ${
              isVisible["projects"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-lg md:text-xl font-semibold text-[#121928] mb-1">
              {t("sections.popularProjects")}
            </h2>
            <p className="text-gray-400 text-sm">
              {t("sections.popularProjectsSubtitle")}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {projects.map((project, index) => (
              <Link
                key={project.projectCode}
                href={`/search?project=${encodeURIComponent(
                  project.projectCode
                )}`}
                className={`group transition-all duration-500 ${
                  isVisible["projects"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden rounded-xl h-32 cursor-pointer border border-white/10 hover:border-[#C9A227]/50 transition-all duration-200">
                  <Image
                    src={project.image}
                    alt={getProjectName(project)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Dark overlay - darker by default, lighter on hover */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-medium text-sm line-clamp-1 mb-0.5">
                      {getProjectName(project)}
                    </h3>
                    <p className="text-[10px] text-[#C9A227]">
                      {project.count} {t("common.properties")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Projects Button */}
          <div className="text-center mt-6">
            <Link href="/search">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:border-[#C9A227] hover:text-[#C9A227] px-6 text-sm"
              >
                {t("sections.viewAllProjects")}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Properties Section - Dark Mode */}
      <section
        id="properties"
        ref={(el) => {
          observerRefs.current["properties"] = el;
        }}
        className="py-12 bg-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`text-center mb-8 transition-all duration-700 ${
              isVisible["properties"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-lg md:text-xl font-semibold text-black mb-1">
              {t("sections.allProperties")}
            </h2>
            <p className="text-gray-400 text-sm">
              {t("search.resultsFound", { count: total })}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <Card
                  key={i}
                  className="h-64 animate-pulse bg-[#1a2332] rounded-xl"
                />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-3">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {t("search.noPropertiesFound")}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                {t("search.tryAdjustFilters")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white transition-all duration-300"
              >
                {t("search.resetFilters")}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {properties.map((property, index) => (
                  <Link
                    key={property.id}
                    href={`/property/${property.id}`}
                    className={`block transition-all duration-500 ${
                      isVisible["properties"]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="group relative rounded-lg overflow-hidden h-72">
                      {/* Full Card Image */}
                      {property.imageUrls && property.imageUrls.length > 0 ? (
                        <Image
                          src={property.imageUrls[0]}
                          alt={getPropertyTitle(property) || "Property"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#111928] flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-gray-600" />
                        </div>
                      )}

                      {/* Bottom Gradient for Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

                      {/* Badge - Listing Type */}
                      <div className="absolute top-2 right-2 z-20">
                        {property.rentalRateNum && property.rentalRateNum > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#C9A227] text-white">
                            {t("property.forRent")}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/90 backdrop-blur-sm text-[#111928]">
                            {t("property.forSale")}
                          </span>
                        )}
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 z-20 flex flex-col justify-end">
                        {/* Content with padding */}
                        <div className="px-4 pb-3">
                          {/* Price */}
                          <div className="mb-1">
                            <span className="text-xl font-light text-white">
                              {property.rentalRateNum
                                ? formatPrice(property.rentalRateNum)
                                : formatPrice(property.sellPriceNum)}
                            </span>
                            <span className="text-xs text-gray-300 ml-1.5">
                              {property.rentalRateNum ? "THB/mo" : "THB"}
                            </span>
                          </div>

                          {/* Location/Title */}
                          <p className="text-gray-300 text-xs mb-3 line-clamp-1">
                            {getProjectName(property.project) || getPropertyTitle(property)}
                          </p>

                          {/* Stats Row */}
                          <div className="flex items-center justify-between text-white">
                            <div className="text-center">
                              <div className="text-lg font-light">
                                {String(property.bedRoomNum).padStart(2, "0")}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                {t("propertyDetail.beds")}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-light">
                                {String(property.bathRoomNum).padStart(2, "0")}
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                {t("propertyDetail.baths")}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-light">
                                {getSize(property)}m<sup>2</sup>
                              </div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                                {t("propertyDetail.area")}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Learn More Button - Edge to Edge, Dark Gold */}
                        <button className="w-full py-3 bg-gradient-to-r from-[#9A7B06] via-[#8A6B05] to-[#7A5B04] text-white font-heading font-semibold tracking-widest text-xs hover:from-[#C9A227] hover:via-[#B8960B] hover:to-[#9A7B06] transition-all">
                          {t("propertyDetail.learnMore")}
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {total > 12 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="text-xs border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                  >
                    {t("common.previous")}
                  </Button>
                  <div className="flex gap-2">
                    {Array.from(
                      { length: Math.min(5, Math.ceil(total / 12)) },
                      (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={page === pageNum ? "default" : "outline"}
                            onClick={() => setPage(pageNum)}
                            className={
                              page === pageNum
                                ? "bg-[#C9A227] hover:bg-[#A88B1F] text-white text-xs"
                                : "border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-900 text-xs"
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                    {Math.ceil(total / 12) > 5 && (
                      <span className="flex items-center px-2 text-gray-500">
                        ...
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= Math.ceil(total / 12)}
                    onClick={() => setPage(page + 1)}
                    className="text-xs border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
                  >
                    {t("common.next")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

  {/* Just Closed Deals Section */}
      <section
        id="closed-deals"
        ref={(el) => {
          observerRefs.current["closed-deals"] = el;
        }}
        className="py-16 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`flex items-center justify-between mb-8 transition-all duration-1000 ${
              isVisible["closed-deals"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-[#c6af6c]" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t("sections.closedDeals")}
                </h2>
              </div>
              <p className="text-gray-600">{t("sections.closedDealsSubtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  closedCanScrollLeft
                    ? "border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(closedDealsSliderRef, "left", "closed")}
                disabled={!closedCanScrollLeft}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  closedCanScrollRight
                    ? "border-[#c6af6c] text-[#c6af6c] hover:bg-[#c6af6c] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(closedDealsSliderRef, "right", "closed")}
                disabled={!closedCanScrollRight}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div
            ref={closedDealsSliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={() => checkSliderScroll(closedDealsSliderRef, "closed")}
          >
            {closedDeals.map((property, index) => (
              <div
                key={property.id}
                className={`flex-shrink-0 w-72 transition-all duration-500 ${
                  isVisible["closed-deals"]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="group overflow-hidden transition-all duration-500 border-0 rounded-xl bg-white h-full relative">
                  {/* Sold/Rented Overlay */}
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                      <div
                        className={`absolute top-4 -right-8 w-40 text-center py-1 text-xs font-bold text-white transform rotate-45 shadow-lg ${
                          property.status === "sold" ? "bg-red-500" : "bg-blue-500"
                        }`}
                      >
                        {property.status === "sold" ? t("property.sold") : t("property.rented")}
                      </div>
                    </div>
                  </div>
                  <div className="relative h-44 overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <Image
                        src={property.imageUrls[0]}
                        alt={getPropertyTitle(property)}
                        fill
                        className="object-cover grayscale-[30%]"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <MapPin className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                        {property.status === "sold" && property.sellPriceNum && property.sellPriceNum > 0
                          ? `฿${formatPrice(property.sellPriceNum)}`
                          : property.rentalRateNum && property.rentalRateNum > 0
                          ? `฿${formatPrice(property.rentalRateNum)}${t("property.perMonth")}`
                          : property.sellPriceNum && property.sellPriceNum > 0
                          ? `฿${formatPrice(property.sellPriceNum)}`
                          : t("common.contactForPrice")}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {getPropertyTitle(property)}
                    </h3>
                    {property.project && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" />
                        {getProjectName(property.project)}
                      </p>
                    )}
                    {property.propertyType === "Land" ? (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <LandPlot className="w-3 h-3 text-[#c6af6c]" />
                          {property.rai ?? 0} ไร่
                        </span>
                        <span className="flex items-center gap-1">
                          <Grid2x2 className="w-3 h-3 text-[#c6af6c]" />
                          {property.ngan ?? 0} งาน
                        </span>
                        <span className="flex items-center gap-1">
                          <Square className="w-3 h-3 text-[#c6af6c]" />
                          {property.landSizeSqw ?? 0} ตร.ว.
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3 text-[#c6af6c]" />
                          {property.bedRoomNum}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3 text-[#c6af6c]" />
                          {property.bathRoomNum}
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize className="w-3 h-3 text-[#c6af6c]" />
                          {getSize(property)} ตร.ม.
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={(el) => {
          observerRefs.current["how-it-works"] = el;
        }}
        className="py-16 bg-[#0d1117]"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div
            className={`mb-12 text-center md:text-left transition-all duration-700 ${
              isVisible["how-it-works"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-[#C9A227] text-xs uppercase tracking-widest mb-3">
              {t("homePage.howItWorks")}
            </p>
            <h2 className="text-lg sm:text-xl md:text-3xl font-semibold text-white leading-snug md:leading-tight">
              {t("homePage.weHelpSell")}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {t("homePage.withGuaranteed")} <span className="text-[#C9A227]">{t("homePage.guaranteedText")}</span>{" "}
              {t("homePage.services")}
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div
              className={`transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="w-16 h-16 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                <PhoneCall className="w-7 h-7 text-white" />
              </div>
              <p className="text-[#C9A227] text-xs uppercase tracking-wider mb-2">
                {t("homePage.step1")}
              </p>
              <p className="text-white font-medium">
                {t("homePage.step1Line1")}
                <br />
                {t("homePage.step1Line2")}
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="w-16 h-16 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                <Home className="w-7 h-7 text-white" />
              </div>
              <p className="text-[#C9A227] text-xs uppercase tracking-wider mb-2">
                {t("homePage.step2")}
              </p>
              <p className="text-white font-medium">
                {t("homePage.step2Line1")}
                <br />
                {t("homePage.step2Line2")}
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`transition-all duration-700 ${
                isVisible["how-it-works"]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="w-16 h-16 border border-white/20 rounded-lg flex items-center justify-center mb-4">
                <FileCheck className="w-7 h-7 text-white" />
              </div>
              <p className="text-[#C9A227] text-xs uppercase tracking-wider mb-2">
                {t("homePage.step3")}
              </p>
              <p className="text-white font-medium">
                {t("homePage.step3Line1")}
                <br />
                {t("homePage.step3Line2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Image */}
      <section
        id="contact"
        ref={(el) => {
          observerRefs.current["contact"] = el;
        }}
        className="relative bg-[#0d1117]"
      >
        {/* Image Container */}
        <div className="relative h-[400px] md:h-[450px] ml-8 md:ml-16 lg:ml-24 z-10">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
            alt="Dream property"
            fill
            className="object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Content */}
          <div
            className={`absolute inset-0 flex items-center transition-all duration-700 ${
              isVisible["contact"]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="px-8 md:px-12 lg:px-16">
              <div className="max-w-lg">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-4">
                  {t("cta.title")}
                </h2>
                <p className="text-gray-300 text-sm mb-6 max-w-md">
                  {t("cta.subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="gold"
                    size="default"
                    className="rounded-lg text-sm"
                    onClick={() => {
                      navigator.clipboard.writeText("0639562446");
                      toast.success(t("common.copiedPhone"));
                    }}
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    063-956-2446
                  </Button>
                  <Button
                    variant="glass"
                    size="default"
                    className="rounded-lg text-sm"
                    onClick={() => router.push("/contact")}
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    {t("nav.contact")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Stats Bar - pulls up behind bottom half of image */}
        <div className="bg-gradient-to-r from-[#9A7B06] via-[#8A6B05] to-[#7A5B04] -mt-[200px] md:-mt-[225px] pt-[200px] md:pt-[225px]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
              <div className="text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    10+
                  </span>
                  <span className="text-white/80 text-sm">
                    Years
                    <br />
                    of experience
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    20+
                  </span>
                  <span className="text-white/80 text-sm">
                    Awards
                    <br />
                    Gained
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    879
                  </span>
                  <span className="text-white/80 text-sm">
                    Properties
                    <br />
                    Listed
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    1000+
                  </span>
                  <span className="text-white/80 text-sm">
                    Happy
                    <br />
                    Clients
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
