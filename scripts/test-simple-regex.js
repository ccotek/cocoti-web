#!/usr/bin/env node

/**
 * Script pour tester un regex simple
 */

console.log('🔍 Test du regex simple\n');

const testLine = '- **Nom :** Cocoti SAS';
console.log('Ligne de test:', testLine);

// Test avec différents regex
const regex1 = /- \*\*([^*]+)\*\*: (.+)/;
const regex2 = /- \*\*([^*]+)\*\*: (.+)/;
const regex3 = /- \*\*([^*]+)\*\*: (.+)/;

console.log('\nTest des regex:');
console.log('Regex 1:', regex1);
console.log('Regex 2:', regex2);
console.log('Regex 3:', regex3);

console.log('\nRésultats:');
console.log('Regex 1 match:', testLine.match(regex1));
console.log('Regex 2 match:', testLine.match(regex2));
console.log('Regex 3 match:', testLine.match(regex3));

// Test avec un regex plus simple
const simpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex simple:', simpleRegex);
console.log('Match simple:', testLine.match(simpleRegex));

// Test avec un regex encore plus simple
const verySimpleRegex = /- \*\*([^*]+)\*\*: (.+)/;
console.log('\nRegex très simple:', verySimpleRegex);
console.log('Match très simple:', testLine.match(verySimpleRegex));
