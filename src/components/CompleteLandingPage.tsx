"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useContent } from "@/hooks/useContent";

// Import de l'utilitaire de traduction
import { translate } from "@/utils/translations";

// Import des sections
import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import CausesSection from "./sections/CausesSection";
import SolutionsSection from "./sections/SolutionsSection";
import HowSection from "./sections/HowSection";
import WhySection from "./sections/WhySection";
import PricingSection from "./sections/PricingSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FaqSection from "./sections/FaqSection";
import FooterSection from "./sections/FooterSection";
import WhatsAppButtonSimple from "./WhatsAppButtonSimple";
import SimpleFloatingButton from "./SimpleFloatingButton";

export default function CompleteLandingPage() {
  const pathname = usePathname();
  // Détecter la locale directement depuis le pathname pour éviter les re-renders
  const locale = pathname.startsWith('/en') ? 'en' : 'fr';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Utiliser le hook useContent pour charger depuis l'API
  let content, loading, error;
  try {
    const result = useContent(locale);
    content = result.content;
    loading = result.loading;
    error = result.error;
  } catch (hookError) {
    console.error('Erreur dans le hook useContent:', hookError);
    content = null;
    loading = false;
    error = 'Erreur dans le hook useContent';
  }

  // Fonction de traduction simplifiée
  const t = (key: string) => translate(key, locale, content);

  const handleLocaleChange = (targetLocale: 'fr' | 'en') => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${targetLocale}`);
    window.location.href = newPath;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  // Extraire les données des traductions
  const navItemsRaw = t("navigation.items");
  const navItems = Array.isArray(navItemsRaw) ? navItemsRaw : [
    { id: 'solutions', label: 'Solutions' },
    { id: 'how', label: 'Comment ça marche' },
    { id: 'why', label: 'Pourquoi nous' },
    { id: 'pricing', label: 'Tarifs' },
  ];
  const navCta = t("navigation.cta");
  
  
  const hero = {
    badge: content?.hero?.badge || t("hero.badge"),
    title: content?.hero?.title || t("hero.title"),
    subtitle: content?.hero?.subtitle || t("hero.subtitle"),
    download: content?.hero?.download || t("hero.download"),
    viewDashboard: content?.hero?.viewDashboard || t("hero.viewDashboard"),
    viewDashboardLink: content?.hero?.viewDashboardLink || t("hero.viewDashboardLink"),
    apps: content?.hero?.apps || (Array.isArray(t("hero.apps")) ? t("hero.apps") : []) as Array<{ store: string; label: string; href: string }>,
    stats: content?.hero?.stats || (Array.isArray(t("hero.stats")) ? t("hero.stats") : []) as Array<{ value: string; label: string }>,
    mockupAlt: content?.hero?.mockupAlt || t("hero.mockupAlt"),
    image: content?.hero?.image || t("hero.image")
  };

  const solutions = {
    title: t("solutions.title"),
    subtitle: t("solutions.subtitle"),
    items: (Array.isArray(t("solutions.items")) ? t("solutions.items") : []) as Array<{ id: string; title: string; description: string }>
  };

  const how = {
    title: t("how.title"),
    steps: (Array.isArray(t("how.steps")) ? t("how.steps") : []) as Array<{ title: string; description: string }>
  };

  const why = {
    title: t("why.title"),
    subtitle: t("why.subtitle"),
    values: (Array.isArray(t("why.values")) ? t("why.values") : []) as Array<{ title: string; description: string }>
  };

  const pricing = {
    title: content?.pricing?.title || t("pricing.title"),
    plans: (content?.pricing?.plans || (Array.isArray(t("pricing.plans")) ? t("pricing.plans") : [])) as Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      cta: string;
      highlight?: boolean;
    }>,
    comparisonTable: content?.pricing?.comparisonTable || (t("pricing.comparisonTable") as {
      features: Array<{
        label: string;
        free: string;
        premium: string;
        community: string;
      }>;
    } | undefined)
  };

  const testimonials = {
    title: t("testimonials.title"),
    subtitle: t("testimonials.subtitle"),
    items: Array.isArray(t("testimonials.items")) ? (t("testimonials.items") as unknown as Array<{
      name: string;
      role: string;
      quote: string;
      avatar: string;
    }>) : []
  };

  const faq = {
    title: t("faq.title"),
    items: (Array.isArray(t("faq.items")) ? t("faq.items") : []) as Array<{ question: string; answer: string }>,
    cta: {
      title: t("faq.cta.title"),
      description: t("faq.cta.description"),
      whatsapp: t("faq.cta.whatsapp")
    },
    whatsappNumber: content?.whatsapp?.number || "+221771234567",
    whatsappMessage: content?.whatsapp?.message || t("whatsapp.defaultMessage")
  };


  // Données stables pour éviter le flash
  const footer = {
    company: content?.footer?.company || t("footer.company"),
    legalLinks: content?.footer?.legalLinks || (Array.isArray(t("footer.legalLinks")) ? t("footer.legalLinks") : []) as Array<{ label: string; href: string }>,
    socialLinks: (() => {
      const jsonSocialLinks = t("footer.socialLinks");
      // S'assurer que les données sont stables et valides
      return Array.isArray(jsonSocialLinks) ? jsonSocialLinks as Array<{ label: string; href: string; icon?: string }> : [];
    })(),
    quickLinks: content?.footer?.quickLinks || (Array.isArray(t("footer.quickLinks")) ? t("footer.quickLinks") : []) as Array<{ label: string; href: string }>
  };



  return (
    <div className="bg-sand text-night">
      <HeaderSection
        navItems={navItems}
        navCta={navCta}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        onLoginClick={() => window.open(`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn'}/${locale}`, '_blank')}
      />

      <main>
        <HeroSection hero={hero} />
        <CausesSection locale={locale} />
        <SolutionsSection solutions={solutions} />
        <HowSection how={how} />
        <WhySection why={why} />
        <PricingSection pricing={pricing} locale={locale} />
        <TestimonialsSection testimonials={testimonials} />
        <FaqSection faq={faq} />
      </main>

      <FooterSection footer={footer} />

      {/* Bouton flottant pour créer une cagnotte */}
      <SimpleFloatingButton locale={locale} />

      {/* Modal de contact - version simplifiée pour l'instant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/50 p-4 backdrop-blur">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-night">Contactez-nous</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Parlez-nous de votre communauté et de vos projets, nous vous répondons sous 24h.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full border border-cloud p-2"
                aria-label={t("accessibility.closeModal")}
              >
                ✕
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-ink-muted">
                Pour l'instant, contactez-nous directement par email ou WhatsApp.
              </p>
              <div className="mt-4 flex gap-4">
                <a
                  href="mailto:hello@cocoti.africa"
                  className="rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white"
                >
                  Envoyer un email
                </a>
                <a
                  href="https://wa.me/221771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-magenta px-6 py-3 text-sm font-semibold text-magenta"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton WhatsApp flottant */}
      <WhatsAppButtonSimple 
        phoneNumber="+221771234567"
        message="Bonjour ! Je suis intéressé(e) par Cocoti. Pouvez-vous m'en dire plus ?"
      />
    </div>
  );
}
