// Service pour communiquer avec l'API locale de gestion de contenu

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
  // Méthode d'authentification supprimée - plus utilisée avec l'API locale

  async getAllContent(locale?: string): Promise<ContentData[]> {
    try {
       // Utiliser l'API locale pour récupérer le contenu
       const url = new URL('/api/cms/content', window.location.origin);
      if (locale) {
        url.searchParams.append('locale', locale);
      }

      console.log('🔍 contentService getAllContent: URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔍 contentService getAllContent: Result:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la récupération du contenu');
      }

      // Transformer les données JSON en format ContentData
      const data = result.content;
      const contentData: ContentData[] = [
        {
          id: 'hero',
          section: 'hero',
          locale: locale || 'fr',
          content: data.hero,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'navigation',
          section: 'navigation', 
          locale: locale || 'fr',
          content: data.navigation,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'solutions',
          section: 'solutions',
          locale: locale || 'fr', 
          content: data.solutions,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'how',
          section: 'how',
          locale: locale || 'fr',
          content: data.how,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'why',
          section: 'why',
          locale: locale || 'fr',
          content: data.why,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'pricing',
          section: 'pricing',
          locale: locale || 'fr',
          content: data.pricing,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'testimonials',
          section: 'testimonials',
          locale: locale || 'fr',
          content: data.testimonials,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'faq',
          section: 'faq',
          locale: locale || 'fr',
          content: data.faq,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'contact',
          section: 'contact',
          locale: locale || 'fr',
          content: data.contact,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'footer',
          section: 'footer',
          locale: locale || 'fr',
          content: data.footer,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        }
      ];

      console.log('🔍 contentService getAllContent: Données JSON chargées:', contentData);
      return contentData;
    } catch (error) {
      console.error('Erreur lors de la récupération du contenu:', error);
      throw error;
    }
  }

  // Méthode supprimée - plus utilisée avec la nouvelle architecture JSON locale

  async updateContentSection(
    section: string,
    content: Record<string, any>,
    locale: string = 'fr'
  ): Promise<ContentData> {
    try {
      console.log('🔍 contentService: Mise à jour de la section:', section);
      console.log('🔍 contentService: Contenu:', content);
      console.log('🔍 contentService: Locale:', locale);
      
       // Utiliser l'API locale pour mettre à jour le fichier JSON
       const url = new URL('/api/cms/content', window.location.origin);
      url.searchParams.append('section', section);
      url.searchParams.append('locale', locale);
      
      console.log('🔍 contentService: URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      console.log('🔍 contentService: Status:', response.status);
      console.log('🔍 contentService: StatusText:', response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 contentService: Erreur response:', errorText);
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('🔍 contentService: Résultat:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }

      // Retourner une structure compatible
      return {
        id: section,
        section: section,
        locale: locale,
        content: content,
        updated_at: new Date().toISOString(),
        updated_by: 'admin'
      };
    } catch (error) {
      console.error(`🔍 contentService: Erreur lors de la mise à jour de la section ${section}:`, error);
      throw error;
    }
  }

  // Méthodes supprimées - plus utilisées avec la nouvelle architecture JSON locale
}

export const contentService = new ContentService();
