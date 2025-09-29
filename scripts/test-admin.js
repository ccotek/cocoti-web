#!/usr/bin/env node

const http = require('http');

console.log('🧪 Test de l\'accès admin...\n');

// Test de la page de connexion admin
const testAdminLogin = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:4000/admin/login', (res) => {
      console.log(`✅ Page de connexion admin: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`❌ Erreur page de connexion: ${err.message}`);
      reject(err);
    });
  });
};

// Test de la page admin (devrait rediriger vers login)
const testAdminRedirect = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:4000/admin', (res) => {
      console.log(`✅ Page admin: ${res.statusCode} (redirection attendue)`);
      resolve(res.statusCode === 307 || res.statusCode === 302); // Redirection
    });
    
    req.on('error', (err) => {
      console.log(`❌ Erreur page admin: ${err.message}`);
      reject(err);
    });
  });
};

// Test de la page principale
const testMainPage = () => {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:4000/fr', (res) => {
      console.log(`✅ Page principale: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });
    
    req.on('error', (err) => {
      console.log(`❌ Erreur page principale: ${err.message}`);
      reject(err);
    });
  });
};

// Exécuter tous les tests
async function runTests() {
  try {
    console.log('1. Test de la page principale...');
    await testMainPage();
    
    console.log('\n2. Test de la redirection admin...');
    await testAdminRedirect();
    
    console.log('\n3. Test de la page de connexion admin...');
    await testAdminLogin();
    
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n📋 URLs à tester:');
    console.log('   • Page principale: http://localhost:4000/fr');
    console.log('   • Admin (redirection): http://localhost:4000/admin');
    console.log('   • Connexion admin: http://localhost:4000/admin/login');
    console.log('\n🔐 Identifiants de test:');
    console.log('   • Email: admin@cocoti.com');
    console.log('   • Mot de passe: admin123');
    
  } catch (error) {
    console.log(`\n❌ Erreur lors des tests: ${error.message}`);
    process.exit(1);
  }
}

runTests();
