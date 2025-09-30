import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Interface supprimée - les mentions légales sont maintenant codées en dur

export interface PrivacyPolicyData {
  title: string;
  lastUpdated: string;
  sections: {
    title: string;
    content: string;
    subsections?: {
      title: string;
      content: string;
      items?: string[];
    }[];
  }[];
}

export interface TermsOfServiceData {
  title: string;
  lastUpdated: string;
  sections: {
    title: string;
    content: string;
    definitions?: {
      term: string;
      definition: string;
    }[];
    allowed?: string[];
    forbidden?: string[];
  }[];
}

// Fonction supprimée - les mentions légales sont maintenant codées en dur


export function readPrivacyPolicyMarkdown(locale: 'fr' | 'en'): PrivacyPolicyData {
  try {
    // Utiliser la variable d'environnement ou le chemin par défaut
    const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
    const filePath = join(process.cwd(), legalFilesPath, locale, 'privacy-policy.md');
    
    // Vérifier si le fichier existe
    if (!existsSync(filePath)) {
      console.warn(`⚠️  Fichier privacy-policy.md non trouvé pour ${locale} dans ${legalFilesPath}`);
      console.warn(`📁 Chemin recherché: ${filePath}`);
      console.warn(`🔧 Variable LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH || 'non définie (utilise le défaut: _resources/legal)'}`);
      // Retourner un message temporairement indisponible
      return {
        title: locale === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy',
        lastUpdated: locale === 'fr' ? 'Dernière mise à jour' : 'Last updated',
        sections: [{
          title: locale === 'fr' ? 'Service temporairement indisponible' : 'Service temporarily unavailable',
          content: locale === 'fr' 
            ? 'La politique de confidentialité est temporairement indisponible. Veuillez réessayer plus tard.'
            : 'Privacy policy is temporarily unavailable. Please try again later.'
        }]
      };
    }
    
    const content = readFileSync(filePath, 'utf-8');
    
    // Parser pour extraire les sections de la privacy policy
    const lines = content.split('\n');
    const sections: PrivacyPolicyData['sections'] = [];
    let currentSection: any = null;
    let currentSubsection: any = null;
    let contentLines: string[] = [];
    let subsectionContentLines: string[] = [];
    let items: string[] = [];
    let inItems = false;
    let title = '';
    let lastUpdated = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extraire le titre principal
      if (line.startsWith('# ')) {
        title = line.replace('# ', '');
        continue;
      }

      // Extraire la date de mise à jour
      if (line.startsWith('## ')) {
        lastUpdated = line.replace('## ', '');
        continue;
      }
      
      // Section (###)
      if (line.startsWith('### ')) {
        // Sauvegarder la section précédente
        if (currentSection) {
          if (currentSubsection) {
            currentSubsection.content = subsectionContentLines.join(' ').trim();
            if (items.length > 0) {
              currentSubsection.items = items;
            }
            currentSection.subsections = currentSection.subsections || [];
            currentSection.subsections.push(currentSubsection);
          }
          currentSection.content = contentLines.join(' ').trim();
          sections.push(currentSection);
        }
        
        // Nouvelle section
        currentSection = {
          title: line.replace('### ', ''),
          content: ''
        };
        contentLines = [];
        currentSubsection = null;
        subsectionContentLines = [];
        items = [];
        inItems = false;
        continue;
      }
      
      // Sous-section (####)
      if (line.startsWith('#### ')) {
        // Sauvegarder la sous-section précédente
        if (currentSubsection) {
          currentSubsection.content = subsectionContentLines.join(' ').trim();
          if (items.length > 0) {
            currentSubsection.items = items;
          }
          currentSection.subsections = currentSection.subsections || [];
          currentSection.subsections.push(currentSubsection);
        }
        
        // Nouvelle sous-section
        currentSubsection = {
          title: line.replace('#### ', ''),
          content: ''
        };
        subsectionContentLines = [];
        items = [];
        inItems = false;
        continue;
      }
      
      // Détecter le début des exemples/items
      if (line === '**Exemples :**' || line === '**Examples:**') {
        inItems = true;
        continue;
      }
      
      // Parser les items
      if (inItems && line.startsWith('- ')) {
        items.push(line.replace('- ', ''));
        continue;
      }
      
      // Ajouter le contenu
      if (currentSubsection && line && !line.startsWith('**')) {
        subsectionContentLines.push(line);
      } else if (currentSection && line && !line.startsWith('**') && !currentSubsection) {
        contentLines.push(line);
      }
    }
    
    // Ajouter la dernière section
    if (currentSection) {
      if (currentSubsection) {
        currentSubsection.content = subsectionContentLines.join(' ').trim();
        if (items.length > 0) {
          currentSubsection.items = items;
        }
        currentSection.subsections = currentSection.subsections || [];
        currentSection.subsections.push(currentSubsection);
      }
      currentSection.content = contentLines.join(' ').trim();
      sections.push(currentSection);
    }
    
    return {
      title: title || (locale === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'),
      lastUpdated: lastUpdated || (locale === 'fr' ? 'Dernière mise à jour' : 'Last updated'),
      sections
    };
    
  } catch (error) {
    console.error('Error reading privacy policy markdown:', error);
    // Retourner un message temporairement indisponible
    return {
      title: locale === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy',
      lastUpdated: locale === 'fr' ? 'Dernière mise à jour' : 'Last updated',
      sections: [{
        title: locale === 'fr' ? 'Service temporairement indisponible' : 'Service temporarily unavailable',
        content: locale === 'fr' 
          ? 'La politique de confidentialité est temporairement indisponible. Veuillez réessayer plus tard.'
          : 'Privacy policy is temporarily unavailable. Please try again later.'
      }]
    };
  }
}

