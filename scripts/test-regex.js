#!/usr/bin/env node

/**
 * Script pour tester le regex d'extraction des informations d'entreprise
 */

console.log('🔍 Test du regex\n');

const testLines = [
  '- **Nom :** Cocoti SAS',
  '- **Adresse :** 123 Avenue de la République, 75011 Paris, France',
  '- **Téléphone :** +33 1 23 45 67 89',
  '- **Email :** contact@cocoti.com'
];

const regex1 = /- \*\*([^*]+)\*\*: (.+)/;
const regex2 = /- \*\*([^*]+)\*\*: (.+)/;
const regex3 = /- \*\*([^*]+)\*\*: (.+)/;

console.log('Regex 1:', regex1);
console.log('Regex 2:', regex2);
console.log('Regex 3:', regex3);

// Test avec une ligne simple
const testLine = '- **Nom :** Cocoti SAS';
console.log('\nTest avec une ligne simple:');
console.log('Ligne:', testLine);
console.log('Regex 1 match:', testLine.match(regex1));
console.log('Regex 2 match:', testLine.match(regex2));
console.log('Regex 3 match:', testLine.match(regex3));

testLines.forEach((line, index) => {
  console.log(`Ligne ${index + 1}: "${line}"`);
  
  const match = line.match(regex);
  if (match) {
    const [, key, value] = match;
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
    console.log(`  ✅ Match trouvé:`);
    console.log(`    Clé: "${key}"`);
    console.log(`    Valeur: "${value}"`);
    console.log(`    Clé normalisée: "${normalizedKey}"`);
    
    // Test des conditions
    if (normalizedKey === 'nom' || normalizedKey === 'name') {
      console.log(`    → Nom détecté: "${value}"`);
    }
    if (normalizedKey === 'adresse' || normalizedKey === 'address') {
      console.log(`    → Adresse détectée: "${value}"`);
    }
    if (normalizedKey === 'téléphone' || normalizedKey === 'phone') {
      console.log(`    → Téléphone détecté: "${value}"`);
    }
    if (normalizedKey === 'email') {
      console.log(`    → Email détecté: "${value}"`);
    }
  } else {
    console.log(`  ❌ Pas de match`);
  }
  console.log('');
});
