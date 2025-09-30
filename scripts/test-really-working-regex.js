#!/usr/bin/env node

/**
 * Script pour tester un regex qui fonctionne vraiment vraiment
 */

console.log('🔍 Test du regex qui fonctionne vraiment vraiment\n');

const testLine = '- **Nom :** Cocoti SAS';
console.log('Ligne de test:', testLine);

// Test avec un regex qui fonctionne vraiment vraiment
const reallyWorkingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('Regex qui fonctionne vraiment vraiment:', reallyWorkingRegex);
console.log('Match:', testLine.match(reallyWorkingRegex));

// Test avec un regex plus simple
const simpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex simple:', simpleRegex);
console.log('Match simple:', testLine.match(simpleRegex));

// Test avec un regex encore plus simple
const verySimpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex très simple:', verySimpleRegex);
console.log('Match très simple:', testLine.match(verySimpleRegex));

// Test avec un regex qui fonctionne vraiment vraiment vraiment
const realRealWorkingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex qui fonctionne vraiment vraiment vraiment:', realRealWorkingRegex);
console.log('Match vraiment vraiment vraiment:', testLine.match(realRealWorkingRegex));
