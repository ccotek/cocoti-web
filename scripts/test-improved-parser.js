#!/usr/bin/env node

/**
 * Script pour tester le parser Markdown amélioré
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test du parser Markdown amélioré\n');

// Lire le fichier .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      process.env[key.trim()] = value.trim();
    }
  });
}

console.log('📋 Configuration:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH}\n`);

// Simuler la fonction readLegalNoticeMarkdown
function testMarkdownParser(locale) {
  try {
    const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
    const filePath = path.join(process.cwd(), legalFilesPath, locale, 'legal-notice.md');
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Fichier non trouvé: ${filePath}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`✅ Fichier trouvé: ${filePath}`);
    
    // Parser amélioré
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let inCompanyInfo = false;
    let companyInfo = {};
    let contentLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Ignorer les titres principaux et sous-titres
      if (line.startsWith('# ') || line.startsWith('## ')) {
        continue;
      }
      
      // Section (###)
      if (line.startsWith('### ')) {
        // Sauvegarder la section précédente
        if (currentSection) {
          currentSection.content = contentLines.join(' ').trim();
          if (Object.keys(companyInfo).length > 0) {
            currentSection.company = companyInfo;
          }
          sections.push(currentSection);
        }
        
        // Nouvelle section
        currentSection = {
          title: line.replace('### ', ''),
          content: ''
        };
        contentLines = [];
        inCompanyInfo = false;
        companyInfo = {};
        continue;
      }
      
      // Détecter le début des informations de l'entreprise
      if (line === '**Informations de l\'entreprise :**' || line === '**Company information:**') {
        inCompanyInfo = true;
        continue;
      }
      
      // Parser les informations de l'entreprise
      if (inCompanyInfo && line.startsWith('- **')) {
        const match = line.match(/- \*\*([^*]+)\*\*: (.+)/);
        if (match) {
          const [, key, value] = match;
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
          if (normalizedKey === 'nom' || normalizedKey === 'name') companyInfo.name = value;
          if (normalizedKey === 'adresse' || normalizedKey === 'address') companyInfo.address = value;
          if (normalizedKey === 'téléphone' || normalizedKey === 'phone') companyInfo.phone = value;
          if (normalizedKey === 'email') companyInfo.email = value;
        }
        continue;
      }
      
      // Ajouter le contenu de la section
      if (currentSection && line && !line.startsWith('**') && !line.startsWith('- **') && !inCompanyInfo) {
        contentLines.push(line);
      }
    }
    
    // Ajouter la dernière section
    if (currentSection) {
      currentSection.content = contentLines.join(' ').trim();
      if (Object.keys(companyInfo).length > 0) {
        currentSection.company = companyInfo;
      }
      sections.push(currentSection);
    }
    
    return {
      title: locale === 'fr' ? 'Mentions légales' : 'Legal Notice',
      subtitle: locale === 'fr' ? 'Informations légales sur l\'éditeur du site' : 'Legal information about the site publisher',
      sections
    };
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return null;
  }
}

// Tester avec le français
console.log('🇫🇷 Test avec le français:');
const frData = testMarkdownParser('fr');
if (frData) {
  console.log(`   Titre: ${frData.title}`);
  console.log(`   Sous-titre: ${frData.subtitle}`);
  console.log(`   Nombre de sections: ${frData.sections.length}`);
  
  frData.sections.forEach((section, index) => {
    console.log(`   Section ${index + 1}: ${section.title}`);
    console.log(`     Contenu: ${section.content.substring(0, 50)}...`);
    if (section.company) {
      console.log(`     Entreprise: ${section.company.name}`);
    }
  });
}

console.log('\n🇬🇧 Test avec l\'anglais:');
const enData = testMarkdownParser('en');
if (enData) {
  console.log(`   Titre: ${enData.title}`);
  console.log(`   Sous-titre: ${enData.subtitle}`);
  console.log(`   Nombre de sections: ${enData.sections.length}`);
  
  enData.sections.forEach((section, index) => {
    console.log(`   Section ${index + 1}: ${section.title}`);
    console.log(`     Contenu: ${section.content.substring(0, 50)}...`);
    if (section.company) {
      console.log(`     Entreprise: ${section.company.name}`);
    }
  });
}
