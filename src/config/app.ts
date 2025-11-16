// Helper function to get the public URL for sharing
const getPublicWebUrl = (): string => {
  // In production, prefer environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.NEXT_PUBLIC_WEB_APP_URL) {
    return process.env.NEXT_PUBLIC_WEB_APP_URL;
  }
  
  // In development, use window.location.origin if available (client-side)
  // This ensures the shared URL works on the current machine
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

export const APP_CONFIG = {
  // URL de l'API backend
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  // URL du dashboard (cocoti-dash) - pour redirections après création
  DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:5000',
  // URL de l'application web (cocoti-web) - pour référence interne et partage
  // Utilise l'URL publique configurée ou window.location.origin en développement
  WEB_APP_URL: getPublicWebUrl(),
  // URLs pour les conditions d'utilisation et politique de confidentialité
  TERMS_URL: process.env.NEXT_PUBLIC_TERMS_URL || 'https://cocoti.com/terms-of-service',
  PRIVACY_URL: process.env.NEXT_PUBLIC_PRIVACY_URL || 'https://cocoti.com/privacy-policy',
};

