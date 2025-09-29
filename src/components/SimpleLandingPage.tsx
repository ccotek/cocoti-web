"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SparklesIcon, PhoneIcon } from "@heroicons/react/24/outline";

// Import des traductions
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

export default function SimpleLandingPage() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    // Détecter la locale basée sur l'URL
    if (pathname.startsWith('/en')) {
      setLocale('en');
    } else {
      setLocale('fr');
    }
  }, [pathname]);

  const messages = locale === 'fr' ? frMessages : enMessages;
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const handleLocaleChange = (targetLocale: string) => {
    const newPath = pathname.replace(/^\/(fr|en)/, `/${targetLocale}`);
    window.location.href = newPath;
  };

  return (
    <div className="min-h-screen bg-sand text-night">
      <motion.header
        className="sticky top-0 z-40 border-b border-cloud/60 bg-sand/80 backdrop-blur"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container flex items-center justify-between py-4">
          <a href="#hero" className="flex items-center gap-2 text-lg font-semibold">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sunset to-magenta font-bold text-white">
              C
            </div>
            <span>Cocoti</span>
          </a>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase text-ink-muted">{locale}</span>
              <button
                type="button"
                onClick={() => handleLocaleChange(locale === 'fr' ? 'en' : 'fr')}
                className="rounded-full border border-cloud px-3 py-1 font-semibold uppercase text-night transition hover:border-magenta hover:text-magenta"
              >
                {locale === 'fr' ? 'English' : 'Français'}
              </button>
            </div>
            <a
              href="#download"
              className="rounded-full bg-gradient-to-r from-sunset to-magenta px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-magenta/20 transition hover:shadow-xl"
            >
              {t("navigation.cta")}
            </a>
          </div>
        </div>
      </motion.header>

      <main>
        <section id="hero" className="relative overflow-hidden bg-ivory">
          <div className="container relative flex flex-col gap-12 py-20 md:flex-row md:items-center">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-coral/50 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-coral shadow-sm">
                <SparklesIcon className="h-4 w-4" />
                {t("hero.badge")}
              </span>
              <motion.h1
                className="text-4xl font-bold leading-tight sm:text-5xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {t("hero.title")}
              </motion.h1>
              <motion.p 
                className="text-lg text-ink-muted"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t("hero.subtitle")}
              </motion.p>
              <motion.div 
                className="flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <a
                  id="download"
                  href="#"
                  className="rounded-full bg-gradient-to-r from-sunset to-magenta px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-magenta/30 transition hover:shadow-xl"
                >
                  {t("hero.download")}
                </a>
                <a
                  href="#"
                  className="rounded-full border border-magenta px-6 py-3 text-sm font-semibold text-magenta transition hover:bg-magenta hover:text-white"
                >
                  {t("hero.viewDashboard")}
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
