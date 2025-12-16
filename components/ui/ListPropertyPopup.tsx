"use client";

import { useState, useEffect } from "react";
import { X, Home, Phone, User, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

interface ListPropertyPopupProps {
  delayMs?: number; // Default 60000ms (1 minute)
}

export default function ListPropertyPopup({ delayMs = 60000 }: ListPropertyPopupProps) {
  const t = useTranslations("listPropertyPopup");
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem("list-property-popup-shown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("list-property-popup-shown", "true");
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          type: "list-property",
          source: "popup",
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div
        className="popup-content relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {isSubmitted ? (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("successTitle")}</h3>
            <p className="text-gray-500">{t("successMessage")}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#eb3838]/10 rounded-full flex items-center justify-center">
                <Home className="w-7 h-7 text-[#eb3838]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h2>
              <p className="text-gray-500">{t("subtitle")}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("nameLabel")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-modern pl-10"
                    placeholder={t("namePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("phoneLabel")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-modern pl-10"
                    placeholder={t("phonePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-modern pl-10"
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("propertyTypeLabel")}
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="select-modern"
                >
                  <option value="">{t("propertyTypePlaceholder")}</option>
                  <option value="condo">{t("condo")}</option>
                  <option value="house">{t("house")}</option>
                  <option value="townhouse">{t("townhouse")}</option>
                  <option value="land">{t("land")}</option>
                  <option value="commercial">{t("commercial")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("messageLabel")}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-modern min-h-[80px] resize-none"
                  placeholder={t("messagePlaceholder")}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#eb3838] text-white font-semibold rounded-lg hover:bg-[#d32f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("submitting") : t("submitButton")}
              </button>
            </form>

            {/* Alternative Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              {t("orText")}{" "}
              <Link
                href="/list-property"
                className="text-[#eb3838] hover:underline font-medium"
                onClick={handleClose}
              >
                {t("visitPageLink")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
