"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { FileText, Calendar, ArrowRight, Home, TrendingUp } from "lucide-react";
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

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const t = useTranslations("blog");
  const locale = useLocale();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCategoryAndBlogs = async () => {
      try {
        setLoading(true);

        // Fetch blogs by category
        const blogsRes = await fetch(`/api/public/blog?category=${categorySlug}`);
        const blogsData = await blogsRes.json();

        if (blogsData.success && blogsData.data.length > 0) {
          setBlogs(blogsData.data);
          // Get category from first blog
          if (blogsData.data[0].category) {
            setCategory(blogsData.data[0].category);
          }
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryAndBlogs();
    }
  }, [categorySlug]);

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

  const getLocalizedCategoryName = (cat: BlogCategory) => {
    switch (locale) {
      case "en":
        return cat.nameEn || cat.name;
      case "zh":
        return cat.nameZh || cat.name;
      default:
        return cat.name;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative py-16 bg-[#0d1117]">
        <div
          className={`container mx-auto px-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="max-w-3xl">
            <Link href="/blog" className="text-[#C9A227] text-xs uppercase tracking-widest mb-3 inline-flex items-center gap-2 hover:underline">
              <ArrowRight className="w-3 h-3 rotate-180" />
              BACK TO BLOG
            </Link>
            {category && (
              <>
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {getLocalizedCategoryName(category)}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {getLocalizedCategoryName(category)}
                </h1>
                <p className="text-gray-400">
                  {blogs.length} {blogs.length === 1 ? "post" : "posts"} in this category
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A227]"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 text-lg mb-2">No blog posts in this category yet</p>
              <p className="text-gray-500 text-sm mb-6">Check back later for updates</p>
              <Link href="/blog">
                <Button variant="gold">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className={`group block transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#C9A227]/50 hover:shadow-lg transition-all h-full">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {blog.coverImage ? (
                        <Image
                          src={blog.coverImage}
                          alt={getLocalizedTitle(blog)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <FileText className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      {blog.category && (
                        <div className="absolute top-3 right-3">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: blog.category.color }}
                          >
                            {getLocalizedCategoryName(blog.category)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#C9A227] transition-colors line-clamp-2">
                        {getLocalizedTitle(blog)}
                      </h3>

                      {getLocalizedExcerpt(blog) && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {getLocalizedExcerpt(blog)}
                        </p>
                      )}

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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
