export const APP_CONFIG = {
  // URL de l'API backend
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  // URL du dashboard (cocoti-dash) - pour redirections après création
  DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:5000',
  // URL de l'application web (cocoti-web) - pour référence interne
  WEB_APP_URL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
};

