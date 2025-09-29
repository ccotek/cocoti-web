// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1',
  ADMIN_AUTH_ENABLED: process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true',
  TIMEOUT: 10000, // 10 secondes
};

// Endpoints de l'API
export const API_ENDPOINTS = {
  CONTENT: {
    GET_ALL: '/admin/content/content',
    GET_SECTION: (section: string, locale: string) => `/admin/content/content/${section}?locale=${locale}`,
    UPDATE_SECTION: (section: string, locale: string) => `/admin/content/content/${section}?locale=${locale}`,
    DELETE_SECTION: (section: string, locale: string) => `/admin/content/content/${section}?locale=${locale}`,
    PUBLISH_SECTION: (section: string, locale: string) => `/admin/content/content/${section}/publish?locale=${locale}`,
    GET_HISTORY: (section: string, locale: string) => `/admin/content/content/${section}/history?locale=${locale}`,
  },
  AUTH: {
    LOGIN: '/auth/admin/login',
    REFRESH: '/auth/admin/refresh',
    LOGOUT: '/auth/admin/logout',
  }
};

// Types de contenu supportés
export const CONTENT_SECTIONS = [
  'hero',
  'solutions', 
  'how',
  'why',
  'pricing',
  'testimonials',
  'faq',
  'contact',
  'footer'
] as const;

export type ContentSection = typeof CONTENT_SECTIONS[number];
