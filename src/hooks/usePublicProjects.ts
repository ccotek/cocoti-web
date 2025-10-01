import { useState, useEffect } from 'react';

export interface PublicProject {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  target: string;
  raised: string;
  category: string;
  urgent?: boolean;
}

interface UsePublicProjectsReturn {
  projects: PublicProject[];
  loading: boolean;
  error: string | null;
  hasApiUrl: boolean;
}

export function usePublicProjects(locale: 'fr' | 'en' = 'fr'): UsePublicProjectsReturn {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const hasApiUrl = !!process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Données par défaut en attendant l'API
    console.log('Using default cagnottes data');
    
    const defaultCagnottes: PublicProject[] = [
      {
        id: "education-rural",
        title: locale === 'fr' ? "École primaire de Ndiaganiao" : "Ndiaganiao Primary School",
        description: locale === 'fr' 
          ? "Construction d'une école primaire pour offrir un accès à l'éducation à 200 enfants du village."
          : "Building a primary school to provide education access to 200 village children.",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80",
        progress: 75,
        target: "15 000 000 FCFA",
        raised: "11 250 000 FCFA",
        category: locale === 'fr' ? "Éducation" : "Education",
        urgent: false
      },
      {
        id: "sante-maternelle",
        title: locale === 'fr' ? "Centre de santé maternelle" : "Maternal Health Center",
        description: locale === 'fr'
          ? "Équipement d'un centre de santé pour améliorer les soins maternels et infantiles dans la région de Thiès."
          : "Equipping a health center to improve maternal and child care in the Thiès region.",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
        progress: 45,
        target: "8 500 000 FCFA",
        raised: "3 825 000 FCFA",
        category: locale === 'fr' ? "Santé" : "Health",
        urgent: true
      },
      {
        id: "eau-potable",
        title: locale === 'fr' ? "Accès à l'eau potable" : "Clean Water Access",
        description: locale === 'fr'
          ? "Installation de pompes à eau dans 5 villages pour garantir un accès durable à l'eau potable."
          : "Installing water pumps in 5 villages to ensure sustainable access to clean water.",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=800&q=80",
        progress: 90,
        target: "12 000 000 FCFA",
        raised: "10 800 000 FCFA",
        category: locale === 'fr' ? "Développement" : "Development",
        urgent: false
      },
      {
        id: "agriculture-durable",
        title: locale === 'fr' ? "Formation agricole durable" : "Sustainable Agriculture Training",
        description: locale === 'fr'
          ? "Formation de 150 agriculteurs aux techniques d'agriculture durable et fourniture d'équipements modernes."
          : "Training 150 farmers in sustainable agriculture techniques and providing modern equipment.",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
        progress: 60,
        target: "9 500 000 FCFA",
        raised: "5 700 000 FCFA",
        category: locale === 'fr' ? "Agriculture" : "Agriculture",
        urgent: false
      },
      {
        id: "entrepreneuriat-feminin",
        title: locale === 'fr' ? "Micro-crédit femmes" : "Women Micro-credit",
        description: locale === 'fr'
          ? "Programme de formation et de micro-crédit pour 200 femmes entrepreneures dans la région de Dakar."
          : "Training program and micro-credit for 200 women entrepreneurs in the Dakar region.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        progress: 30,
        target: "20 000 000 FCFA",
        raised: "6 000 000 FCFA",
        category: locale === 'fr' ? "Entrepreneuriat" : "Entrepreneurship",
        urgent: true
      },
      {
        id: "energie-solaire",
        title: locale === 'fr' ? "Énergie solaire rurale" : "Rural Solar Energy",
        description: locale === 'fr'
          ? "Installation de panneaux solaires dans 10 villages pour l'éclairage et l'alimentation des équipements."
          : "Installing solar panels in 10 villages for lighting and powering equipment.",
        image: "https://images.unsplash.com/photo-1509391366360-2e959f9c2825?auto=format&fit=crop&w=800&q=80",
        progress: 85,
        target: "18 000 000 FCFA",
        raised: "15 300 000 FCFA",
        category: locale === 'fr' ? "Énergie" : "Energy",
        urgent: false
      }
    ];

    setLoading(false);
    setProjects(defaultCagnottes);
    setError(null);
  }, [locale]);

  return {
    projects,
    loading,
    error,
    hasApiUrl
  };
}
