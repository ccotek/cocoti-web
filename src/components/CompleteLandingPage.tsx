"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useContent } from "@/hooks/useContent";
import { usePublicProjects } from "@/hooks/usePublicProjects";

// Import de l'utilitaire de traduction
import { translate } from "@/utils/translations";

// Import des sections
import HeaderSection from "./sections/HeaderSection";
import HeroSection from "./sections/HeroSection";
import CausesSection from "./sections/CausesSection";
import SolutionsSection from "./sections/SolutionsSection";
import WhySection from "./sections/WhySection";
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
  const { content, loading, error } = useContent(locale);
  const { projects } = usePublicProjects(locale);

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
  const navItemsRaw = t("navigation.items") as unknown as Array<{ id: string; label: string }>;
  const navItems = (Array.isArray(navItemsRaw) ? navItemsRaw : (locale === 'fr' ? [
    { id: 'causes', label: 'Notre impact' },
    { id: 'solutions', label: 'Nos solutions' },
    { id: 'how', label: 'Comment ça marche ?' },
    { id: 'faq', label: 'FAQ' },
  ] : [
    { id: 'causes', label: 'Our impact' },
    { id: 'solutions', label: 'Our solutions' },
    { id: 'how', label: 'How it Works?' },
    { id: 'faq', label: 'FAQ' },
  ])).filter(item => {
    // Si l'item est 'causes' (Impact), on ne l'affiche que s'il y a des projets
    if (item.id === 'causes') {
      return projects && projects.length > 0;
    }
    return true;
  });
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
    valuesSubtitle: t("why.valuesSubtitle"),
    values: (Array.isArray(t("why.values")) ? t("why.values") : []) as Array<{ title: string; description: string }>
  };

  const testimonials = {
    badge: t("testimonials.badge"),
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
    subtitle: t("faq.subtitle"),
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

  // Synchroniser quickLinks avec navItems pour le footer (optionnel, mais cohérent)
  if (!content?.footer?.quickLinks) {
    footer.quickLinks = navItems.map(item => ({
      label: item.label,
      href: `#${item.id}`
    }));
  }



  return (
    <div className="bg-sand text-night">
      <HeaderSection
        navItems={navItems}
        navCta={navCta}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        apps={hero.apps}
      />

      <main>
        <HeroSection hero={hero} />
        <CausesSection locale={locale} apps={hero.apps} />
        <SolutionsSection solutions={solutions} locale={locale} />
        <WhySection why={why} how={how} testimonials={testimonials} locale={locale} />
        <FaqSection faq={faq} locale={locale} />
      </main>

      <FooterSection footer={footer} />

      {/* Bouton flottant pour le téléchargement mobile */}
      <SimpleFloatingButton locale={locale} apps={hero.apps} />

      {/* Modal de contact - version simplifiée pour l'instant */}
    </div>
  );
}
