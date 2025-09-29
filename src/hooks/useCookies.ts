"use client";

import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function useCookies() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
        setHasConsent(true);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences cookies:', error);
      }
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setHasConsent(true);
  };

  const clearConsent = () => {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-date');
    setHasConsent(false);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const canUseAnalytics = () => {
    return hasConsent && preferences.analytics;
  };

  const canUseMarketing = () => {
    return hasConsent && preferences.marketing;
  };

  const canUsePreferences = () => {
    return hasConsent && preferences.preferences;
  };

  return {
    preferences,
    hasConsent,
    updatePreferences,
    clearConsent,
    canUseAnalytics,
    canUseMarketing,
    canUsePreferences,
  };
}
