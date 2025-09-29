// Configuration de sécurité admin
export const ADMIN_CONFIG = {
  // Protection par variable d'environnement
  ENABLED: process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true',
  
  // URL de l'API d'authentification
  AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000/api/v1',
  
  // Configuration de sécurité
  SECURITY: {
    // Durée de session (en heures)
    SESSION_DURATION: 24,
    
    // Auto-logout après inactivité (en minutes)
    INACTIVITY_TIMEOUT: 30,
    
    // Nombre max de tentatives de connexion
    MAX_LOGIN_ATTEMPTS: 5,
    
    // Durée de blocage après échecs (en minutes)
    LOCKOUT_DURATION: 15
  },
  
  // Routes protégées
  PROTECTED_ROUTES: [
    '/admin',
    '/admin/*'
  ],
  
  // Routes publiques (non protégées)
  PUBLIC_ROUTES: [
    '/admin/login'
  ]
};

// Fonction pour vérifier si l'admin est activé
export function isAdminEnabled(): boolean {
  // En développement, activer l'admin par défaut
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  return ADMIN_CONFIG.ENABLED;
}

// Fonction pour vérifier si une route est protégée
export function isProtectedRoute(pathname: string): boolean {
  return ADMIN_CONFIG.PROTECTED_ROUTES.some(route => {
    if (route.endsWith('/*')) {
      return pathname.startsWith(route.slice(0, -2));
    }
    return pathname === route;
  });
}

// Fonction pour vérifier si une route est publique
export function isPublicRoute(pathname: string): boolean {
  return ADMIN_CONFIG.PUBLIC_ROUTES.includes(pathname);
}