export function readTermsOfServiceMarkdown(locale: 'fr' | 'en'): TermsOfServiceData {
  try {
    // Utiliser la variable d'environnement ou le chemin par défaut
    const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
    const filePath = join(process.cwd(), legalFilesPath, locale, 'terms-of-service.md');
    
    // Vérifier si le fichier existe
    if (!existsSync(filePath)) {
      console.warn(`⚠️  Fichier terms-of-service.md non trouvé pour ${locale} dans ${legalFilesPath}`);
      console.warn(`📁 Chemin recherché: ${filePath}`);
      console.warn(`🔧 Variable LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH || 'non définie (utilise le défaut: _resources/legal)'}`);
      // Retourner un message temporairement indisponible
      return {
        title: locale === 'fr' ? 'Conditions Générales d\'Utilisation' : 'Terms of Service',
        lastUpdated: locale === 'fr' ? 'Dernière mise à jour' : 'Last updated',
        sections: [{
          title: locale === 'fr' ? 'Service temporairement indisponible' : 'Service temporarily unavailable',
          content: locale === 'fr' 
            ? 'Les conditions générales d\'utilisation sont temporairement indisponibles. Veuillez réessayer plus tard.'
            : 'Terms of service are temporarily unavailable. Please try again later.'
        }]
      };
    }
    
    const content = readFileSync(filePath, 'utf-8');
    
    // Parser pour extraire les sections des Terms of Service
    const lines = content.split('\n');
    const sections: TermsOfServiceData['sections'] = [];
    let currentSection: any = null;
    let contentLines: string[] = [];
    let definitions: any[] = [];
    let allowed: string[] = [];
    let forbidden: string[] = [];
    let inDefinitions = false;
    let inAllowed = false;
    let inForbidden = false;
    let title = '';
    let lastUpdated = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extraire le titre principal
      if (line.startsWith('# ')) {
        title = line.replace('# ', '');
        continue;
      }

      // Extraire la date de mise à jour
      if (line.startsWith('## ')) {
        lastUpdated = line.replace('## ', '');
        continue;
      }
      
      // Section (###)
      if (line.startsWith('### ')) {
        // Sauvegarder la section précédente
        if (currentSection) {
          currentSection.content = contentLines.join(' ').trim();
          if (definitions.length > 0) {
            currentSection.definitions = definitions;
          }
          if (allowed.length > 0) {
            currentSection.allowed = allowed;
          }
          if (forbidden.length > 0) {
            currentSection.forbidden = forbidden;
          }
          sections.push(currentSection);
        }
        
        // Nouvelle section
        currentSection = {
          title: line.replace('### ', ''),
          content: ''
        };
        contentLines = [];
        definitions = [];
        allowed = [];
        forbidden = [];
        inDefinitions = false;
        inAllowed = false;
        inForbidden = false;
        continue;
      }
      
      // Détecter le début des définitions
      if (line === '**Définitions :**' || line === '**Definitions:**') {
        inDefinitions = true;
        inAllowed = false;
        inForbidden = false;
        continue;
      }
      
      // Détecter le début des éléments autorisés
      if (line === '**Autorisé :**' || line === '**Allowed:**') {
        inAllowed = true;
        inDefinitions = false;
        inForbidden = false;
        continue;
      }
      
      // Détecter le début des éléments interdits
      if (line === '**Interdit :**' || line === '**Forbidden:**') {
        inForbidden = true;
        inDefinitions = false;
        inAllowed = false;
        continue;
      }
      
      // Parser les définitions
      if (inDefinitions && line.startsWith('- **')) {
        const match = line.match(/- \*\*([^*]+)\*\*: (.+)/);
        if (match) {
          const [, term, definition] = match;
          definitions.push({ term, definition });
        }
        continue;
      }
      
      // Parser les éléments autorisés
      if (inAllowed && line.startsWith('- ')) {
        allowed.push(line.replace('- ', ''));
        continue;
      }
      
      // Parser les éléments interdits
      if (inForbidden && line.startsWith('- ')) {
        forbidden.push(line.replace('- ', ''));
        continue;
      }
      
      // Ajouter le contenu
      if (currentSection && line && !line.startsWith('**') && !inDefinitions && !inAllowed && !inForbidden) {
        contentLines.push(line);
      }
    }
    
    // Ajouter la dernière section
    if (currentSection) {
      currentSection.content = contentLines.join(' ').trim();
      if (definitions.length > 0) {
        currentSection.definitions = definitions;
      }
      if (allowed.length > 0) {
        currentSection.allowed = allowed;
      }
      if (forbidden.length > 0) {
        currentSection.forbidden = forbidden;
      }
      sections.push(currentSection);
    }
    
    return {
      title: title || (locale === 'fr' ? 'Conditions Générales d\'Utilisation' : 'Terms of Service'),
      lastUpdated: lastUpdated || (locale === 'fr' ? 'Dernière mise à jour' : 'Last updated'),
      sections
    };
    
  } catch (error) {
    console.error('Error reading terms of service markdown:', error);
    // Retourner un message temporairement indisponible
    return {
      title: locale === 'fr' ? 'Conditions Générales d\'Utilisation' : 'Terms of Service',
      lastUpdated: locale === 'fr' ? 'Dernière mise à jour' : 'Last updated',
      sections: [{
        title: locale === 'fr' ? 'Service temporairement indisponible' : 'Service temporarily unavailable',
        content: locale === 'fr' 
          ? 'Les conditions générales d\'utilisation sont temporairement indisponibles. Veuillez réessayer plus tard.'
          : 'Terms of service are temporarily unavailable. Please try again later.'
      }]
    };
  }
}

/**
 * Obtient la configuration actuelle des fichiers légaux
 */
export function getLegalFilesConfig() {
  const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
  const basePath = join(process.cwd(), legalFilesPath);
  
  return {
    path: legalFilesPath,
    fullPath: basePath,
    frFile: join(basePath, 'fr', 'legal-notice.md'),
    enFile: join(basePath, 'en', 'legal-notice.md'),
    frExists: existsSync(join(basePath, 'fr', 'legal-notice.md')),
    enExists: existsSync(join(basePath, 'en', 'legal-notice.md'))
  };
}
