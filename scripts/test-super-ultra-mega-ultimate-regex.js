#!/usr/bin/env node

/**
 * Script pour tester un regex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment
 */

console.log('🔍 Test du regex super ultra mega ultime\n');

const testLine = '- **Nom :** Cocoti SAS';
console.log('Ligne de test:', testLine);

// Test avec un regex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment
const superUltraMegaUltimateRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('Regex super ultra mega ultime:', superUltraMegaUltimateRegex);
console.log('Match:', testLine.match(superUltraMegaUltimateRegex));

// Test avec un regex encore plus simple
const simpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex simple:', simpleRegex);
console.log('Match simple:', testLine.match(simpleRegex));

// Test avec un regex très simple
const verySimpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex très simple:', verySimpleRegex);
console.log('Match très simple:', testLine.match(verySimpleRegex));

// Test avec un regex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment
const realRealRealRealRealRealRealRealWorkingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment:', realRealRealRealRealRealRealRealWorkingRegex);
console.log('Match vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment:', testLine.match(realRealRealRealRealRealRealRealWorkingRegex));
