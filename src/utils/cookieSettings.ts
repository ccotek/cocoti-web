/**
 * Utilitaires pour gérer les préférences cookies
 * Permet d'ouvrir le panneau de gestion des cookies depuis n'importe où
 */

/**
 * Ouvre le panneau de gestion des cookies
 * Peut être appelé depuis n'importe quel composant
 */
export function openCookieSettings(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  }
}

/**
 * Vérifie si l'utilisateur a déjà donné son consentement
 */
export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('cookie-consent');
}

/**
 * Récupère les préférences cookies actuelles
 */
export function getCookiePreferences(): {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
} | null {
  if (typeof window === 'undefined') return null;
  
  const consent = localStorage.getItem('cookie-consent');
  if (!consent) return null;

  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

