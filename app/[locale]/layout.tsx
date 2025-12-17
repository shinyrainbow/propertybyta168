import type { Metadata, Viewport } from "next";
import { Kanit, Orbitron } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmDialogProvider } from "@/components/ui/confirm-dialog";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { locales, type Locale } from "@/i18n/config";
import FloatingLine from "@/components/layout/floating-line";
import ListPropertyPopup from "@/components/ui/ListPropertyPopup";

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
  display: "swap",
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#eb3838",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://propertybyta168.com"),
  title: {
    default: "propertybyta168 - Premium Real Estate Bangkok",
    template: "%s | propertybyta168",
  },
  description:
    "Find condos, single houses, townhouses for rent and sale in the best locations of Bangkok. Professional real estate consulting services.",
  keywords: [
    "real estate",
    "condo",
    "single house",
    "townhouse",
    "condo for rent",
    "buy condo",
    "Bangkok condo",
    "house for rent",
    "house for sale",
    "propertybyta168",
    "Property By TA168",
    "real estate Bangkok",
    "บ้านกรุงเทพ",
    "คอนโดกรุงเทพ",
    "อสังหาริมทรัพย์กรุงเทพ",
  ],
  authors: [{ name: "propertybyta168" }],
  creator: "propertybyta168",
  publisher: "propertybyta168",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://propertybyta168.com",
    siteName: "propertybyta168",
    title: "propertybyta168 - Premium Real Estate Bangkok",
    description:
      "Find condos, single houses, townhouses for rent and sale in the best locations of Bangkok.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "propertybyta168 - Premium Real Estate Bangkok",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "propertybyta168 - Premium Real Estate Bangkok",
    description:
      "Find condos, single houses, townhouses for rent and sale in the best locations of Bangkok.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://propertybyta168.com",
    languages: {
      "th-TH": "https://propertybyta168.com",
      "en-US": "https://propertybyta168.com/en",
      "zh-CN": "https://propertybyta168.com/zh",
    },
  },
  category: "real estate",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/logo-img-white.png" sizes="any" />
        <link rel="icon" href="/logo-img-white.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-img-white.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${kanit.variable} ${orbitron.variable} font-sans antialiased`}>
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <FavoritesProvider>
              <ConfirmDialogProvider>
                {children}
                <FloatingLine />
                <ListPropertyPopup />
              </ConfirmDialogProvider>
            </FavoritesProvider>
          </AuthSessionProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
      {/* {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )} */}
    </html>
  );
}
