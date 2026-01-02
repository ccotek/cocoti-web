// Helper function to get the public URL for sharing
const getPublicWebUrl = (): string => {
  // In production, use environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // In development, use window.location.origin if available (client-side)
  // This ensures the shared URL works on the current machine
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side fallback
  return 'http://localhost:3000';
};

export const APP_CONFIG = {
  // URL de l'API backend
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  // URL de l'application web (cocoti-web) - pour référence interne et partage
  // Utilise l'URL publique configurée ou window.location.origin en développement
  WEB_APP_URL: getPublicWebUrl(),
};

