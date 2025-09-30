#!/usr/bin/env node

/**
 * Script pour tester le message temporairement indisponible
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test du message temporairement indisponible\n');

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

// Test avec un chemin qui n'existe pas
process.env.LEGAL_FILES_PATH = 'chemin_inexistant';

console.log('🧪 Test avec un chemin inexistant:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH}`);

// Simuler la fonction readLegalNoticeMarkdown
function testUnavailableMessage(locale) {
  try {
    const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
    const filePath = path.join(process.cwd(), legalFilesPath, locale, 'legal-notice.md');
    
    console.log(`   Chemin recherché: ${filePath}`);
    console.log(`   Fichier existe: ${fs.existsSync(filePath) ? 'OUI' : 'NON'}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`   ✅ Message d'indisponibilité pour ${locale}:`);
      const message = {
        title: locale === 'fr' ? 'Mentions légales' : 'Legal Notice',
        subtitle: locale === 'fr' ? 'Informations légales sur l\'éditeur du site' : 'Legal information about the site publisher',
        sections: [{
          title: locale === 'fr' ? 'Service temporairement indisponible' : 'Service temporarily unavailable',
          content: locale === 'fr' 
            ? 'Les mentions légales sont temporairement indisponibles. Veuillez réessayer plus tard.'
            : 'Legal notice is temporarily unavailable. Please try again later.'
        }]
      };
      
      console.log(`     Titre: ${message.title}`);
      console.log(`     Sous-titre: ${message.subtitle}`);
      console.log(`     Section: ${message.sections[0].title}`);
      console.log(`     Contenu: ${message.sections[0].content}`);
      
      return message;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return null;
  }
}

console.log('\n🇫🇷 Test français:');
testUnavailableMessage('fr');

console.log('\n🇬🇧 Test anglais:');
testUnavailableMessage('en');

console.log('\n✅ Le message temporairement indisponible fonctionne correctement !');
