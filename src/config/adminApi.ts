// Configuration API pour l'authentification admin uniquement
export const ADMIN_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1',
  TIMEOUT: 10000, // 10 secondes
};

// Endpoints pour l'authentification admin
export const ADMIN_API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/admin/login',
    REFRESH: '/auth/admin/refresh',
    LOGOUT: '/auth/admin/logout',
  }
};
