// Service pour communiquer avec l'API de gestion de contenu
import { API_CONFIG, API_ENDPOINTS } from '@/config/api';

export interface ContentData {
  id?: string;
  section: string;
  locale: string;
  content: Record<string, any>;
  updated_at?: string;
  updated_by?: string;
}

export interface ContentUpdate {
  content: Record<string, any>;
}

class ContentService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllContent(locale?: string): Promise<ContentData[]> {
    try {
      const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTENT.GET_ALL}`);
      if (locale) {
        url.searchParams.append('locale', locale);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu:', error);
      throw error;
    }
  }

  async getContentSection(section: string, locale: string = 'fr'): Promise<ContentData> {
    try {
      const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTENT.GET_SECTION(section, locale)}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Retourner un objet vide si le contenu n'existe pas
          return {
            section,
            locale,
            content: {},
          };
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de la section ${section}:`, error);
      throw error;
    }
  }

  async updateContentSection(
    section: string,
    content: Record<string, any>,
    locale: string = 'fr'
  ): Promise<ContentData> {
    try {
      const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTENT.UPDATE_SECTION(section, locale)}`);

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la section ${section}:`, error);
      throw error;
    }
  }

  async deleteContentSection(section: string, locale: string = 'fr'): Promise<void> {
    try {
      const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTENT.DELETE_SECTION(section, locale)}`);

      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression de la section ${section}:`, error);
      throw error;
    }
  }

  async publishContentSection(section: string, locale: string = 'fr'): Promise<void> {
    try {
      const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTENT.PUBLISH_SECTION(section, locale)}`);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la publication de la section ${section}:`, error);
      throw error;
    }
  }

  async getContentHistory(section: string, locale: string = 'fr'): Promise<any[]> {
    try {
      const url = new URL(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTENT.GET_HISTORY(section, locale)}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique de la section ${section}:`, error);
      throw error;
    }
  }
}

export const contentService = new ContentService();
