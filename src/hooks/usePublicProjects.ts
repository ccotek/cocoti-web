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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // URL directe vers le backend - pas de proxy Next.js
        const API_URL = 'http://localhost:8000';
        const url = `${API_URL}/api/v1/money-pools/public?limit=6&page=1`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch money pools');
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
        const publicProjects: PublicProject[] = data.map((pool: any) => ({
          id: pool.id,
          title: pool.name,
          description: pool.description,
          image: pool.images && pool.images.length > 0 ? pool.images[0] : "https://images.unsplash.com/photo-1554224154-8ec4e497d64f?auto=format&fit=crop&w=800&q=80",
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
  }, [locale]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const hasApiUrl = !!process.env.NEXT_PUBLIC_API_URL;

  return {
    projects,
    loading,
    error,
    hasApiUrl
  };
}
