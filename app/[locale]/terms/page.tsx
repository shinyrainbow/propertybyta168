"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useTranslations } from "next-intl";

export default function TermsOfServicePage() {
  const t = useTranslations("terms");

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

          {/* Acceptance */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">1</span>
              {t("acceptance.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("acceptance.content")}
            </p>
          </section>

          {/* Services */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">2</span>
              {t("services.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("services.content")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("services.item1")}</li>
              <li>{t("services.item2")}</li>
              <li>{t("services.item3")}</li>
              <li>{t("services.item4")}</li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">3</span>
              {t("responsibilities.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("responsibilities.content")}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>{t("responsibilities.item1")}</li>
              <li>{t("responsibilities.item2")}</li>
              <li>{t("responsibilities.item3")}</li>
              <li>{t("responsibilities.item4")}</li>
            </ul>
          </section>

          {/* Property Information */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">4</span>
              {t("propertyInfo.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("propertyInfo.content")}
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">5</span>
              {t("intellectual.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("intellectual.content")}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">6</span>
              {t("liability.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("liability.content")}
            </p>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">7</span>
              {t("termination.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("termination.content")}
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">8</span>
              {t("law.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("law.content")}
            </p>
          </section>

          {/* Changes */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">9</span>
              {t("changes.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {t("changes.content")}
            </p>
          </section>

          {/* Contact */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#eb3838] text-white rounded-full flex items-center justify-center text-sm">10</span>
              {t("contact.title")}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {t("contact.content")}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-medium">Property by Ta 168</p>
              <p className="text-gray-600">Email: propertybyta168@gmail.com</p>
              <p className="text-gray-600">โทร: 061-259-6657</p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
