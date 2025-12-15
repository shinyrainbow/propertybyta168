import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  // Fetch blog data for metadata
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: {
      title: true,
      titleEn: true,
      titleZh: true,
      excerpt: true,
      excerptEn: true,
      excerptZh: true,
      coverImage: true,
    },
  });

  if (!blog) {
    return {
      title: locale === "th" ? "ไม่พบบทความ" : locale === "zh" ? "未找到文章" : "Blog Not Found",
    };
  }

  // Get localized title
  const title =
    locale === "en"
      ? blog.titleEn || blog.title
      : locale === "zh"
      ? blog.titleZh || blog.title
      : blog.title;

  // Get localized excerpt
  const description =
    locale === "en"
      ? blog.excerptEn || blog.excerpt
      : locale === "zh"
      ? blog.excerptZh || blog.excerpt
      : blog.excerpt;

  return {
    title: `${title} | Sky Pro Property`,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      type: "article",
      url: `https://skyproproperties.com/${locale}/blog/${slug}`,
      images: blog.coverImage
        ? [
            {
              url: blog.coverImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [
            {
              url: "/og-image.jpg",
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: blog.coverImage ? [blog.coverImage] : ["/og-image.jpg"],
    },
    alternates: {
      canonical: `https://skyproproperties.com/${locale}/blog/${slug}`,
      languages: {
        "th-TH": `https://skyproproperties.com/th/blog/${slug}`,
        "en-US": `https://skyproproperties.com/en/blog/${slug}`,
        "zh-CN": `https://skyproproperties.com/zh/blog/${slug}`,
      },
    },
  };
}

export default function BlogPostLayout({ children }: Props) {
  return children;
}
