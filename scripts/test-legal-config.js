#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration des fichiers légaux
 */

const { getLegalFilesConfig } = require('../src/utils/markdownReader.ts');

console.log('🔍 Test de la configuration des fichiers légaux\n');

try {
  const config = getLegalFilesConfig();
  
  console.log('📋 Configuration actuelle:');
  console.log(`   Chemin configuré: ${config.path}`);
  console.log(`   Chemin complet: ${config.fullPath}`);
  console.log(`   Variable LEGAL_FILES_PATH: ${process.env.LEGAL_FILES_PATH || 'non définie (utilise le défaut)'}\n`);
  
  console.log('📁 Fichiers recherchés:');
  console.log(`   🇫🇷 Français: ${config.frFile}`);
  console.log(`   ✅ Existe: ${config.frExists ? 'OUI' : 'NON'}`);
  console.log(`   🇬🇧 Anglais: ${config.enFile}`);
  console.log(`   ✅ Existe: ${config.enExists ? 'OUI' : 'NON'}\n`);
  
  if (config.frExists && config.enExists) {
    console.log('✅ Configuration valide - Tous les fichiers sont présents');
  } else {
    console.log('⚠️  Configuration incomplète - Certains fichiers manquent');
    console.log('\n💡 Pour corriger:');
    console.log('   1. Vérifiez que les fichiers existent aux emplacements indiqués');
    console.log('   2. Ou modifiez la variable LEGAL_FILES_PATH dans votre .env.local');
    console.log('   3. Ou créez les fichiers manquants');
  }
  
} catch (error) {
  console.error('❌ Erreur lors du test de configuration:', error.message);
}
