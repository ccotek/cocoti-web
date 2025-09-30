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

  private getBaseUrl(): string {
    // Côté serveur, utiliser une URL relative ou une variable d'environnement
    if (typeof window === 'undefined') {
      // Côté serveur - utiliser une URL relative ou une variable d'environnement
      return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    }
    // Côté client - utiliser window.location.origin
    return window.location.origin;
  }

  async getAllContent(locale?: string): Promise<ContentData[]> {
    try {
       // Utiliser l'API locale pour récupérer le contenu
       const url = new URL('/api/cms/content', this.getBaseUrl());
      if (locale) {
        url.searchParams.append('locale', locale);
      }

      console.log('🔍 ContentService: Appel API vers', url.toString());

          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('🔍 ContentService: Réponse API reçue, status:', response.status);

          if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          console.log('🔍 ContentService: Résultat API:', result.success ? 'Succès' : 'Échec');
          console.log('🔍 ContentService: Données complètes reçues:', result);
      
      if (!result.success) {
        console.error('🔍 ContentService: Erreur API:', result.error);
        throw new Error(result.error || 'Erreur lors de la récupération du contenu');
      }

      // Transformer les données JSON en format ContentData
      const data = result.content;
      console.log('🔍 ContentService: Données brutes reçues:', data.legal ? 'Section legal présente' : 'Section legal manquante');
      
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
        },
        {
          id: 'whatsapp',
          section: 'whatsapp',
          locale: locale || 'fr',
          content: data.whatsapp,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        },
        {
          id: 'legal',
          section: 'legal',
          locale: locale || 'fr',
          content: data.legal,
          updated_at: new Date().toISOString(),
          updated_by: 'local'
        }
      ];

      console.log('🔍 ContentService: Sections finales:', contentData.map(item => item.section));
      console.log('🔍 ContentService: Section legal incluse:', contentData.some(item => item.section === 'legal'));

          return contentData;
    } catch (error) {
      console.error('🔍 ContentService: Erreur lors de la récupération du contenu:', error);
      console.error('🔍 ContentService: Type d\'erreur:', typeof error);
      console.error('🔍 ContentService: Message d\'erreur:', error.message);
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
          // Utiliser l'API locale pour mettre à jour le fichier JSON
          const url = new URL('/api/cms/content', this.getBaseUrl());
          url.searchParams.append('section', section);
          url.searchParams.append('locale', locale);

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur response:', errorText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
      
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
          console.error(`Erreur lors de la mise à jour de la section ${section}:`, error);
          throw error;
        }
  }

  // Méthodes supprimées - plus utilisées avec la nouvelle architecture JSON locale
}

export const contentService = new ContentService();
