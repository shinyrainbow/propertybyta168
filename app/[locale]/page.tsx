"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  ArrowRight,
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
  Building2,
  Users,
  TrendingUp,
  Shield,
  Heart,
  Images,
  CheckCircle,
  FileText,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PartnersSection from "@/components/sections/partners";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";
import {
  type NainaHubProperty,
  type FetchPropertiesParams,
  type NainaHubResponse,
  getPropertyAddressString,
} from "@/lib/nainahub";
import { SearchSuggestions } from "@/components/search/search-suggestions";

// Hero background images for slideshow
const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920",
];

type Property = NainaHubProperty;

interface Project {
  projectCode: string;
  projectNameEn: string;
  projectNameTh: string;
  count: number;
  image: string;
}

interface BlogPost {
  id: string;
  title: string;
  titleEn: string | null;
  titleZh: string | null;
  slug: string;
  excerpt: string | null;
  excerptEn: string | null;
  excerptZh: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

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
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const getBlogTitle = (blog: BlogPost) => {
    if (locale === "en") return blog.titleEn || blog.title;
    if (locale === "zh") return blog.titleZh || blog.title;
    return blog.title;
  };

  const getBlogExcerpt = (blog: BlogPost) => {
    if (locale === "en") return blog.excerptEn || blog.excerpt;
    if (locale === "zh") return blog.excerptZh || blog.excerpt;
    return blog.excerpt;
  };

