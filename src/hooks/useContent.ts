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
    image: string;
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
    subtitle?: string;
    description: string;
    button: string;
    email: string;
    phone: string;
    whatsapp: string;
    whatsappLink: string;
    social?: {
      title: string;
      description: string;
    };
    hours?: {
      title: string;
      description: string;
      weekend: string;
    };
  };
  footer: {
    company: string;
    legalLinks: Array<{
      label: string;
      href: string;
    }>;
    socialLinks: Array<{
      label: string;
      href: string;
      icon?: string;
    }>;
    quickLinks: Array<{
      label: string;
      href: string;
    }>;
  };
  causes: {
    title: string;
    subtitle: string;
    enabled: boolean;
    autoRotate: boolean;
    rotationSpeed: number;
    maxProjects: number;
    selectedProjects: string[];
  };
  whatsapp: {
    number: string;
    message: string;
  };
  legal: {
    title: string;
    subtitle: string;
    sections: Array<{
      title: string;
      content: string;
      company?: {
        name: string;
        address: string;
        phone: string;
        email: string;
      };
    }>;
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
                // Utiliser directement l'API /api/cms/content
                const url = new URL('/api/cms/content', window.location.origin);
                url.searchParams.append('locale', locale);
                
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
                
                if (!result.success) {
                  throw new Error(result.error || 'Erreur lors de la récupération du contenu');
                }

                data = result.content;
              } catch (apiError) {
                console.warn('API non disponible, utilisation des fichiers JSON:', apiError);
                // Fallback vers les fichiers JSON existants
                const messages = await import(`@/i18n/messages/${locale}.json`);
                data = messages.default;
              }
        

        // Transformer les données JSON en format ContentData
        const contentData: ContentData = {
          hero: {
            badge: data.hero?.badge || '',
            title: data.hero?.title || '',
            subtitle: data.hero?.subtitle || '',
            download: data.hero?.download || '',
            viewDashboard: data.hero?.viewDashboard || '',
            viewDashboardLink: data.hero?.viewDashboardLink || '',
            apps: data.hero?.apps || [],
            stats: data.hero?.stats || [],
            mockupAlt: data.hero?.mockupAlt || '',
            image: data.hero?.image || ''
          },
          solutions: {
            title: data.solutions?.title || '',
            subtitle: data.solutions?.subtitle || '',
            items: data.solutions?.items || []
          },
          how: {
            title: data.how?.title || '',
            steps: data.how?.steps || []
          },
          why: {
            title: data.why?.title || '',
            subtitle: data.why?.subtitle || '',
            values: data.why?.values || []
          },
          pricing: {
            title: data.pricing?.title || '',
            plans: data.pricing?.plans || []
          },
          testimonials: {
            title: data.testimonials?.title || '',
            subtitle: data.testimonials?.subtitle || '',
            items: data.testimonials?.items || []
          },
          faq: {
            title: data.faq?.title || '',
            items: data.faq?.items || []
          },
          contact: {
            title: data.contact?.title || '',
            subtitle: data.contact?.subtitle || '',
            description: data.contact?.description || '',
            button: data.contact?.button || '',
            email: data.contact?.email || '',
            phone: data.contact?.phone || '',
            whatsapp: data.contact?.whatsapp || '',
            whatsappLink: data.contact?.whatsappLink || '',
            social: data.contact?.social || undefined,
            hours: data.contact?.hours || undefined
          },
          footer: {
            company: data.footer?.company || '',
            legalLinks: data.footer?.legalLinks || [],
            socialLinks: data.footer?.socialLinks || [],
            quickLinks: data.footer?.quickLinks || []
          },
          causes: {
            title: data.causes?.title || (locale === 'fr' ? 'Des projets qui changent tout' : 'Projects that change everything'),
            subtitle: data.causes?.subtitle || (locale === 'fr' 
              ? 'Rejoignez des milliers de personnes qui transforment leurs communautés grâce à la solidarité collective.'
              : 'Join thousands of people transforming their communities through collective solidarity.'),
            enabled: data.causes?.enabled ?? true,
            autoRotate: data.causes?.autoRotate ?? true,
            rotationSpeed: data.causes?.rotationSpeed ?? 5,
            maxProjects: data.causes?.maxProjects ?? 6,
            selectedProjects: data.causes?.selectedProjects || []
          },
          whatsapp: {
            number: data.whatsapp?.number || '',
            message: data.whatsapp?.message || ''
          },
          legal: {
            title: data.legal?.title || (locale === 'fr' ? 'Mentions légales' : 'Legal Notice'),
            subtitle: data.legal?.subtitle || (locale === 'fr' ? 'Informations légales sur l\'éditeur du site' : 'Legal information about the site publisher'),
            sections: data.legal?.sections || [
              {
                title: locale === 'fr' ? 'Éditeur du site' : 'Site publisher',
                content: locale === 'fr' ? 'Informations sur l\'entreprise éditrice du site.' : 'Information about the company publishing the site.',
                company: {
                  name: 'Cocoti SAS',
                  address: '123 Avenue de la République, 75011 Paris, France',
                  phone: '+33 1 23 45 67 89',
                  email: 'contact@cocoti.com'
                }
              },
              {
                title: locale === 'fr' ? 'Directeur de publication' : 'Publication director',
                content: locale === 'fr' ? 'Le directeur de la publication est le Président de Cocoti SAS.' : 'The publication director is the President of Cocoti SAS.'
              },
              {
                title: locale === 'fr' ? 'Hébergement' : 'Hosting',
                content: locale === 'fr' ? 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.' : 'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.'
              },
              {
                title: locale === 'fr' ? 'Propriété intellectuelle' : 'Intellectual property',
                content: locale === 'fr' ? 'L\'ensemble de ce site relève de la législation française et internationale sur le droit d\'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.' : 'This entire site is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved.'
              },
              {
                title: locale === 'fr' ? 'Responsabilité' : 'Liability',
                content: locale === 'fr' ? 'Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l\'année, mais peut toutefois contenir des inexactitudes ou des omissions.' : 'The information contained on this site is as accurate as possible and the site is updated at different times of the year, but may nevertheless contain inaccuracies or omissions.'
              },
              {
                title: locale === 'fr' ? 'Liens hypertextes' : 'Hyperlinks',
                content: locale === 'fr' ? 'Des liens hypertextes peuvent être présents sur le site. L\'utilisateur est informé qu\'en cliquant sur ces liens, il sortira du site cocoti.com.' : 'Hyperlinks may be present on the site. The user is informed that by clicking on these links, they will leave the cocoti.com site.'
              }
            ]
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
            // Utiliser directement l'API /api/cms/content
            const url = new URL('/api/cms/content', window.location.origin);
            url.searchParams.append('locale', locale);
            url.searchParams.append('section', section);
            
            const response = await fetch(url.toString(), {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ content: data }),
            });

            if (!response.ok) {
              throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
              throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }
            
            // Mettre à jour le state local
            setContent(prev => prev ? { ...prev, [section]: data } : null);

            return { success: true };
          } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
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
