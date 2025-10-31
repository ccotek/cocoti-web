import { useState, useEffect, useMemo } from 'react';

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

  // Mémoriser l'URL de l'API pour éviter les re-créations
  const API_URL = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // S'assurer qu'on n'ajoute pas /api/v1 deux fois
    return baseUrl.endsWith('/api/v1') ? baseUrl.replace('/api/v1', '') : baseUrl;
  }, []);
  const hasApiUrl = useMemo(() => !!process.env.NEXT_PUBLIC_API_URL, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // URL directe vers le backend - pas de proxy Next.js
        const url = `${API_URL}/api/v1/money-pools/public?limit=6&page=1`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Ajouter les options pour éviter les problèmes CORS
          mode: 'cors',
          credentials: 'omit',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to fetch money pools: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // If no data or empty array, return empty
        if (!data || data.length === 0) {
          setProjects([]);
          setLoading(false);
          setError(null);
          return;
        }
        
        // Convert API data to PublicProject format
        // Filtrer et valider les cagnottes avant de les mapper
        const validPools = data.filter((pool: any) => {
          // Valider que la cagnotte a toutes les données essentielles
          // Et que l'ID est valide (ObjectId MongoDB = 24 caractères hexadécimaux)
          const isValidId = pool.id && 
                           typeof pool.id === 'string' && 
                           pool.id.length === 24 && 
                           /^[0-9a-fA-F]{24}$/.test(pool.id);
          
          return pool && 
                 isValidId &&
                 pool.name && 
                 pool.name.trim() !== '' &&
                 pool.settings && 
                 typeof pool.settings.target_amount === 'number' &&
                 pool.settings.target_amount > 0 &&
                 typeof pool.current_amount === 'number' &&
                 pool.current_amount >= 0 &&
                 pool.currency &&
                 pool.status === 'active' && // S'assurer que seules les cagnottes actives sont affichées
                 pool.visibility === 'public'; // S'assurer que seules les cagnottes publiques sont affichées
        });
        
        // Logger pour debug si des cagnottes ont été filtrées
        if (data.length > validPools.length) {
          console.warn(`Filtered out ${data.length - validPools.length} invalid money pools from carousel`);
        }
        
        // Le backend filtre maintenant les documents invalides
        // On fait confiance aux données retournées après validation stricte
        const publicProjects: PublicProject[] = validPools.map((pool: any) => ({
          id: pool.id,
          title: pool.name,
          description: pool.description || '',
          image: pool.images && pool.images.length > 0 ? pool.images[0] : "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
          progress: pool.settings.target_amount > 0 
            ? Math.round((pool.current_amount / pool.settings.target_amount) * 100) 
            : 0,
          target: `${pool.settings.target_amount.toLocaleString('fr-FR')} ${pool.currency}`,
          raised: `${pool.current_amount.toLocaleString('fr-FR')} ${pool.currency}`,
          category: locale === 'fr' ? 'Cagnotte' : 'Money Pool',
          urgent: false
        }));
        
        setProjects(publicProjects);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching money pools:', err);
        // On error, return empty array - don't fallback to mock data
        setProjects([]);
        setLoading(false);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchProjects();
  }, [locale, API_URL]);

  return {
    projects,
    loading,
    error,
    hasApiUrl
  };
}
