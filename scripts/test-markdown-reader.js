#!/usr/bin/env node

/**
 * Script pour tester directement la fonction readLegalNoticeMarkdown
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test direct de la fonction readLegalNoticeMarkdown\n');

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

console.log('📋 Variable d\'environnement:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH}\n`);

// Simuler la logique de readLegalNoticeMarkdown
try {
  const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
  const frPath = path.join(process.cwd(), legalFilesPath, 'fr', 'legal-notice.md');
  const enPath = path.join(process.cwd(), legalFilesPath, 'en', 'legal-notice.md');
  
  console.log('📁 Chemins testés:');
  console.log(`   FR: ${frPath}`);
  console.log(`   EN: ${enPath}\n`);
  
  console.log('✅ Existence des fichiers:');
  console.log(`   FR existe: ${fs.existsSync(frPath) ? 'OUI' : 'NON'}`);
  console.log(`   EN existe: ${fs.existsSync(enPath) ? 'OUI' : 'NON'}\n`);
  
  if (!fs.existsSync(frPath) && !fs.existsSync(enPath)) {
    console.log('⚠️  Aucun fichier trouvé - le système devrait utiliser le fallback');
    console.log('📝 Cela signifie que la page devrait afficher les données par défaut');
    console.log('   (pas les fichiers Markdown)');
  } else {
    console.log('✅ Fichiers trouvés - le système devrait lire les fichiers Markdown');
  }
  
  // Test avec un chemin qui existe
  console.log('\n🧪 Test avec le bon chemin:');
  const correctPath = '../_resources/legal';
  const correctFrPath = path.join(process.cwd(), correctPath, 'fr', 'legal-notice.md');
  const correctEnPath = path.join(process.cwd(), correctPath, 'en', 'legal-notice.md');
  
  console.log(`   FR: ${correctFrPath}`);
  console.log(`   EN: ${correctEnPath}`);
  console.log(`   FR existe: ${fs.existsSync(correctFrPath) ? 'OUI' : 'NON'}`);
  console.log(`   EN existe: ${fs.existsSync(correctEnPath) ? 'OUI' : 'NON'}`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
