// Script de test pour l'authentification admin
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testAdminAuth() {
  console.log('🔐 Test d\'authentification admin...\n');

  // Test 1: Connexion avec des identifiants valides
  console.log('1️⃣ Test de connexion admin...');
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@cocoti.com',
        password: 'admin123'
      }),
    });

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json().catch(() => ({}));
      console.log(`❌ Erreur de connexion: ${errorData.detail || loginResponse.statusText}`);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Connexion réussie !');
    console.log(`   Token: ${loginData.access_token.substring(0, 20)}...`);
    console.log(`   Expires: ${loginData.expires_at}`);

    // Test 2: Vérification du profil admin
    console.log('\n2️⃣ Test de récupération du profil admin...');
    const profileResponse = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      console.log(`❌ Erreur de récupération du profil: ${profileResponse.statusText}`);
      return;
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profil admin récupéré !');
    console.log(`   Email: ${profileData.email}`);
    console.log(`   Admin Type: ${profileData.admin_type || 'N/A'}`);
    console.log(`   Roles: ${profileData.roles ? profileData.roles.join(', ') : 'N/A'}`);

    // Test 3: Vérification des permissions
    console.log('\n3️⃣ Test de vérification des permissions...');
    const authorizedTypes = ['super_admin', 'admin', 'marketing_admin'];
    const hasAuthorizedType = profileData.admin_type && authorizedTypes.includes(profileData.admin_type);
    
    const authorizedRoles = ['super_admin', 'admin'];
    const hasAuthorizedRole = profileData.roles && profileData.roles.some(role => authorizedRoles.includes(role));
    
    if (hasAuthorizedType || hasAuthorizedRole) {
      console.log('✅ Permissions admin confirmées !');
      console.log(`   Type autorisé: ${hasAuthorizedType ? 'Oui' : 'Non'}`);
      console.log(`   Rôle autorisé: ${hasAuthorizedRole ? 'Oui' : 'Non'}`);
    } else {
      console.log('❌ Permissions insuffisantes !');
      console.log(`   Type: ${profileData.admin_type || 'N/A'}`);
      console.log(`   Rôles: ${profileData.roles ? profileData.roles.join(', ') : 'N/A'}`);
    }

    console.log('\n🎉 Tests d\'authentification admin terminés !');
    console.log('\n📝 Instructions pour l\'interface admin:');
    console.log('   1. Assurez-vous que l\'API est démarrée (uvicorn app.main:application --reload --port 8000)');
    console.log('   2. Allez sur http://localhost:4000/admin');
    console.log('   3. Connectez-vous avec les identifiants de test');
    console.log('   4. Vérifiez que le dashboard admin s\'affiche correctement');

  } catch (error) {
    console.log(`❌ Erreur lors du test: ${error.message}`);
    console.log('\n🔧 Vérifications à effectuer:');
    console.log('   1. L\'API est-elle démarrée ? (http://localhost:8000)');
    console.log('   2. L\'utilisateur admin existe-t-il dans la base de données ?');
    console.log('   3. Les identifiants sont-ils corrects ?');
  }
}

// Exécuter le test
testAdminAuth();
