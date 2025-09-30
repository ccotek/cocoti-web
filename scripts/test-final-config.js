#!/usr/bin/env node

/**
 * Script de test final pour vérifier la configuration complète
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Test final de la configuration legal-notice\n');

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

console.log('📋 Configuration actuelle:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH}\n`);

// Test des chemins
const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
const frPath = path.join(process.cwd(), legalFilesPath, 'fr', 'legal-notice.md');
const enPath = path.join(process.cwd(), legalFilesPath, 'en', 'legal-notice.md');

console.log('📁 Fichiers recherchés:');
console.log(`   FR: ${frPath}`);
console.log(`   EN: ${enPath}\n`);

console.log('✅ Vérification des fichiers:');
console.log(`   FR existe: ${fs.existsSync(frPath) ? 'OUI' : 'NON'}`);
console.log(`   EN existe: ${fs.existsSync(enPath) ? 'OUI' : 'NON'}\n`);

if (fs.existsSync(frPath) && fs.existsSync(enPath)) {
  console.log('🎉 Configuration parfaite !');
  console.log('📝 Prochaines étapes:');
  console.log('   1. Redémarrez le serveur Next.js (npm run dev)');
  console.log('   2. Visitez /fr/legal-notice ou /en/legal-notice');
  console.log('   3. La page devrait lire les fichiers Markdown');
} else {
  console.log('❌ Configuration incomplète');
  console.log('💡 Vérifiez que les fichiers existent aux emplacements indiqués');
}
