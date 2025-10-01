"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3BottomRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { translate } from "@/utils/translations";

type HeaderSectionProps = {
  navItems: Array<{
    id: string;
    label: string;
  }>;
  navCta: string;
  locale: 'fr' | 'en';
  onLocaleChange: (locale: 'fr' | 'en') => void;
  onLoginClick: () => void;
};

export default function HeaderSection({ navItems, navCta, locale, onLocaleChange, onLoginClick }: HeaderSectionProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
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

          <nav className="hidden items-center gap-8 text-sm md:flex">
            {Array.isArray(navItems) && navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-medium text-ink-muted transition hover:text-night"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase text-ink-muted">{locale}</span>
              <button
                type="button"
                onClick={() => onLocaleChange(locale === 'fr' ? 'en' : 'fr')}
                className="rounded-full border border-cloud px-3 py-1 font-semibold uppercase text-night transition hover:border-magenta hover:text-magenta"
              >
                {locale === 'fr' ? 'English' : 'Français'}
              </button>
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn'}/${locale}`}
              className="rounded-full bg-gradient-to-r from-sunset to-magenta px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-magenta/20 transition hover:shadow-xl"
            >
              {locale === 'fr' ? 'Se connecter' : 'Login'}
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cloud/70 md:hidden"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            aria-label={translate("accessibility.toggleMenu", locale)}
          >
            {showMobileMenu ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3BottomRightIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </motion.header>

      <AnimatePresence initial={false}>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 z-30 bg-sand/95 px-6 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Cocoti</span>
              <button
                type="button"
                className="rounded-full border border-cloud/80 p-2"
                onClick={() => setShowMobileMenu(false)}
                aria-label={translate("accessibility.closeMenu", locale)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-6 text-lg">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} onClick={() => setShowMobileMenu(false)}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase text-ink-muted">
                <span>Langue</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    onLocaleChange(locale === 'fr' ? 'en' : 'fr');
                  }}
                  className="rounded-full border border-cloud px-3 py-1 font-semibold text-night transition hover:border-magenta hover:text-magenta"
                >
                  {locale === 'fr' ? 'English' : 'Français'}
                </button>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn'}/${locale}`}
                onClick={() => setShowMobileMenu(false)}
                className="rounded-full bg-gradient-to-r from-sunset to-magenta px-5 py-3 text-center text-sm font-semibold text-white shadow-lg"
              >
                {locale === 'fr' ? 'Se connecter' : 'Login'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
