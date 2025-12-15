"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight, Home, Eye, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

interface BlogSection {
  id: string;
  imageUrl: string | null;
  content: string | null;
  contentEn: string | null;
  contentZh: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  nameEn: string | null;
  nameZh: string | null;
  slug: string;
  color: string;
  _count?: {
    blogs: number;
  };
}

interface Blog {
  id: string;
  title: string;
  titleEn: string | null;
  titleZh: string | null;
  slug: string;
  excerpt: string | null;
  excerptEn: string | null;
  excerptZh: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  sections: BlogSection[];
  category: BlogCategory | null;
}

export default function BlogPage() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/public/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs (with optional category filter)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const url = selectedCategory
          ? `/api/public/blog?category=${selectedCategory}`
          : "/api/public/blog";
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setBlogs(data.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedCategory]);

  const getLocalizedTitle = (blog: Blog) => {
    switch (locale) {
      case "en":
        return blog.titleEn || blog.title;
      case "zh":
        return blog.titleZh || blog.title;
      default:
        return blog.title;
    }
  };

  const getLocalizedExcerpt = (blog: Blog) => {
    switch (locale) {
      case "en":
        return blog.excerptEn || blog.excerpt;
      case "zh":
        return blog.excerptZh || blog.excerpt;
      default:
        return blog.excerpt;
    }
  };

  const getLocalizedCategoryName = (category: BlogCategory) => {
    switch (locale) {
      case "en":
        return category.nameEn || category.name;
      case "zh":
        return category.nameZh || category.name;
      default:
        return category.name;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get featured blog (first one) and rest
  const featuredBlog = blogs[0];
  const restBlogs = blogs.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section - Dark */}
      <section className="relative py-16 bg-[#0d1117]">
        <div
          className={`container mx-auto px-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="max-w-3xl">
            <p className="text-[#C9A227] text-xs uppercase tracking-widest mb-3">BLOG & NEWS</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                {/* Featured Article Skeleton */}
                <div className="rounded-xl overflow-hidden bg-white border border-gray-200 animate-pulse">
                  <div className="h-96 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-8 bg-gray-200 rounded mb-3 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>

                {/* Grid Articles Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                      <div className="h-44 bg-gray-200" />
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Popular Articles Skeleton */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories Skeleton */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />
                    <div className="flex flex-wrap gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded-full w-20" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 text-lg mb-2">{t("noBlogs")}</p>
              <p className="text-gray-500 text-sm mb-6">Check back later for updates</p>
              <Link href="/">
                <Button variant="gold">
                  <Home className="w-4 h-4 mr-2" />
                  {t("backHome")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Featured Article */}
                {featuredBlog && (
                  <Link
                    href={`/blog/${featuredBlog.slug}`}
                    className={`group block transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                  >
                    <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-[#C9A227]/50 hover:shadow-lg transition-all">
                      {/* Featured Image */}
                      <div className="relative h-72 md:h-96 overflow-hidden">
                        {featuredBlog.coverImage ? (
                          <Image
                            src={featuredBlog.coverImage}
                            alt={getLocalizedTitle(featuredBlog)}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <FileText className="w-20 h-20 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Featured Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-[#C9A227] text-[#111928] text-xs font-semibold rounded-full flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            FEATURED
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-[#C9A227] transition-colors line-clamp-2">
                          {getLocalizedTitle(featuredBlog)}
                        </h2>

                        {getLocalizedExcerpt(featuredBlog) && (
                          <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                            {getLocalizedExcerpt(featuredBlog)}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-gray-400 text-xs">
                          {featuredBlog.publishedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(featuredBlog.publishedAt)}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[#C9A227]">
                            {t("readMore")}
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Rest of Articles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {restBlogs.map((blog, index) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className={`group block transition-all duration-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                      }`}
                      style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#C9A227]/50 transition-all h-full">
                        {/* Image */}
                        <div className="relative h-44 overflow-hidden">
                          {blog.coverImage ? (
                            <Image
                              src={blog.coverImage}
                              alt={getLocalizedTitle(blog)}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              loading={index < 2 ? "eager" : "lazy"}
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                              <FileText className="w-12 h-12 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#C9A227] transition-colors line-clamp-2 text-sm">
                            {getLocalizedTitle(blog)}
                          </h3>

                          {blog.publishedAt && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <Calendar className="w-3 h-3" />
                              {formatDate(blog.publishedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Popular Articles */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#C9A227]" />
                      Popular Articles
                    </h3>
                    <div className="space-y-4">
                      {blogs.slice(0, 5).map((blog, index) => (
                        <Link
                          key={blog.id}
                          href={`/blog/${blog.slug}`}
                          className="group flex gap-3"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {blog.coverImage ? (
                              <Image
                                src={blog.coverImage}
                                alt={getLocalizedTitle(blog)}
                                fill
                                sizes="64px"
                                loading="lazy"
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-gray-900 text-xs font-medium line-clamp-2 group-hover:text-[#C9A227] transition-colors">
                              {getLocalizedTitle(blog)}
                            </h4>
                            {blog.publishedAt && (
                              <p className="text-gray-500 text-[10px] mt-1">
                                {formatDate(blog.publishedAt)}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Categories / Tags */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-gray-900 font-semibold mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {/* All Categories button */}
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedCategory === null
                            ? "bg-[#C9A227] text-white border-[#C9A227]"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:border-[#C9A227]/50 hover:text-[#C9A227]"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.slug)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            selectedCategory === category.slug
                              ? "text-white border-[#C9A227]"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:border-[#C9A227]/50 hover:text-[#C9A227]"
                          }`}
                          style={{
                            backgroundColor: selectedCategory === category.slug ? category.color : undefined,
                          }}
                        >
                          {getLocalizedCategoryName(category)}
                          {category._count && category._count.blogs > 0 && (
                            <span className="ml-1.5 opacity-70">({category._count.blogs})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter CTA */}
                  <div className="bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/5 rounded-xl border border-[#C9A227]/30 p-5">
                    <h3 className="text-gray-900 font-semibold mb-2">{t("needHelp")}</h3>
                    <p className="text-gray-600 text-xs mb-4">{t("needHelpDesc")}</p>
                    <Link href="/contact">
                      <Button variant="gold" size="sm" className="w-full text-xs">
                        {t("contactUs")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
