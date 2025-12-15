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
  themeColor: "#0D1B2A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://skyproproperties.com"),
  title: {
    default: "Sky Pro Property - Premium Real Estate Chiangmai",
    template: "%s | Sky Pro Property",
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
    "Chiangmai condo",
    "house for rent",
    "house for sale",
    "Sky Pro Property",
    "real estate Chiangmai",
    "Sukhumvit",
    "Thonglor",
    "Ekkamai",
    "Sathorn",
    "Silom",
  ],
  authors: [{ name: "Sky Pro Property" }],
  creator: "Sky Pro Property",
  publisher: "Sky Pro Property",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "https://skyproproperties.com",
    siteName: "Sky Pro Property",
    title: "Sky Pro Property - Premium Real Estate Chiangmai",
    description:
      "Find condos, single houses, townhouses for rent and sale in the best locations of Chiangmai.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sky Pro Property - Premium Real Estate Chiangmai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sky Pro Property - Premium Real Estate Chiangmai",
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
    canonical: "https://skyproproperties.com",
    languages: {
      "th-TH": "https://skyproproperties.com",
      "en-US": "https://skyproproperties.com/en",
      "zh-CN": "https://skyproproperties.com/zh",
      "ja-JP": "https://skyproproperties.com/ja",
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
        <link rel="icon" href="/header-logo.png" sizes="any" />
        <link rel="icon" href="/header-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/header-logo.png" />
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
