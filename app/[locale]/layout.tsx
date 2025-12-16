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
import { locales, type Locale } from "@/i18n/config";
import FloatingLine from "@/components/layout/floating-line";

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
    default: "PropertyByTA168 - Premium Real Estate Chiangmai",
    template: "%s | PropertyByTA168",
  },
  description:
    "Find condos, single houses, townhouses for rent and sale in the best locations of Chiangmai. Professional real estate consulting services.",
  keywords: [
    "real estate",
    "condo",
    "single house",
    "townhouse",
    "condo for rent",
    "buy condo",
    "Chiangmai condo",
    "house for rent",
    "house for sale",
    "PropertyByTA168",
    "Property By TA168",
    "real estate Chiangmai",
    "บ้านเชียงใหม่",
    "คอนโดเชียงใหม่",
    "อสังหาริมทรัพย์เชียงใหม่",
  ],
  authors: [{ name: "PropertyByTA168" }],
  creator: "PropertyByTA168",
  publisher: "PropertyByTA168",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://propertybyta168.com",
    siteName: "PropertyByTA168",
    title: "PropertyByTA168 - Premium Real Estate Chiangmai",
    description:
      "Find condos, single houses, townhouses for rent and sale in the best locations of Chiangmai.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyByTA168 - Premium Real Estate Chiangmai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyByTA168 - Premium Real Estate Chiangmai",
    description:
      "Find condos, single houses, townhouses for rent and sale in the best locations of Chiangmai.",
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
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${kanit.variable} ${orbitron.variable} font-sans antialiased`}>
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <ConfirmDialogProvider>
              {children}
              <FloatingLine />
            </ConfirmDialogProvider>
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
