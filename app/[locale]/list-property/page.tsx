"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Home,
  MapPin,
  Phone,
  DollarSign,
  Maximize,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { toast } from "sonner";

export default function ListPropertyPage() {
  const t = useTranslations("listProperty");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    listingType: "",
    propertyType: "",
    location: "",
    size: "",
    price: "",
    details: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.listingType || !formData.propertyType) {
      toast.error(t("requiredFields"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/public/property-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        toast.success(t("toastSuccess"));
      } else {
        toast.error(data.error || t("requiredFields"));
      }
    } catch (error) {
      console.error("Error submitting property listing:", error);
      toast.error(t("requiredFields"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16" />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto p-8 text-center border-0 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("successTitle")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("successMessage")}
              <br />
              {t("successSubMessage")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    listingType: "",
                    propertyType: "",
                    location: "",
                    size: "",
                    price: "",
                    details: "",
                  });
                }}
                className="bg-[#eb3838] hover:bg-[#d32f2f] text-white"
              >
                {t("submitNew")}
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="border-[#eb3838] text-[#eb3838] hover:bg-[#eb3838] hover:text-white w-full"
                >
                  {t("backHome")}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16" />

      {/* Hero Section - Light with Red Accent */}
      <section className="relative py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Red Line */}
          <div className="w-20 h-1 bg-[#eb3838] mx-auto mb-6" />

          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-[#eb3838]" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t("title")}</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto p-6 md:p-8 border-0 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {t("formTitle")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#eb3838]" />
                  {t("contactInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("fullName")} *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("fullNamePlaceholder")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("phone")} *
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="08X-XXX-XXXX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("emailOptional")}
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Property Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#eb3838]" />
                  {t("propertyInfo")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("listingTypeLabel")} *
                    </label>
                    <Select
                      value={formData.listingType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, listingType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">{t("listForSale")}</SelectItem>
                        <SelectItem value="rent">{t("listForRent")}</SelectItem>
                        <SelectItem value="both">{t("bothSaleRent")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("propertyTypeLabel")} *
                    </label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Condo">{t("condo")}</SelectItem>
                        <SelectItem value="Townhouse">{t("townhouse")}</SelectItem>
                        <SelectItem value="SingleHouse">{t("singleHouse")}</SelectItem>
                        <SelectItem value="Villa">{t("villa")}</SelectItem>
                        <SelectItem value="Land">{t("land")}</SelectItem>
                        <SelectItem value="Office">{t("office")}</SelectItem>
                        <SelectItem value="Store">{t("store")}</SelectItem>
                        <SelectItem value="Factory">{t("factory")}</SelectItem>
                        <SelectItem value="Hotel">{t("hotel")}</SelectItem>
                        <SelectItem value="Building">{t("building")}</SelectItem>
                        <SelectItem value="Apartment">{t("apartment")}</SelectItem>
                        <SelectItem value="Other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1 text-[#eb3838]" />
                    {t("location")}
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder={t("locationPlaceholder")}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Maximize className="w-4 h-4 inline mr-1 text-[#eb3838]" />
                      {t("size")}
                    </label>
                    <Input
                      value={formData.size}
                      onChange={(e) =>
                        setFormData({ ...formData, size: e.target.value })
                      }
                      placeholder={t("sizePlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSign className="w-4 h-4 inline mr-1 text-[#eb3838]" />
                      {t("price")}
                    </label>
                    <Input
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder={t("pricePlaceholder")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("additionalDetails")}
                  </label>
                  <Textarea
                    value={formData.details}
                    onChange={(e) =>
                      setFormData({ ...formData, details: e.target.value })
                    }
                    placeholder={t("detailsPlaceholder")}
                    rows={4}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 bg-[#eb3838] hover:bg-[#d32f2f] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    {t("submitButton")}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t("whyTitle")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#eb3838]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-[#eb3838]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("benefit1Title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("benefit1Desc")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#eb3838]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-[#eb3838]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("benefit2Title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("benefit2Desc")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#eb3838]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-[#eb3838]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t("benefit3Title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("benefit3Desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