  const formatBlogDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  const [properties, setProperties] = useState<Property[]>([]);
  const [popularProperties, setPopularProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const [closedDeals, setClosedDeals] = useState<Property[]>([]);
  const closedDealsSliderRef = useRef<HTMLDivElement>(null);
  const [closedCanScrollLeft, setClosedCanScrollLeft] = useState(false);
  const [closedCanScrollRight, setClosedCanScrollRight] = useState(false);

  // Popular properties slider
  const popularSliderRef = useRef<HTMLDivElement>(null);
  const [popularCanScrollLeft, setPopularCanScrollLeft] = useState(false);
  const [popularCanScrollRight, setPopularCanScrollRight] = useState(false);

  // Latest listings slider
  const latestSliderRef = useRef<HTMLDivElement>(null);
  const [latestCanScrollLeft, setLatestCanScrollLeft] = useState(false);
  const [latestCanScrollRight, setLatestCanScrollRight] = useState(false);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [latestListings, setLatestListings] = useState<Property[]>([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  // Filters
  const [searchText, setSearchText] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [listingType, setListingType] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
    if (listingType && listingType !== "all") params.set("listingType", listingType);
    if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params: FetchPropertiesParams = { page, limit: 12 };

      if (propertyType && propertyType !== "all") params.propertyType = propertyType as any;
      if (listingType && listingType !== "all") params.listingType = listingType as any;
      if (bedrooms && bedrooms !== "all") params.bedrooms = parseInt(bedrooms);
      if (maxPrice) params.maxPrice = parseInt(maxPrice);

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

  const checkSliderScroll = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, sliderType: string) => {
      if (!ref.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const canScrollLeft = scrollLeft > 0;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;

      if (sliderType === "closed") {
        setClosedCanScrollLeft(canScrollLeft);
        setClosedCanScrollRight(canScrollRight);
      } else if (sliderType === "popular") {
        setPopularCanScrollLeft(canScrollLeft);
        setPopularCanScrollRight(canScrollRight);
      } else if (sliderType === "latest") {
        setLatestCanScrollLeft(canScrollLeft);
        setLatestCanScrollRight(canScrollRight);
      }
    },
    []
  );

  const scrollSlider = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right", sliderType: string) => {
      if (!ref.current) return;
      const scrollAmount = 300;
      const newScrollLeft = direction === "left"
        ? ref.current.scrollLeft - scrollAmount
        : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
      setTimeout(() => checkSliderScroll(ref, sliderType), 300);
    },
    [checkSliderScroll]
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetchPropertiesFromAPI({});

        // Fetch recommended/popular properties from the dedicated endpoint
        const popularRes = await fetch("/api/public/popular");
        const popularData = await popularRes.json();
        if (popularData.success && popularData.data.length > 0) {
          setPopularProperties(popularData.data);
        } else {
          // Fallback to first 10 if no recommended properties
          setPopularProperties(response.data.slice(0, 10));
        }

        const closed = response.data
          .filter((p: NainaHubProperty) => p.status === "sold" || p.status === "rented")
          .slice(0, 10);
        setClosedDeals(closed);

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

        const projectsArray: Project[] = Array.from(projectsMap.entries())
          .map(([code, data]) => ({
            projectCode: code,
            projectNameEn: data.project.projectNameEn,
            projectNameTh: data.project.projectNameTh,
            count: data.count,
            image: data.image,
          }))
          .slice(0, 8);

        setProjects(projectsArray);

        setTimeout(() => {
          if (closedDealsSliderRef.current) {
            checkSliderScroll(closedDealsSliderRef, "closed");
          }
          if (popularSliderRef.current) {
            checkSliderScroll(popularSliderRef, "popular");
          }
          if (latestSliderRef.current) {
            checkSliderScroll(latestSliderRef, "latest");
          }
        }, 100);

        // Sort by updatedAt for latest listings
        const sortedByUpdate = [...response.data].sort((a, b) => {
          const dateA = new Date(a.updatedAt || 0).getTime();
          const dateB = new Date(b.updatedAt || 0).getTime();
          return dateB - dateA;
        });
        setLatestListings(sortedByUpdate.slice(0, 8));

        // Fetch blog posts
        const blogRes = await fetch("/api/public/blog?limit=3");
        const blogData = await blogRes.json();
        if (blogData.success) {
          setBlogPosts(blogData.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, [checkSliderScroll]);

  const formatPrice = (price: number | null | undefined) => {
    if (!price || price <= 0 || isNaN(price)) return null;
    return new Intl.NumberFormat("th-TH").format(price);
  };

  // Helper to get valid price (rent or sale)
  const getValidPrice = (property: Property) => {
    const rent = property.rentalRateNum;
    const sale = property.sellPriceNum;
    if (rent && rent > 0 && !isNaN(rent)) return { price: rent, isRent: true };
    if (sale && sale > 0 && !isNaN(sale)) return { price: sale, isRent: false };
    return null;
  };

  const formatPriceInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return new Intl.NumberFormat("th-TH").format(parseInt(numericValue));
  };

  const parsePriceInput = (formattedValue: string) => {
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
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header transparent />

      {/* Hero Section - Modern Light Design */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image}
                alt="Property"
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          {/* Light overlay */}
          <div className="absolute inset-0 bg-white opacity-[0.65]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Headline */}
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {t("hero.title1")}
              <br />
              <span className="text-[#eb3838] text-4xl">{t("hero.title2")}</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-lg text-gray-600 mb-8 transition-all duration-700 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              คัดทรัพย์ตรงงบ ทั้งคอนโด บ้าน และที่ดิน ใกล้ BTS/MRT ดูแลตั้งแต่เลือกจนถึงทําสัญญา
            </p>

            {/* Search Box */}
            <div
              className={`relative z-50 bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all duration-700 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {/* Tabs */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setListingType("rent")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    listingType === "rent"
                      ? "bg-[#eb3838] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t("search.rent")}
                </button>
                <button
                  onClick={() => setListingType("sale")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    listingType === "sale"
                      ? "bg-[#eb3838] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t("search.sale")}
                </button>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">{t("search.search")}</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
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
                        if (e.key === "Escape") {
                          setShowSuggestions(false);
                        }
                      }}
                      className="pl-10 h-12 border-gray-200 rounded-lg"
                    />
                    <SearchSuggestions
                      searchText={searchText}
                      isOpen={showSuggestions}
                      onClose={() => setShowSuggestions(false)}
                      onSelect={(value) => {
                        setSearchText(value);
                        setShowSuggestions(false);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">{t("search.propertyType")}</label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="h-12 border-gray-200 rounded-lg">
                      <SelectValue placeholder={t("search.all")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("search.all")}</SelectItem>
                      <SelectItem value="Condo">{t("search.condo")}</SelectItem>
                      <SelectItem value="SingleHouse">{t("search.singleHouse")}</SelectItem>
                      <SelectItem value="Townhouse">{t("search.townhouse")}</SelectItem>
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

                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">&nbsp;</label>
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-[#eb3838] hover:bg-[#d32f2f] text-white rounded-lg font-medium"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {t("search.searchButton")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`flex flex-wrap justify-center gap-8 transition-all duration-700 ${
                heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-500">{t("hero.stats.properties")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-500">{t("hero.stats.happyClients")}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-500">{t("hero.stats.years")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`transition-all duration-300 ${
                index === currentImageIndex
                  ? "w-8 h-2 bg-[#eb3838] rounded-full"
                  : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            <div className="text-center flex items-center gap-3">
              <div className="w-12 h-12 bg-[#eb3838]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-[#eb3838]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm">{t("features.wideSelection")}</h3>
                <p className="text-xs text-gray-500">{t("features.wideSelectionDesc")}</p>
              </div>
            </div>
            <div className="text-center flex items-center gap-3">
              <div className="w-12 h-12 bg-[#eb3838]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#eb3838]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm">{t("features.trusted")}</h3>
                <p className="text-xs text-gray-500">{t("features.trustedDesc")}</p>
              </div>
            </div>
            <div className="text-center flex items-center gap-3">
              <div className="w-12 h-12 bg-[#eb3838]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-[#eb3838]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm">{t("features.expertTeam")}</h3>
                <p className="text-xs text-gray-500">
                  {t("features.expertTeamDesc").split("__FREE__").map((part, i, arr) =>
                    i < arr.length - 1 ? (
                      <span key={i}>{part}<span className="text-[#eb3838] font-semibold">{t("features.free")}</span></span>
                    ) : <span key={i}>{part}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-center flex items-center gap-3">
              <div className="w-12 h-12 bg-[#eb3838]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-[#eb3838]" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 text-sm">{t("features.bestPrice")}</h3>
                <p className="text-xs text-gray-500">{t("features.bestPriceDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

  

      {/* Projects Section */}
      <section
        id="projects"
        ref={(el) => { observerRefs.current["projects"] = el; }}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-10 transition-all duration-700 ${
            isVisible["projects"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <span className="text-[#eb3838] text-sm font-medium">{t("sections.explore")}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("sections.popularProjects")}</h2>
            <p className="text-gray-500 mt-2">{t("sections.popularProjectsSubtitle")}</p>
          </div>

          {/* Masonry Grid - items 0 and 3 span 2 rows */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(160px,auto)]">
            {projects.slice(0, 8).map((project, index) => {
              const isTall = index === 0 || index === 3;
              return (
                <Link
                  key={project.projectCode}
                  href={`/search?project=${encodeURIComponent(project.projectCode)}`}
                  className={`group transition-all duration-500 ${
                    isVisible["projects"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  } ${isTall ? "row-span-2" : ""}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className={`relative overflow-hidden rounded-xl cursor-pointer h-full ${isTall ? "min-h-[336px]" : "h-40"}`}>
                    <Image
                      src={project.image}
                      alt={getProjectName(project)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className={`font-semibold line-clamp-1 mb-1 ${isTall ? "text-lg" : "text-base"}`}>
                        {getProjectName(project)}
                      </h3>
                      <p className="text-xs text-[#eb3838]">
                        {project.count} {t("common.properties")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/search">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-[#eb3838] hover:text-[#eb3838]">
                {t("sections.viewAllProjects")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    {/* Popular Properties Section */}
      <section
        id="popular"
        ref={(el) => { observerRefs.current["popular"] = el; }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-10 transition-all duration-700 ${
            isVisible["popular"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div>
              <span className="text-[#eb3838] text-sm font-medium">{t("sections.featured")}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("sections.popularProperties2")}</h2>
              <p className="text-gray-500 mt-2 max-w-lg">{t("sections.popularPropertiesSubtitle")}</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                    popularCanScrollLeft
                      ? "border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
                      : "border-gray-300 text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => scrollSlider(popularSliderRef, "left", "popular")}
                  disabled={!popularCanScrollLeft}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                    popularCanScrollRight
                      ? "border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
                      : "border-gray-300 text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => scrollSlider(popularSliderRef, "right", "popular")}
                  disabled={!popularCanScrollRight}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <Link href="/search">
                <Button variant="outline" className="border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white">
                  {t("common.viewAll")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Property Cards Slider */}
          <div
            ref={popularSliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            onScroll={() => checkSliderScroll(popularSliderRef, "popular")}
          >
            {popularProperties.slice(0, 10).map((property, index) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className={`flex-shrink-0 w-80 lg:w-[calc(33.333%-16px)] block transition-all duration-500 ${
                  isVisible["popular"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="property-card group h-full flex flex-col">
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <Image
                        src={property.imageUrls[0]}
                        alt={getPropertyTitle(property)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-gray-300" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {property.status === "available" ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#22c55e] text-white text-xs font-medium rounded-md">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t("property.confirmedAvailable")}</span>
                        </div>
                      ) : property.status === "sold" || property.status === "rented" ? (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 text-white text-xs font-medium rounded-md ${property.status === "sold" ? "bg-[#eb3838]" : "bg-blue-500"}`}>
                          <span>{t(`property.${property.status}`)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-500 text-white text-xs font-medium rounded-md">
                          <span>{t(`property.${property.status}`)}</span>
                        </div>
                      )}
                    </div>

                    {/* Listing Type Badge */}
                    <div className="absolute top-3 right-3">
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

                    {/* Favorite */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isFavorite(property.id) ? "fill-[#eb3838] text-[#eb3838]" : "text-gray-400"}`} />
                    </button>

                    {/* Image Count */}
                    {property.imageUrls && property.imageUrls.length > 1 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                        <Images className="w-3.5 h-3.5" />
                        <span>{property.imageUrls.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {getProjectName(property.project) || getPropertyTitle(property)}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {getPropertyAddressString(property) || "Bangkok"}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {property.rentalRateNum != null && property.rentalRateNum > 0 && (
                        <div className="text-xl font-bold text-gray-900">
                          ฿{formatPrice(property.rentalRateNum)}
                          <span className="text-sm font-normal text-gray-500">/{t("property.month")}</span>
                        </div>
                      )}
                      {property.sellPriceNum != null && property.sellPriceNum > 0 && (
                        <div className={`font-bold ${property.rentalRateNum ? "text-base text-gray-600" : "text-xl text-gray-900"}`}>
                          ฿{formatPrice(property.sellPriceNum)}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span>{property.bedRoomNum || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span>{property.bathRoomNum || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4 text-gray-400" />
                        <span>{getSize(property)} {t("property.sqm")}</span>
                      </div>
                    </div>

                    {/* Time Ago */}
                    {property.updatedAt && (
                      <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{t("property.updated")} {getTimeAgo(property.updatedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    <button className="w-full py-3 bg-[#eb3838] text-white font-medium rounded-lg hover:bg-[#d32f2f] transition-colors">
                      {t("property.inquireNow")}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings Section */}
      <section
        id="latest"
        ref={(el) => { observerRefs.current["latest"] = el; }}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-10 transition-all duration-700 ${
            isVisible["latest"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div>
              <span className="text-[#eb3838] text-sm font-medium">{t("sections.newArrivals")}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("sections.latestListings")}</h2>
              <p className="text-gray-500 mt-2 max-w-lg">{t("sections.latestListingsSubtitle")}</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                    latestCanScrollLeft
                      ? "border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
                      : "border-gray-300 text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => scrollSlider(latestSliderRef, "left", "latest")}
                  disabled={!latestCanScrollLeft}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${
                    latestCanScrollRight
                      ? "border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
                      : "border-gray-300 text-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => scrollSlider(latestSliderRef, "right", "latest")}
                  disabled={!latestCanScrollRight}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <Link href="/search">
                <Button variant="outline" className="border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white">
                  {t("common.viewAll")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Property Cards Slider */}
          <div
            ref={latestSliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            onScroll={() => checkSliderScroll(latestSliderRef, "latest")}
          >
            {latestListings.slice(0, 10).map((property, index) => (
              <Link
                key={property.id}
                href={`/property/${property.id}`}
                className={`flex-shrink-0 w-80 lg:w-[calc(33.333%-16px)] block transition-all duration-500 ${
                  isVisible["latest"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="property-card group h-full flex flex-col">
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <Image
                        src={property.imageUrls[0]}
                        alt={getPropertyTitle(property)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-gray-300" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {property.status === "available" ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#22c55e] text-white text-xs font-medium rounded-md">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t("property.confirmedAvailable")}</span>
                        </div>
                      ) : property.status === "sold" || property.status === "rented" ? (
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 text-white text-xs font-medium rounded-md ${property.status === "sold" ? "bg-[#eb3838]" : "bg-blue-500"}`}>
                          <span>{t(`property.${property.status}`)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-500 text-white text-xs font-medium rounded-md">
                          <span>{t(`property.${property.status}`)}</span>
                        </div>
                      )}
                    </div>

                    {/* Listing Type Badge */}
                    <div className="absolute top-3 right-3">
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

                    {/* Favorite */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isFavorite(property.id) ? "fill-[#eb3838] text-[#eb3838]" : "text-gray-400"}`} />
                    </button>

                    {/* Image Count */}
                    {property.imageUrls && property.imageUrls.length > 1 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                        <Images className="w-3.5 h-3.5" />
                        <span>{property.imageUrls.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {getProjectName(property.project) || getPropertyTitle(property)}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {getPropertyAddressString(property) || "Bangkok"}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      {property.rentalRateNum != null && property.rentalRateNum > 0 && (
                        <div className="text-xl font-bold text-gray-900">
                          ฿{formatPrice(property.rentalRateNum)}
                          <span className="text-sm font-normal text-gray-500">/{t("property.month")}</span>
                        </div>
                      )}
                      {property.sellPriceNum != null && property.sellPriceNum > 0 && (
                        <div className={`font-bold ${property.rentalRateNum ? "text-base text-gray-600" : "text-xl text-gray-900"}`}>
                          ฿{formatPrice(property.sellPriceNum)}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span>{property.bedRoomNum || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span>{property.bathRoomNum || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4 text-gray-400" />
                        <span>{getSize(property)} {t("property.sqm")}</span>
                      </div>
                    </div>

                    {/* Time Ago */}
                    {property.updatedAt && (
                      <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{t("property.updated")} {getTimeAgo(property.updatedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    <button className="w-full py-3 bg-[#eb3838] text-white font-medium rounded-lg hover:bg-[#d32f2f] transition-colors">
                      {t("property.inquireNow")}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Properties Section */}
      <section
        id="properties"
        ref={(el) => { observerRefs.current["properties"] = el; }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-10 transition-all duration-700 ${
            isVisible["properties"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <span className="text-[#eb3838] text-sm font-medium">{t("sections.discover")}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("sections.allProperties")}</h2>
            <p className="text-gray-500 mt-2">{t("search.resultsFound", { count: total })}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="h-72 animate-pulse bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("search.noPropertiesFound")}</h3>
              <p className="text-gray-500 mb-4">{t("search.tryAdjustFilters")}</p>
              <Button onClick={handleResetFilters} className="bg-[#eb3838] hover:bg-[#d32f2f] text-white">
                {t("search.resetFilters")}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.slice(0, 8).map((property, index) => (
                  <Link
                    key={property.id}
                    href={`/property/${property.id}`}
                    className={`block transition-all duration-500 ${
                      isVisible["properties"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                    style={{ transitionDelay: `${index * 40}ms` }}
                  >
                    <div className="property-card group h-full">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {property.imageUrls && property.imageUrls.length > 0 ? (
                          <Image
                            src={property.imageUrls[0]}
                            alt={getPropertyTitle(property) || "Property"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <MapPin className="w-10 h-10 text-gray-300" />
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          {property.rentalRateNum && property.rentalRateNum > 0 ? (
                            <span className="px-2 py-1 bg-[#eb3838] text-white text-xs font-medium rounded">
                              {t("property.forRent")}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded">
                              {t("property.forSale")}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(property.id);
                            }}
                            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md"
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${
                                isFavorite(property.id)
                                  ? "fill-[#eb3838] text-[#eb3838]"
                                  : "text-gray-400 hover:text-[#eb3838]"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        {getValidPrice(property) && (
                          <div className="mb-2">
                            <span className="text-lg font-bold text-gray-900">
                              ฿{formatPrice(getValidPrice(property)!.price)}
                            </span>
                            {getValidPrice(property)!.isRent && (
                              <span className="text-sm text-gray-500">/{t("property.month")}</span>
                            )}
                          </div>
                        )}

                        <h3 className="font-medium text-gray-900 line-clamp-1 mb-1 text-sm">
                          {getProjectName(property.project) || getPropertyTitle(property)}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3.5 h-3.5" />
                            {property.bedRoomNum}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5" />
                            {property.bathRoomNum}
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="w-3.5 h-3.5" />
                            {getSize(property)}m²
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* See All Button */}
              <div className="flex justify-center mt-10">
                <Link href="/search">
                  <Button variant="outline" className="border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white">
                    {t("common.viewAll")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Closed Deals Section */}
      <section
        id="closed-deals"
        ref={(el) => { observerRefs.current["closed-deals"] = el; }}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between mb-8 transition-all duration-1000 ${
            isVisible["closed-deals"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-6 h-6 text-[#eb3838]" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {t("sections.closedDeals")}
                </h2>
              </div>
              <p className="text-gray-600">{t("sections.closedDealsSubtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all ${
                  closedCanScrollLeft
                    ? "border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(closedDealsSliderRef, "left", "closed")}
                disabled={!closedCanScrollLeft}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className={`w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all ${
                  closedCanScrollRight
                    ? "border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white"
                    : "border-gray-300 text-gray-300 cursor-not-allowed"
                }`}
                onClick={() => scrollSlider(closedDealsSliderRef, "right", "closed")}
                disabled={!closedCanScrollRight}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            ref={closedDealsSliderRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            onScroll={() => checkSliderScroll(closedDealsSliderRef, "closed")}
          >
            {closedDeals.map((property, index) => (
              <div
                key={property.id}
                className={`flex-shrink-0 w-72 transition-all duration-500 ${
                  isVisible["closed-deals"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="group overflow-hidden border-0 rounded-xl bg-white h-full relative shadow-sm">
                  <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                      <div className={`absolute top-4 -right-8 w-40 text-center py-1 text-xs font-bold text-white transform rotate-45 shadow-lg ${
                        property.status === "sold" ? "bg-[#eb3838]" : "bg-blue-500"
                      }`}>
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
                    {getValidPrice(property) && (
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                          ฿{formatPrice(getValidPrice(property)!.price)}
                        </p>
                      </div>
                    )}
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
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-[#eb3838]" />
                        {property.bedRoomNum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3 text-[#eb3838]" />
                        {property.bathRoomNum}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="w-3 h-3 text-[#eb3838]" />
                        {getSize(property)} m²
                      </span>
                    </div>
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
        ref={(el) => { observerRefs.current["how-it-works"] = el; }}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-700 ${
            isVisible["how-it-works"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <span className="text-[#eb3838] text-sm font-medium">{t("homePage.howItWorks")}</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              {t("homePage.weHelpSell")} {t("homePage.withGuaranteed")}{" "}
              <span className="text-[#eb3838]">{t("homePage.guaranteedText")}</span> {t("homePage.services")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`text-center transition-all duration-700 ${
              isVisible["how-it-works"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`} style={{ transitionDelay: "100ms" }}>
              <div className="w-20 h-20 mx-auto mb-6 bg-[#eb3838]/10 rounded-2xl flex items-center justify-center">
                <PhoneCall className="w-10 h-10 text-[#eb3838]" />
              </div>
              <span className="text-[#eb3838] text-sm font-medium">{t("homePage.step1")}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{t("homePage.step1Line1")}</h3>
              <p className="text-gray-500 mt-1">{t("homePage.step1Line2")}</p>
            </div>

            <div className={`text-center transition-all duration-700 ${
              isVisible["how-it-works"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`} style={{ transitionDelay: "200ms" }}>
              <div className="w-20 h-20 mx-auto mb-6 bg-[#eb3838]/10 rounded-2xl flex items-center justify-center">
                <Home className="w-10 h-10 text-[#eb3838]" />
              </div>
              <span className="text-[#eb3838] text-sm font-medium">{t("homePage.step2")}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{t("homePage.step2Line1")}</h3>
              <p className="text-gray-500 mt-1">{t("homePage.step2Line2")}</p>
            </div>

            <div className={`text-center transition-all duration-700 ${
              isVisible["how-it-works"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`} style={{ transitionDelay: "300ms" }}>
              <div className="w-20 h-20 mx-auto mb-6 bg-[#eb3838]/10 rounded-2xl flex items-center justify-center">
                <FileCheck className="w-10 h-10 text-[#eb3838]" />
              </div>
              <span className="text-[#eb3838] text-sm font-medium">{t("homePage.step3")}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{t("homePage.step3Line1")}</h3>
              <p className="text-gray-500 mt-1">{t("homePage.step3Line2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section
        id="blog"
        ref={(el) => { observerRefs.current["blog"] = el; }}
        className="py-16 bg-gray-100"
      >
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`flex flex-col md:flex-row md:items-end md:justify-between mb-10 transition-all duration-700 ${
            isVisible["blog"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <div>
              <span className="text-[#eb3838] text-sm font-medium">{t("sections.latestNews")}</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{t("sections.blogTitle")}</h2>
              <p className="text-gray-500 mt-2 max-w-lg">{t("sections.blogSubtitle")}</p>
            </div>
            <Link href="/blog" className="mt-4 md:mt-0">
              <Button variant="outline" className="border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white">
                {t("sections.viewAllPosts")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Blog Cards Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className={`group block transition-all duration-500 ${
                    isVisible["blog"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#eb3838]/50 hover:shadow-lg transition-all h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={getBlogTitle(blog)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <FileText className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      {blog.publishedAt && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatBlogDate(blog.publishedAt)}
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#eb3838] transition-colors line-clamp-2">
                        {getBlogTitle(blog)}
                      </h3>
                      {getBlogExcerpt(blog) && (
                        <p className="text-gray-500 text-sm line-clamp-2 flex-1">
                          {getBlogExcerpt(blog)}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-[#eb3838] text-sm font-medium">
                        {t("blog.readMore")}
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
              isVisible["blog"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-gray-300" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        ref={(el) => { observerRefs.current["contact"] = el; }}
        className="py-20 bg-[#eb3838]"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center transition-all duration-700 ${
            isVisible["contact"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 ">
              {t("cta.title")}
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => { navigator.clipboard.writeText("0962622888"); toast.success(t("common.copiedPhone")); }}
                className="bg-white text-gray-900! hover:bg-gray-100 font-medium px-8"
              >
                <Phone className="w-5 h-5 mr-2" />
                096-262-2888
              </Button>
              <Button
                onClick={() => router.push("/contact")}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#eb3838] font-medium px-8"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {t("nav.contact")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white">10+</div>
              <div className="text-gray-400 mt-1">{t("stats.yearsExperience")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">20+</div>
              <div className="text-gray-400 mt-1">{t("stats.awards")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">879</div>
              <div className="text-gray-400 mt-1">{t("stats.propertiesListed")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">1000+</div>
              <div className="text-gray-400 mt-1">{t("stats.happyClients")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
