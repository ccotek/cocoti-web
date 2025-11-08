import { useMemo, useRef } from 'react';
import { useContent } from './useContent';

interface CausesCarouselConfig {
  enabled: boolean;
  autoRotate: boolean;
  rotationSpeed: number;
  maxProjects: number;
  selectedProjects: string[];
  title: string;
  subtitle: string;
}

export function useCausesCarouselConfig(locale: 'fr' | 'en' = 'fr') {
  const { content, loading } = useContent(locale);
  
  // Configuration par défaut - mémorisée pour éviter les re-créations
  const defaultConfig: CausesCarouselConfig = useMemo(() => ({
    enabled: true,
    autoRotate: true,
    rotationSpeed: 5,
    maxProjects: 6,
    selectedProjects: [],
    title: locale === 'fr' ? 'Des projets qui changent tout' : 'Projects that change everything',
    subtitle: locale === 'fr' 
      ? 'Rejoignez des milliers de personnes qui transforment leurs communautés grâce à la solidarité collective.'
      : 'Join thousands of people transforming their communities through collective solidarity.'
  }), [locale]);

  // Utiliser les données du CMS si disponibles, sinon les valeurs par défaut - mémorisé
  // Utiliser useRef pour comparer les valeurs précédentes et éviter les re-renders inutiles
  const previousConfigRef = useRef<CausesCarouselConfig | null>(null);
  const previousConfigStringRef = useRef<string | null>(null);
  
  const config: CausesCarouselConfig = useMemo(() => {
    const newConfig = content?.causes ? {
      enabled: content.causes.enabled ?? defaultConfig.enabled,
      autoRotate: content.causes.autoRotate ?? defaultConfig.autoRotate,
      rotationSpeed: content.causes.rotationSpeed ?? defaultConfig.rotationSpeed,
      maxProjects: content.causes.maxProjects ?? defaultConfig.maxProjects,
      selectedProjects: content.causes.selectedProjects ?? defaultConfig.selectedProjects,
      title: content.causes.title || defaultConfig.title,
      subtitle: content.causes.subtitle || defaultConfig.subtitle
    } : defaultConfig;
    
    // Comparer avec la configuration précédente pour éviter les re-renders inutiles
    const configString = JSON.stringify(newConfig);
    if (previousConfigStringRef.current === configString && previousConfigRef.current) {
      // Retourner la même référence si les valeurs sont identiques
      return previousConfigRef.current;
    }
    previousConfigStringRef.current = configString;
    previousConfigRef.current = newConfig;
    
    return newConfig;
  }, [content?.causes, defaultConfig]);

  return { config, loading };
}
