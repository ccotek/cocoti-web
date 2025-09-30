#!/usr/bin/env node

/**
 * Script de test simple pour vérifier les variables d'environnement
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test simple de la configuration\n');

// Lire le fichier .env.local manuellement
const envPath = path.join(__dirname, '..', '.env.local');
console.log(`📁 Chemin du fichier .env.local: ${envPath}`);

if (fs.existsSync(envPath)) {
  console.log('✅ Fichier .env.local trouvé');
  
  const content = fs.readFileSync(envPath, 'utf-8');
  console.log('📄 Contenu du fichier:');
  console.log(content);
  
  // Parser manuellement
  const lines = content.split('\n');
  const envVars = {};
  
  lines.forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      envVars[key.trim()] = value.trim();
    }
  });
  
  console.log('\n🔧 Variables parsées:');
  console.log(envVars);
  
  if (envVars.LEGAL_FILES_PATH) {
    console.log(`\n✅ LEGAL_FILES_PATH trouvée: ${envVars.LEGAL_FILES_PATH}`);
    
    // Test du chemin
    const testPath = path.join(__dirname, '..', envVars.LEGAL_FILES_PATH);
    console.log(`📁 Chemin testé: ${testPath}`);
    console.log(`📁 Existe: ${fs.existsSync(testPath) ? 'OUI' : 'NON'}`);
  } else {
    console.log('\n❌ LEGAL_FILES_PATH non trouvée dans le fichier');
  }
  
} else {
  console.log('❌ Fichier .env.local non trouvé');
}
