#!/usr/bin/env node

/**
 * Script pour tester un regex qui fonctionne vraiment vraiment
 */

console.log('🔍 Test du regex final\n');

const testLine = '- **Nom :** Cocoti SAS';
console.log('Ligne de test:', testLine);

// Test avec un regex qui fonctionne vraiment vraiment
const finalRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('Regex final:', finalRegex);
console.log('Match:', testLine.match(finalRegex));

// Test avec un regex encore plus simple
const simpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex simple:', simpleRegex);
console.log('Match simple:', testLine.match(simpleRegex));

// Test avec un regex très simple
const verySimpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex très simple:', verySimpleRegex);
console.log('Match très simple:', testLine.match(verySimpleRegex));

// Test avec un regex qui fonctionne vraiment vraiment
const realRealRealWorkingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex qui fonctionne vraiment vraiment vraiment:', realRealRealWorkingRegex);
console.log('Match vraiment vraiment vraiment:', testLine.match(realRealRealWorkingRegex));
