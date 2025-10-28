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
  
  // Configuration par défaut
  const defaultConfig: CausesCarouselConfig = {
    enabled: true,
    autoRotate: true,
    rotationSpeed: 5,
    maxProjects: 6,
    selectedProjects: [],
    title: locale === 'fr' ? 'Des projets qui changent tout' : 'Projects that change everything',
    subtitle: locale === 'fr' 
      ? 'Rejoignez des milliers de personnes qui transforment leurs communautés grâce à la solidarité collective.'
      : 'Join thousands of people transforming their communities through collective solidarity.'
  };

  // Utiliser les données du CMS si disponibles, sinon les valeurs par défaut
  const config: CausesCarouselConfig = content?.causes ? {
    enabled: content.causes.enabled ?? defaultConfig.enabled,
    autoRotate: content.causes.autoRotate ?? defaultConfig.autoRotate,
    rotationSpeed: content.causes.rotationSpeed ?? defaultConfig.rotationSpeed,
    maxProjects: content.causes.maxProjects ?? defaultConfig.maxProjects,
    selectedProjects: content.causes.selectedProjects ?? defaultConfig.selectedProjects,
    title: content.causes.title || defaultConfig.title,
    subtitle: content.causes.subtitle || defaultConfig.subtitle
  } : defaultConfig;

  return { config, loading };
}
