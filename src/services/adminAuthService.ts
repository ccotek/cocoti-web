// Service d'authentification admin avec l'API réelle
import { ADMIN_API_CONFIG, ADMIN_API_ENDPOINTS } from '@/config/adminApi';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  must_change_password: boolean;
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
    const token = localStorage.getItem('admin_token');
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

      const data: AdminLoginResponse = await response.json();
      
      console.log('🔍 adminAuthService login: Données reçues:', data);
      
      // Calculer l'expiration nous-mêmes (24h à partir de maintenant)
      const now = new Date();
      const expiration = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 heures
      
      // Stocker le token
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_refresh_token', data.refresh_token);
      localStorage.setItem('admin_expires_at', expiration.toISOString());
      
      console.log('🔍 adminAuthService login: Token stocké:', data.access_token ? 'Oui' : 'Non');
      console.log('🔍 adminAuthService login: Expiration calculée:', expiration.toISOString());
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion admin:', error);
      throw error;
    }
  }

  async getCurrentAdmin(): Promise<AdminUser> {
    try {
      const response = await fetch(`${ADMIN_API_CONFIG.BASE_URL}/admin/me`, {
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
      const refreshToken = localStorage.getItem('admin_refresh_token');
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
      
      // Mettre à jour les tokens
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_refresh_token', data.refresh_token);
      localStorage.setItem('admin_expires_at', data.expires_at);
      
      return data;
    } catch (error) {
      console.error('Erreur lors du refresh token:', error);
      this.logout();
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_expires_at');
    localStorage.removeItem('admin_user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('admin_token');
    const expiresAt = localStorage.getItem('admin_expires_at');
    
    console.log('🔍 adminAuthService isAuthenticated: Token:', token ? 'Présent' : 'Absent');
    console.log('🔍 adminAuthService isAuthenticated: ExpiresAt:', expiresAt);
    
    if (!token || !expiresAt) {
      console.log('🔍 adminAuthService isAuthenticated: Token ou expiration manquant');
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
      
      console.log('🔍 adminAuthService isAuthenticated: Maintenant:', now.toISOString());
      console.log('🔍 adminAuthService isAuthenticated: Expiration brute:', expiresAt);
      console.log('🔍 adminAuthService isAuthenticated: Expiration nettoyée:', cleanExpiresAt);
      console.log('🔍 adminAuthService isAuthenticated: Expiration parsée:', expiration.toISOString());
      console.log('🔍 adminAuthService isAuthenticated: Valide:', isValid);
      
      return isValid;
    } catch (error) {
      console.error('🔍 adminAuthService isAuthenticated: Erreur de parsing de date:', error);
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
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
