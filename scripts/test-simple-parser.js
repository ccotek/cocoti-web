#!/usr/bin/env node

/**
 * Script de test simple pour vérifier le parser Markdown
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Test simple du parser Markdown\n');

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

// Lire le fichier Markdown français
const legalFilesPath = process.env.LEGAL_FILES_PATH || '_resources/legal';
const frPath = path.join(process.cwd(), legalFilesPath, 'fr', 'legal-notice.md');

if (fs.existsSync(frPath)) {
  const content = fs.readFileSync(frPath, 'utf-8');
  console.log('📄 Contenu du fichier français:');
  console.log(content);
  
  console.log('\n🔍 Analyse des lignes:');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.trim()) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
  
  console.log('\n🧪 Test de détection des informations d\'entreprise:');
  let companyInfo = {};
  lines.forEach(line => {
    if (line.startsWith('- **')) {
      const match = line.match(/- \*\*([^*]+)\*\*: (.+)/);
      if (match) {
        const [, key, value] = match;
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        console.log(`   Détecté: ${key} = ${value} (${normalizedKey})`);
        
        if (normalizedKey === 'nom' || normalizedKey === 'name') companyInfo.name = value;
        if (normalizedKey === 'adresse' || normalizedKey === 'address') companyInfo.address = value;
        if (normalizedKey === 'téléphone' || normalizedKey === 'phone') companyInfo.phone = value;
        if (normalizedKey === 'email') companyInfo.email = value;
      }
    }
  });
  
  console.log('\n📋 Informations d\'entreprise extraites:');
  console.log(companyInfo);
  
} else {
  console.log(`❌ Fichier non trouvé: ${frPath}`);
}
