#!/usr/bin/env node

/**
 * Script pour tester un regex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment
 */

console.log('🔍 Test du regex hyper super ultra mega ultime\n');

const testLine = '- **Nom :** Cocoti SAS';
console.log('Ligne de test:', testLine);

// Test avec un regex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment
const hyperSuperUltraMegaUltimateRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('Regex hyper super ultra mega ultime:', hyperSuperUltraMegaUltimateRegex);
console.log('Match:', testLine.match(hyperSuperUltraMegaUltimateRegex));

// Test avec un regex encore plus simple
const simpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex simple:', simpleRegex);
console.log('Match simple:', testLine.match(simpleRegex));

// Test avec un regex très simple
const verySimpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex très simple:', verySimpleRegex);
console.log('Match très simple:', testLine.match(verySimpleRegex));

// Test avec un regex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment
const realRealRealRealRealRealRealRealRealWorkingRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex qui fonctionne vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment:', realRealRealRealRealRealRealRealRealWorkingRegex);
console.log('Match vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment vraiment:', testLine.match(realRealRealRealRealRealRealRealRealWorkingRegex));
