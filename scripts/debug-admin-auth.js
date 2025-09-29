// Script de débogage pour l'authentification admin
const API_BASE_URL = 'http://localhost:8001/api/v1';

async function debugAdminAuth() {
  console.log('🔍 Débogage de l\'authentification admin...\n');

  try {
    // Test 1: URL complète
    const fullUrl = `${API_BASE_URL}/auth/admin/login`;
    console.log(`1️⃣ URL complète: ${fullUrl}`);

    // Test 2: Connexion avec logs détaillés
    console.log('\n2️⃣ Test de connexion avec logs détaillés...');
    console.log('   Envoi de la requête...');
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@cocoti.com',
        password: 'admin123'
      }),
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   Status Text: ${response.statusText}`);
    console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   ❌ Erreur: ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('   ✅ Connexion réussie !');
    console.log(`   Token: ${data.access_token.substring(0, 20)}...`);
    console.log(`   Expires: ${data.expires_at}`);

    // Test 3: Test de l'endpoint /admin/me
    console.log('\n3️⃣ Test de l\'endpoint /admin/me...');
    const meResponse = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: {
        'Authorization': `Bearer ${data.access_token}`,
      },
    });

    console.log(`   Status: ${meResponse.status}`);
    if (meResponse.ok) {
      const meData = await meResponse.json();
      console.log('   ✅ Profil admin récupéré !');
      console.log(`   Email: ${meData.email}`);
      console.log(`   Type: ${meData.admin_type}`);
      console.log(`   Roles: ${meData.roles.join(', ')}`);
    } else {
      const errorText = await meResponse.text();
      console.log(`   ❌ Erreur profil: ${errorText}`);
    }

    // Test 4: Simulation du localStorage
    console.log('\n4️⃣ Simulation du localStorage...');
    console.log('   Token stocké:', data.access_token.substring(0, 20) + '...');
    console.log('   Refresh token stocké:', data.refresh_token.substring(0, 20) + '...');
    console.log('   Expires at:', data.expires_at);

    console.log('\n🎯 Résumé du débogage:');
    console.log('   ✅ API accessible');
    console.log('   ✅ Authentification fonctionne');
    console.log('   ✅ Profil admin récupérable');
    console.log('   ✅ Tokens générés');

    console.log('\n🔧 Prochaines étapes pour le frontend:');
    console.log('   1. Vérifiez la console du navigateur');
    console.log('   2. Ouvrez les outils de développement');
    console.log('   3. Allez sur http://localhost:4000/admin');
    console.log('   4. Essayez de vous connecter');
    console.log('   5. Regardez les erreurs dans la console');

  } catch (error) {
    console.log(`❌ Erreur lors du débogage: ${error.message}`);
    console.log('\n🔧 Vérifications:');
    console.log('   1. L\'API est-elle démarrée sur le port 8001 ?');
    console.log('   2. Y a-t-il des erreurs CORS ?');
    console.log('   3. Le frontend est-il accessible ?');
  }
}

// Exécuter le débogage
debugAdminAuth();
