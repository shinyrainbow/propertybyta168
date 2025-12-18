"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useTranslations } from "next-intl";

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacy");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-1 bg-[#eb3838] mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">1</span>
              {t("intro.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("intro.content")}
            </p>
          </section>

          {/* Data Collection */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">2</span>
              {t("collection.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("collection.content")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("collection.item1")}</li>
              <li>{t("collection.item2")}</li>
              <li>{t("collection.item3")}</li>
              <li>{t("collection.item4")}</li>
            </ul>
          </section>

          {/* Data Usage */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">3</span>
              {t("usage.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("usage.content")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("usage.item1")}</li>
              <li>{t("usage.item2")}</li>
              <li>{t("usage.item3")}</li>
              <li>{t("usage.item4")}</li>
            </ul>
          </section>

          {/* Data Protection */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">4</span>
              {t("protection.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("protection.content")}
            </p>
          </section>

          {/* Data Sharing */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">5</span>
              {t("sharing.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("sharing.content")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("sharing.item1")}</li>
              <li>{t("sharing.item2")}</li>
              <li>{t("sharing.item3")}</li>
            </ul>
          </section>

          {/* User Rights */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">6</span>
              {t("rights.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("rights.content")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("rights.item1")}</li>
              <li>{t("rights.item2")}</li>
              <li>{t("rights.item3")}</li>
              <li>{t("rights.item4")}</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">7</span>
              {t("cookies.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("cookies.content")}
            </p>
          </section>

          {/* Contact */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">8</span>
              {t("contact.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("contact.content")}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-medium">Property by Ta 168</p>
              <p className="text-gray-600">Email: propertybyta168@gmail.com</p>
              <p className="text-gray-600">โทร: 096-262-2888</p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
