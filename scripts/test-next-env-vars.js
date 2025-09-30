#!/usr/bin/env node

/**
 * Script pour tester si Next.js lit les variables d'environnement
 */

console.log('🔍 Test des variables d\'environnement Next.js\n');

// Lire le fichier .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  console.log('📄 Contenu du fichier .env.local:');
  console.log(content);
  
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      process.env[key.trim()] = value.trim();
    }
  });
}

console.log('\n📋 Variables d\'environnement:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH || 'NON DÉFINIE'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NON DÉFINIE'}`);

console.log('\n💡 Instructions pour tester:');
console.log('1. Modifiez LEGAL_FILES_PATH dans .env.local');
console.log('2. Redémarrez le serveur Next.js (npm run dev)');
console.log('3. Visitez /fr/legal-notice');
console.log('4. Vérifiez les logs dans la console du serveur');
console.log('5. Si vous voyez des messages d\'avertissement, c\'est que la variable fonctionne');

console.log('\n🔧 Test de la logique:');
const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
console.log(`   Chemin utilisé: ${legalFilesPath}`);

if (legalFilesPath === 'chemin_inexistant') {
  console.log('✅ Variable d\'environnement lue correctement');
  console.log('⚠️  Avec ce chemin, la page devrait utiliser le fallback');
} else {
  console.log('❌ Variable d\'environnement non lue ou valeur incorrecte');
}
