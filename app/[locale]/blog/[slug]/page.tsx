"use client";

import { useEffect, useState, use } from "react";
import { FileText, Calendar, ArrowLeft, Share2, Home, Facebook, Link2, MessageCircle, TrendingUp, User, Clock } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogSection {
  id: string;
  order: number;
  imageUrl: string | null;
  content: string | null;
  contentEn: string | null;
  contentZh: string | null;
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
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const t = useTranslations("blog");
  const locale = useLocale();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/public/blog/${resolvedParams.slug}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.data);
          // Related blogs are now included in the API response
          if (data.data.relatedBlogs) {
            setRelatedBlogs(data.data.relatedBlogs);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [resolvedParams.slug]);

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

  const getLocalizedContent = (section: BlogSection) => {
    switch (locale) {
      case "en":
        return section.contentEn || section.content;
      case "zh":
        return section.contentZh || section.content;
      default:
        return section.content;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(
      locale === "th"
        ? "th-TH"
        : locale === "zh"
        ? "zh-CN"
        : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString(
      locale === "th" ? "th-TH" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = blog ? getLocalizedTitle(blog) : "";

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "x") {
      window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    } else if (platform === "line") {
      window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, "_blank");
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16" />

        {/* Breadcrumb Skeleton */}
        <div className="bg-[#0d1117] py-4 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-12" />
              <div className="h-4 bg-gray-700 rounded w-1" />
              <div className="h-4 bg-gray-700 rounded w-12" />
              <div className="h-4 bg-gray-700 rounded w-1" />
              <div className="h-4 bg-gray-700 rounded w-32" />
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Article Content Skeleton */}
              <div className="lg:col-span-2">
                <article className="animate-pulse">
                  {/* Header Skeleton */}
                  <header className="mb-8">
                    <div className="h-10 bg-gray-200 rounded mb-4 w-3/4" />
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />

                    {/* Meta Info Skeleton */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-32" />
                    </div>

                    {/* Social Share Skeleton */}
                    <div className="flex items-center gap-2 pb-6 border-b border-gray-200">
                      <div className="h-4 bg-gray-200 rounded w-12" />
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                      <div className="w-9 h-9 bg-gray-200 rounded-lg" />
                    </div>
                  </header>

                  {/* Article Content Card Skeleton */}
                  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    {/* Cover Image Skeleton */}
                    <div className="relative w-full aspect-video rounded-lg bg-gray-200 mb-8" />

                    {/* Content Skeleton */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-4/5" />
                      </div>
                      <div className="my-8 h-64 bg-gray-200 rounded-lg" />
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Related Articles Skeleton */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2" />
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-20 h-16 rounded-lg bg-gray-200 shrink-0" />
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
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded-full w-20" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16" />
        <div className="container mx-auto px-4 py-20 text-center bg-gray-50">
          <FileText className="w-20 h-20 mx-auto text-gray-600 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("notFound")}
          </h1>
          <p className="text-gray-400 mb-8">
            {t("notFoundDesc")}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/blog">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:border-[#C9A227] hover:text-[#C9A227]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToBlog")}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="gold">
                <Home className="w-4 h-4 mr-2" />
                {t("backHome")}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Breadcrumb */}
      <div className="bg-[#0d1117] py-4 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-[#C9A227] transition-colors">
              {t("home")}
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/blog" className="text-gray-400 hover:text-[#C9A227] transition-colors">
              {t("blog")}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#C9A227] truncate max-w-[200px]">{getLocalizedTitle(blog)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <article
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                {/* Article Header */}
                <header className="mb-8">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {getLocalizedTitle(blog)}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#C9A227] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#111928]" />
                      </div>
                      <span>{t("author")}</span>
                    </div>
                    {blog.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#C9A227]" />
                        <span>{formatDateTime(blog.publishedAt)}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Share Buttons */}
                  <div className="flex items-center gap-2 pb-6 border-b border-white/10">
                    <span className="text-gray-400 text-sm mr-2">{t("share")}:</span>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-9 h-9 bg-[#1877F2] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <Facebook className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleShare("x")}
                      className="w-9 h-9 bg-black rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleShare("line")}
                      className="w-9 h-9 bg-[#00B900] rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleShare()}
                      className="w-9 h-9 bg-[#1F2937] border border-white/20 rounded-lg flex items-center justify-center hover:border-[#C9A227] hover:text-[#C9A227] transition-all text-gray-400"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                </header>

                {/* Article Content Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                  {/* Cover Image */}
                  {blog.coverImage && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 mx-auto max-w-3xl">
                      <Image
                        src={blog.coverImage}
                        alt={getLocalizedTitle(blog)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Article Sections */}
                  <div className="space-y-6">
                    {blog.sections.map((section, index) => (
                      <div
                        key={section.id}
                        className={`transition-all duration-700 ${
                          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                        }`}
                        style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                      >
                        {/* Section Content - Text First */}
                        {getLocalizedContent(section) && (
                          <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{
                              __html: getLocalizedContent(section)?.replace(/\n/g, "<br />") || "",
                            }}
                          />
                        )}

                        {/* Section Image - Between sections with margins */}
                        {section.imageUrl && (
                          <div className="my-8 mx-4 md:mx-8 lg:mx-12">
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
                              <Image
                                src={section.imageUrl}
                                alt={`Section ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* No sections message */}
                    {blog.sections.length === 0 && (
                      <div className="text-center py-12 text-gray-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>This blog post has no content yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Share */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{t("shareArticle")}</span>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="w-8 h-8 bg-[#1877F2] rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <Facebook className="w-3.5 h-3.5 text-white" />
                      </button>
                      <button
                        onClick={() => handleShare("x")}
                        className="w-8 h-8 bg-black rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleShare("line")}
                        className="w-8 h-8 bg-[#00B900] rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                    <Link href="/blog">
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:border-[#C9A227] hover:text-[#C9A227]">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("backToBlog")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Related Articles */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#C9A227]" />
                    {t("relatedArticles")}
                  </h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog.id}
                        href={`/blog/${relatedBlog.slug}`}
                        className="group flex gap-3"
                      >
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {relatedBlog.coverImage ? (
                            <Image
                              src={relatedBlog.coverImage}
                              alt={getLocalizedTitle(relatedBlog)}
                              fill
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
                            {getLocalizedTitle(relatedBlog)}
                          </h4>
                          {relatedBlog.publishedAt && (
                            <p className="text-gray-500 text-[10px] mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(relatedBlog.publishedAt)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                    {relatedBlogs.length === 0 && (
                      <p className="text-gray-500 text-sm">{t("noRelatedArticles")}</p>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-gray-900 font-semibold mb-4">{t("categories")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "categoryRealEstate", label: t("categoryRealEstate") },
                      { key: "categoryMarketTrends", label: t("categoryMarketTrends") },
                      { key: "categoryTips", label: t("categoryTips") },
                      { key: "categoryInvestment", label: t("categoryInvestment") },
                      { key: "categoryNews", label: t("categoryNews") },
                    ].map((tag) => (
                      <span
                        key={tag.key}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 hover:border-[#C9A227]/50 hover:text-[#C9A227] transition-colors cursor-pointer"
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact CTA */}
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
        </div>
      </section>

      {/* Related Articles Section - Bottom */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 bg-[#0d1117]">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C9A227]" />
              {t("moreArticles")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedBlogs.slice(0, 4).map((relatedBlog) => (
                <Link
                  key={relatedBlog.id}
                  href={`/blog/${relatedBlog.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[#C9A227]/50 transition-all">
                    <div className="relative h-36 overflow-hidden">
                      {relatedBlog.coverImage ? (
                        <Image
                          src={relatedBlog.coverImage}
                          alt={getLocalizedTitle(relatedBlog)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <FileText className="w-10 h-10 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-gray-900 text-sm font-medium line-clamp-2 group-hover:text-[#C9A227] transition-colors mb-2">
                        {getLocalizedTitle(relatedBlog)}
                      </h3>
                      {relatedBlog.publishedAt && (
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(relatedBlog.publishedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
