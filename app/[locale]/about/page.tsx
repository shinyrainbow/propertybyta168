"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Award, Users, Home, TrendingUp, Shield, Heart } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");
  const router = useRouter();

  const stats = [
    { icon: Home, value: "500+", label: t("stats.properties") },
    { icon: Users, value: "1000+", label: t("stats.clients") },
    { icon: Award, value: "15+", label: t("stats.years") },
    { icon: TrendingUp, value: "95%", label: t("stats.satisfaction") },
  ];

  const values = [
    {
      icon: Home,
      title: t("values.trust.title"),
      description: t("values.trust.description"),
    },
    {
      icon: Shield,
      title: t("values.excellence.title"),
      description: t("values.excellence.description"),
    },
    {
      icon: Users,
      title: t("values.community.title"),
      description: t("values.community.description"),
    },
    {
      icon: TrendingUp,
      title: t("values.advisory.title"),
      description: t("values.advisory.description"),
    },
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: t("whyChooseUs.reasons.marketKnowledge.title"),
      description: t("whyChooseUs.reasons.marketKnowledge.description"),
    },
    {
      icon: Users,
      title: t("whyChooseUs.reasons.experience.title"),
      description: t("whyChooseUs.reasons.experience.description"),
    },
    {
      icon: TrendingUp,
      title: t("whyChooseUs.reasons.professional.title"),
      description: t("whyChooseUs.reasons.professional.description"),
    },
    {
      icon: Heart,
      title: t("whyChooseUs.reasons.service.title"),
      description: t("whyChooseUs.reasons.service.description"),
    },
  ];

  const team = [
    {
      name: t("team.ceo.name"),
      role: t("team.ceo.role"),
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
      description: t("team.ceo.description"),
    },
    {
      name: t("team.director.name"),
      role: t("team.director.role"),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      description: t("team.director.description"),
    },
    {
      name: t("team.manager.name"),
      role: t("team.manager.role"),
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      description: t("team.manager.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920"
            alt="About SKYPRO PROPERTY"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/90 via-[#0A0E1A]/70 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="w-12 h-0.5 bg-[#C9A227] mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A227]/10 mb-4">
                  <stat.icon className="w-8 h-8 text-[#C9A227]" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-12 h-0.5 bg-[#C9A227] mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t("story.title")}
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>{t("story.paragraph1")}</p>
                <p>{t("story.paragraph2")}</p>
                <p className="font-semibold text-[#C9A227]">{t("story.paragraph3")}</p>
              </div>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - สิ่งที่เราเชี่ยวชาญ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-12 h-0.5 bg-[#C9A227] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("valuesSection.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("valuesSection.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg hover:shadow-xl transition-all border border-gray-200 hover:border-[#C9A227]/50"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A227]/10 mb-6">
                  <value.icon className="w-8 h-8 text-[#C9A227]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - ทำไมลูกค้าถึงเลือกเรา */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-12 h-0.5 bg-[#C9A227] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("whyChooseUs.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("whyChooseUs.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {whyChooseUs.map((reason, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-xl transition-all border border-gray-200 hover:border-[#C9A227]/50"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#C9A227]/10 mb-6">
                  <reason.icon className="w-8 h-8 text-[#C9A227]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {reason.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-12 h-0.5 bg-[#C9A227] mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("teamSection.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("teamSection.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all border border-gray-200"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-[#C9A227] font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#C9A227] to-[#A8841F]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-[#C9A227] hover:bg-white/90 border-white px-8"
            onClick={() => router.push("/contact")}
          >
            {t("cta.button")}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
