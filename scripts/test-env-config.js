#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration des variables d'environnement
 */

console.log('🔍 Test de la configuration des variables d\'environnement\n');

// Charger les variables d'environnement depuis .env.local
require('dotenv').config({ path: '.env.local' });

console.log('📋 Variables d\'environnement:');
console.log(`   LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH || 'NON DÉFINIE'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NON DÉFINIE'}\n`);

// Test de la fonction markdownReader
try {
  const { getLegalFilesConfig } = require('../src/utils/markdownReader.ts');
  const config = getLegalFilesConfig();
  
  console.log('📁 Configuration des fichiers légaux:');
  console.log(`   Chemin configuré: ${config.path}`);
  console.log(`   Chemin complet: ${config.fullPath}`);
  console.log(`   Fichier FR: ${config.frFile}`);
  console.log(`   Fichier EN: ${config.enFile}`);
  console.log(`   FR existe: ${config.frExists ? 'OUI' : 'NON'}`);
  console.log(`   EN existe: ${config.enExists ? 'OUI' : 'NON'}\n`);
  
  if (process.env.LEGAL_FILES_PATH === 'chemin_inexistant') {
    console.log('✅ Variable d\'environnement correctement lue !');
    console.log('⚠️  Le chemin est intentionnellement incorrect pour tester le fallback');
  } else {
    console.log('❌ La variable d\'environnement n\'est pas lue correctement');
  }
  
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message);
}
