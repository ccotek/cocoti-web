#!/usr/bin/env node

/**
 * Script pour tester la configuration Next.js avec variables d'environnement
 */

console.log('🔍 Test de la configuration Next.js\n');

console.log('📋 Instructions pour tester:');
console.log('1. Modifiez LEGAL_FILES_PATH dans .env.local');
console.log('2. Redémarrez le serveur Next.js (npm run dev)');
console.log('3. Visitez /fr/legal-notice ou /en/legal-notice');
console.log('4. Vérifiez les logs dans la console du serveur\n');

console.log('🔧 Configuration actuelle:');
console.log('   Fichier .env.local:');
try {
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    console.log(content);
  } else {
    console.log('   ❌ Fichier .env.local non trouvé');
  }
} catch (error) {
  console.log('   ❌ Erreur:', error.message);
}

console.log('\n💡 Pour tester:');
console.log('   - Changez LEGAL_FILES_PATH=chemin_inexistant');
console.log('   - Redémarrez le serveur');
console.log('   - La page devrait utiliser le fallback');
console.log('   - Changez LEGAL_FILES_PATH=_resources/legal');
console.log('   - Redémarrez le serveur');
console.log('   - La page devrait lire les fichiers Markdown');
