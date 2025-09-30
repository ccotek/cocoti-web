#!/usr/bin/env node

/**
 * Script de test pour vérifier que la page legal-notice utilise la variable d'environnement
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test de la configuration legal-notice avec variable d\'environnement\n');

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

console.log('📋 Variable d\'environnement définie:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH}\n`);

// Test de la fonction markdownReader
try {
  // Simuler l'import du module
  const markdownReaderPath = path.join(__dirname, '..', 'src', 'utils', 'markdownReader.ts');
  
  if (fs.existsSync(markdownReaderPath)) {
    console.log('✅ Fichier markdownReader.ts trouvé');
    
    // Lire le contenu pour vérifier la logique
    const content = fs.readFileSync(markdownReaderPath, 'utf-8');
    
    if (content.includes('process.env.LEGAL_FILES_PATH')) {
      console.log('✅ La fonction utilise bien process.env.LEGAL_FILES_PATH');
    } else {
      console.log('❌ La fonction n\'utilise pas process.env.LEGAL_FILES_PATH');
    }
    
    if (content.includes('|| \'_resources/legal\'')) {
      console.log('✅ Fallback vers _resources/legal configuré');
    } else {
      console.log('❌ Fallback non configuré');
    }
    
    console.log('\n📁 Test des chemins:');
    const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
    console.log(`   Chemin configuré: ${legalFilesPath}`);
    
    const frPath = path.join(process.cwd(), legalFilesPath, 'fr', 'legal-notice.md');
    const enPath = path.join(process.cwd(), legalFilesPath, 'en', 'legal-notice.md');
    
    console.log(`   Fichier FR: ${frPath}`);
    console.log(`   Fichier EN: ${enPath}`);
    console.log(`   FR existe: ${fs.existsSync(frPath) ? 'OUI' : 'NON'}`);
    console.log(`   EN existe: ${fs.existsSync(enPath) ? 'OUI' : 'NON'}`);
    
    if (!fs.existsSync(frPath) && !fs.existsSync(enPath)) {
      console.log('\n⚠️  Aucun fichier trouvé - le système devrait utiliser le fallback');
    }
    
  } else {
    console.log('❌ Fichier markdownReader.ts non trouvé');
  }
  
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message);
}
