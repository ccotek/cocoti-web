#!/usr/bin/env node

/**
 * Script pour tester un regex qui fonctionne vraiment
 */

console.log('🔍 Test du regex qui fonctionne vraiment\n');

const testLine = '- **Nom :** Cocoti SAS';
console.log('Ligne de test:', testLine);

// Test avec un regex qui fonctionne vraiment
const workingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('Regex qui fonctionne:', workingRegex);
console.log('Match:', testLine.match(workingRegex));

// Test avec un regex plus simple
const simpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex simple:', simpleRegex);
console.log('Match simple:', testLine.match(simpleRegex));

// Test avec un regex encore plus simple
const verySimpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex très simple:', verySimpleRegex);
console.log('Match très simple:', testLine.match(verySimpleRegex));

// Test avec un regex qui fonctionne vraiment vraiment
const realWorkingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex qui fonctionne vraiment:', realWorkingRegex);
console.log('Match vraiment:', testLine.match(realWorkingRegex));
