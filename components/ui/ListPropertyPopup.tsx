"use client";

import { useState, useEffect, useRef } from "react";
import { X, Home, Phone, User, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ListPropertyPopupProps {
  delayMs?: number; // Default 60000ms (1 minute)
}

export default function ListPropertyPopup({ delayMs = 60000 }: ListPropertyPopupProps) {
  const t = useTranslations("listPropertyPopup");
  const [isOpen, setIsOpen] = useState(false);
  const hasShownRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    contactId: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Skip if already shown
    if (hasShownRef.current) return;

    // Check if popup was already shown in this session
    const alreadyShown = sessionStorage.getItem("list-property-popup-shown");
    if (alreadyShown) {
      hasShownRef.current = true;
      return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      if (!hasShownRef.current) {
        hasShownRef.current = true;
        setIsOpen(true);
        sessionStorage.setItem("list-property-popup-shown", "true");
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build message with optional fields
      const messageParts = [];
      if (formData.contactId) messageParts.push(`Line/WhatsApp/WeChat: ${formData.contactId}`);
      if (formData.message) messageParts.push(formData.message);

      const response = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: messageParts.length > 0 ? messageParts.join("\n") : null,
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl overflow-hidden max-w-[720px] w-full max-h-[90vh] flex shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Image (hidden on mobile) */}
        <div className="hidden md:block w-[280px] relative flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"
            alt="Property"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="font-semibold text-lg mb-1">{t("title")}</h3>
            <p className="text-white/80 text-xs">{t("subtitle")}</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-5 md:p-6 relative overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{t("successTitle")}</h3>
              <p className="text-gray-500 text-sm">{t("successMessage")}</p>
            </div>
          ) : (
            <>
              {/* Mobile Header */}
              <div className="md:hidden text-center mb-4">
                <div className="w-10 h-10 mx-auto mb-2 bg-[#eb3838]/10 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#eb3838]" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{t("title")}</h2>
                <p className="text-gray-500 text-xs">{t("subtitle")}</p>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block mb-4 pr-6">
                <h2 className="text-lg font-bold text-gray-900">{t("title")}</h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t("nameLabel")}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                        placeholder={t("namePlaceholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t("phoneLabel")}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                        placeholder={t("phonePlaceholder")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("contactIdLabel")}
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.contactId}
                      onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838]"
                      placeholder={t("contactIdPlaceholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {t("messageLabel")}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb3838]/20 focus:border-[#eb3838] resize-none"
                    placeholder={t("messagePlaceholder")}
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#eb3838] text-white text-sm font-semibold rounded-lg hover:bg-[#d32f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("submitting") : t("submitButton")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
