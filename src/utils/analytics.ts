/**
 * Utilitaires pour le tracking d'événements
 * Respecte les préférences cookies de l'utilisateur
 */

/**
 * Vérifie si l'analytics est autorisé
 */
function isAnalyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  
  const cookieConsent = localStorage.getItem('cookie-consent');
  if (!cookieConsent) return false;

  try {
    const preferences = JSON.parse(cookieConsent);
    return preferences.analytics === true;
  } catch {
    return false;
  }
}

/**
 * Vérifie si le marketing est autorisé
 */
function isMarketingAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  
  const cookieConsent = localStorage.getItem('cookie-consent');
  if (!cookieConsent) return false;

  try {
    const preferences = JSON.parse(cookieConsent);
    return preferences.marketing === true;
  } catch {
    return false;
  }
}

/**
 * Track un événement Google Analytics
 * Ne fait rien si l'analytics n'est pas autorisé
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, any>
): void {
  if (!isAnalyticsAllowed()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event blocked - analytics not allowed:', eventName);
    }
    return;
  }

  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] gtag not available:', eventName, eventData);
  }
}

/**
 * Track un événement Facebook Pixel
 * Ne fait rien si le marketing n'est pas autorisé
 */
export function trackFacebookEvent(
  eventName: string,
  eventData?: Record<string, any>
): void {
  if (!isMarketingAllowed()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Facebook Pixel] Event blocked - marketing not allowed:', eventName);
    }
    return;
  }

  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData);
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Facebook Pixel] fbq not available:', eventName, eventData);
  }
}

/**
 * Track une page view
 */
export function trackPageView(path: string): void {
  trackEvent('page_view', { page_path: path });
  trackFacebookEvent('PageView');
}

/**
 * Track un événement de conversion (ex: création de money pool)
 */
export function trackConversion(
  conversionType: string,
  value?: number,
  currency?: string
): void {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value,
    currency,
  });
  
  trackFacebookEvent('Lead', {
    content_name: conversionType,
    value,
    currency,
  });
}

