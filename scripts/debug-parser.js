#!/usr/bin/env node

/**
 * Script de debug pour comprendre pourquoi le parser ne détecte pas les informations d'entreprise
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Debug du parser\n');

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
  
  console.log('📄 Contenu du fichier:');
  console.log(content);
  
  console.log('\n🔍 Analyse ligne par ligne:');
  const lines = content.split('\n');
  let currentSection = null;
  let companyInfo = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    console.log(`Ligne ${i + 1}: "${line}"`);
    
    // Section (###)
    if (line.startsWith('### ')) {
      currentSection = line.replace('### ', '');
      console.log(`  → Nouvelle section: "${currentSection}"`);
    }
    
    // Parser les informations de l'entreprise
    if (line.startsWith('- **')) {
      console.log(`  → Ligne d'entreprise détectée: "${line}"`);
      const match = line.match(/- \*\*([^*]+)\*\*: (.+)/);
      if (match) {
        const [, key, value] = match;
        const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
        console.log(`    → Clé: "${key}", Valeur: "${value}", Normalisée: "${normalizedKey}"`);
        
        if (normalizedKey === 'nom' || normalizedKey === 'name') {
          companyInfo.name = value;
          console.log(`    → Nom assigné: "${value}"`);
        }
        if (normalizedKey === 'adresse' || normalizedKey === 'address') {
          companyInfo.address = value;
          console.log(`    → Adresse assignée: "${value}"`);
        }
        if (normalizedKey === 'téléphone' || normalizedKey === 'phone') {
          companyInfo.phone = value;
          console.log(`    → Téléphone assigné: "${value}"`);
        }
        if (normalizedKey === 'email') {
          companyInfo.email = value;
          console.log(`    → Email assigné: "${value}"`);
        }
      }
    }
  }
  
  console.log('\n📋 Informations d\'entreprise finales:');
  console.log(JSON.stringify(companyInfo, null, 2));
  
} else {
  console.log(`❌ Fichier non trouvé: ${frPath}`);
}
