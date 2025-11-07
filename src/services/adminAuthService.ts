// Service d'authentification admin avec l'API réelle
import { ADMIN_API_CONFIG, ADMIN_API_ENDPOINTS } from '@/config/adminApi';
import { setAuthToken, getAuthToken, clearAuthToken } from '@/utils/tokenStorage';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
  user?: {
    user_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    status: string;
    roles: string[];
    permissions: string[];
    created_at: string;
    last_login?: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  admin_type: 'super_admin' | 'admin' | 'support' | 'moderator' | 'marketing_admin' | 'guest';
  roles: string[];
}

class AdminAuthService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = getAuthToken();
    
    if (!token) {
      console.error('Aucun token admin trouvé');
      throw new Error('Token d\'authentification manquant');
    }
    
    console.log('Token admin trouvé:', token.substring(0, 20) + '...');
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async login(credentials: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const response = await fetch(`${ADMIN_API_CONFIG.BASE_URL}${ADMIN_API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Inclure les cookies
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API complète:', data);
      
      // Vérifier la structure de la réponse
      if (!data.tokens || !data.tokens.access_token) {
        throw new Error('Structure de réponse API invalide: tokens.access_token manquant');
      }
      
      // Calculer l'expiration à partir de expires_in (en secondes)
      const now = new Date();
      const expiration = new Date(now.getTime() + data.tokens.expires_in * 1000);
      
      // Stocker le token avec la clé unifiée
      setAuthToken(data.tokens.access_token);
      localStorage.setItem('cocoti_refresh_token', data.tokens.refresh_token);
      localStorage.setItem('cocoti_token_expires_at', expiration.toISOString());
      
      console.log('Token stocké:', data.tokens.access_token.substring(0, 20) + '...');
      console.log('Expiration:', expiration.toISOString());
      
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion admin:', error);
      throw error;
    }
  }

  async getCurrentAdmin(): Promise<AdminUser> {
    try {
      const response = await fetch(`${ADMIN_API_CONFIG.BASE_URL}/auth/me`, {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré ou invalide
          this.logout();
          throw new Error('Session expirée');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil admin:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<AdminLoginResponse> {
    try {
      const refreshToken = localStorage.getItem('cocoti_refresh_token');
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      const response = await fetch(`${ADMIN_API_CONFIG.BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: AdminLoginResponse = await response.json();
      
      // Vérifier la structure de la réponse
      if (!data.tokens || !data.tokens.access_token) {
        throw new Error('Structure de réponse API invalide lors du refresh');
      }
      
      // Calculer l'expiration à partir de expires_in (en secondes)
      const now = new Date();
      const expiration = new Date(now.getTime() + data.tokens.expires_in * 1000);
      
      // Mettre à jour les tokens avec la clé unifiée
      setAuthToken(data.tokens.access_token);
      localStorage.setItem('cocoti_refresh_token', data.tokens.refresh_token);
      localStorage.setItem('cocoti_token_expires_at', expiration.toISOString());
      
      return data;
    } catch (error) {
      console.error('Erreur lors du refresh token:', error);
      this.logout();
      throw error;
    }
  }

  logout(): void {
    clearAuthToken();
    localStorage.removeItem('cocoti_refresh_token');
    localStorage.removeItem('cocoti_token_expires_at');
    localStorage.removeItem('admin_user');
  }

  isAuthenticated(): boolean {
    const token = getAuthToken();
    const expiresAt = localStorage.getItem('cocoti_token_expires_at');
    
    if (!token || !expiresAt) {
      return false;
    }
    
    try {
      // Vérifier si le token est expiré
      const now = new Date();
      
      // Nettoyer le format de date si nécessaire (enlever les microsecondes)
      let cleanExpiresAt = expiresAt;
      if (cleanExpiresAt.includes('.')) {
        // Garder seulement les millisecondes, pas les microsecondes
        cleanExpiresAt = cleanExpiresAt.split('.')[0] + 'Z';
      }
      
      const expiration = new Date(cleanExpiresAt);
      const isValid = now < expiration;
      
      
      return isValid;
    } catch (error) {
      console.error('Erreur de parsing de date:', error);
      return false;
    }
  }

  getToken(): string | null {
    return getAuthToken();
  }

  async checkAdminPermissions(): Promise<boolean> {
    try {
      const admin = await this.getCurrentAdmin();
      
      // Vérifier les types d'admin autorisés
      const authorizedTypes = ['super_admin', 'admin', 'marketing_admin'];
      const hasAuthorizedType = admin.admin_type && authorizedTypes.includes(admin.admin_type);
      
      // Vérifier les rôles autorisés (fallback)
      const authorizedRoles = ['super_admin', 'admin'];
      const hasAuthorizedRole = admin.roles && admin.roles.some(role => authorizedRoles.includes(role));
      
      return hasAuthorizedType || hasAuthorizedRole;
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      return false;
    }
  }
}

export const adminAuthService = new AdminAuthService();
