"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, Cog6ToothIcon, ShieldCheckIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { translate } from "@/utils/translations";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
    preferences: false,
  });
  
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'fr';
  
  // Fonction de traduction
  const t = (key: string) => translate(key, locale);

  useEffect(() => {
    // Charger les préférences existantes si disponibles
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent) {
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }

    // Vérifier si l'utilisateur a déjà fait un choix
    if (!cookieConsent) {
      setIsVisible(true);
    }

    // Écouter les événements pour rouvrir le banner
    const handleOpenCookieSettings = () => {
      // Recharger les préférences depuis localStorage
      const currentConsent = localStorage.getItem('cookie-consent');
      if (currentConsent) {
        try {
          const savedPreferences = JSON.parse(currentConsent);
          setPreferences(savedPreferences);
        } catch (error) {
          console.error('Error loading cookie preferences:', error);
        }
      }
      setIsVisible(true);
      setShowSettings(true); // Ouvrir directement les paramètres
    };

    window.addEventListener('open-cookie-settings', handleOpenCookieSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenCookieSettings);
    };
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    // Déclencher un événement personnalisé pour recharger les scripts
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: allAccepted }));
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    // Déclencher un événement personnalisé pour recharger les scripts
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: onlyNecessary }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
    setShowSettings(false);
    // Déclencher un événement personnalisé pour recharger les scripts
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: preferences }));
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Ne peut pas être désactivé
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-cloud shadow-2xl"
      >
        <div className="max-w-6xl mx-auto">
          {!showSettings ? (
            // Vue principale
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-sunset to-magenta rounded-lg flex items-center justify-center">
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-night">
                    {t("cookies.title")}
                  </h3>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {t("cookies.description")}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="text-sm text-magenta hover:text-sunset font-medium flex items-center gap-1 transition-colors"
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    {t("cookies.customize")}
                  </button>
                  <a
                    href={`/${locale}/privacy-policy`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-muted hover:text-night transition-colors flex items-center gap-1"
                  >
                    <InformationCircleIcon className="w-4 h-4" />
                    {t("cookies.privacyPolicy")}
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 border border-cloud text-night rounded-2xl font-medium hover:bg-ivory transition-all whitespace-nowrap"
                >
                  {t("cookies.rejectAll")}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl font-medium hover:shadow-glow transition-all whitespace-nowrap"
                >
                  {t("cookies.acceptAll")}
                </button>
              </div>
            </div>
          ) : (
            // Vue des paramètres
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-sunset to-magenta rounded-lg flex items-center justify-center">
                    <Cog6ToothIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-night">
                    {t("cookies.settingsTitle")}
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-ink-muted hover:text-night transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid gap-4">
                {/* Cookies nécessaires */}
                <div className="flex items-center justify-between p-4 bg-ivory rounded-2xl border border-cloud">
                  <div className="flex-1">
                    <h4 className="font-medium text-night mb-1">{t("cookies.necessary.title")}</h4>
                    <p className="text-sm text-ink-muted">
                      {t("cookies.necessary.description")}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-magenta rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-cloud">
                  <div className="flex-1">
                    <h4 className="font-medium text-night mb-1">{t("cookies.analytics.title")}</h4>
                    <p className="text-sm text-ink-muted">
                      {t("cookies.analytics.description")}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? 'bg-magenta justify-end' : 'bg-cloud justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-cloud">
                  <div className="flex-1">
                    <h4 className="font-medium text-night mb-1">{t("cookies.marketing.title")}</h4>
                    <p className="text-sm text-ink-muted">
                      {t("cookies.marketing.description")}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? 'bg-magenta justify-end' : 'bg-cloud justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>

                {/* Cookies de préférences */}
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-cloud">
                  <div className="flex-1">
                    <h4 className="font-medium text-night mb-1">{t("cookies.preferences.title")}</h4>
                    <p className="text-sm text-ink-muted">
                      {t("cookies.preferences.description")}
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('preferences')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.preferences ? 'bg-magenta justify-end' : 'bg-cloud justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 border border-cloud text-night rounded-2xl font-medium hover:bg-ivory transition-all"
                >
                  {t("cookies.rejectAll")}
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl font-medium hover:shadow-glow transition-all"
                >
                  {t("cookies.saveChoices")}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
