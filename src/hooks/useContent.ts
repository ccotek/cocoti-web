"use client";

import { useState, useEffect } from "react";
import { contentService, ContentData as ApiContentData } from "@/services/contentService";

// Fonction pour transformer les données API en format ContentData
function transformApiContentToContentData(apiContent: ApiContentData[]): any {
  const result: any = {};
  
  apiContent.forEach(item => {
    result[item.section] = item.content;
  });
  
  return result;
}

// Types pour le contenu
export type ContentData = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    download: string;
    viewDashboard: string;
    viewDashboardLink: string;
    apps: Array<{ store: string; label: string; href: string }>;
    stats: Array<{ value: string; label: string }>;
    mockupAlt: string;
  };
  solutions: {
    title: string;
    subtitle: string;
    items: Array<{ id: string; title: string; description: string }>;
  };
  how: {
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  why: {
    title: string;
    subtitle: string;
    values: Array<{ title: string; description: string }>;
  };
  pricing: {
    title: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      cta: string;
      highlight?: boolean;
    }>;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      quote: string;
      avatar: string;
    }>;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  contact: {
    title: string;
    description: string;
    button: string;
    whatsapp: string;
    whatsappLink: string;
  };
  footer: {
    links: Array<{ label: string; href: string }>;
    socials: Array<{ label: string; href: string }>;
    company: string;
  };
};

export function useContent(locale: 'fr' | 'en') {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le contenu depuis l'API ou les fichiers JSON de fallback
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        
        try {
          // Essayer de charger depuis l'API
          const apiContent = await contentService.getAllContent(locale);
          if (apiContent && apiContent.length > 0) {
            // Transformer les données API en format ContentData
            data = transformApiContentToContentData(apiContent);
          } else {
            throw new Error('No content from API');
          }
        } catch (apiError) {
          console.warn('API not available, using fallback JSON files:', apiError);
          // Fallback vers les fichiers JSON existants
          const messages = await import(`@/i18n/messages/${locale}.json`);
          data = messages.default;
        }
        
        // Transformer les données JSON en format ContentData
        const contentData: ContentData = {
          hero: {
            badge: data.hero.badge,
            title: data.hero.title,
            subtitle: data.hero.subtitle,
            download: data.hero.download,
            viewDashboard: data.hero.viewDashboard,
            viewDashboardLink: data.hero.viewDashboardLink,
            apps: data.hero.apps,
            stats: data.hero.stats,
            mockupAlt: data.hero.mockupAlt
          },
          solutions: {
            title: data.solutions.title,
            subtitle: data.solutions.subtitle,
            items: data.solutions.items
          },
          how: {
            title: data.how.title,
            steps: data.how.steps
          },
          why: {
            title: data.why.title,
            subtitle: data.why.subtitle,
            values: data.why.values
          },
          pricing: {
            title: data.pricing.title,
            plans: data.pricing.plans
          },
          testimonials: {
            title: data.testimonials.title,
            subtitle: data.testimonials.subtitle,
            items: data.testimonials.items
          },
          faq: {
            title: data.faq.title,
            items: data.faq.items
          },
          contact: {
            title: data.contact.title,
            description: data.contact.description,
            button: data.contact.button,
            whatsapp: data.contact.whatsapp,
            whatsappLink: data.contact.whatsappLink
          },
          footer: {
            links: data.footer.links,
            socials: data.footer.socials,
            company: data.footer.company
          }
        };
        
        setContent(contentData);
      } catch (err) {
        setError('Erreur lors du chargement du contenu');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [locale]);

  const updateContent = async (section: keyof ContentData, data: any) => {
    try {
      // Envoyer les données à l'API
      await contentService.updateContentSection(section, data, locale);
      
      // Mettre à jour le state local
      setContent(prev => prev ? { ...prev, [section]: data } : null);
      
      return { success: true };
    } catch (err) {
      console.error('Error updating content:', err);
      return { success: false, error: 'Erreur lors de la sauvegarde' };
    }
  };

  return {
    content,
    loading,
    error,
    updateContent
  };
}
