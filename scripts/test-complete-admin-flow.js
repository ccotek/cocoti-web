// Script de test complet pour le flux admin
const API_BASE_URL = 'http://localhost:8000/api/v1';
const FRONTEND_URL = 'http://localhost:4000';

async function testCompleteAdminFlow() {
  console.log('🔐 Test complet du flux admin...\n');

  try {
    // Test 1: Connexion admin via l'API
    console.log('1️⃣ Test de connexion admin via l\'API...');
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
      console.log(`❌ Erreur de connexion API: ${errorData.detail || loginResponse.statusText}`);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Connexion API réussie !');
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
    console.log(`   Type: ${profileData.admin_type || 'N/A'}`);
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
      return;
    }

    // Test 4: Test de l'interface frontend
    console.log('\n4️⃣ Test de l\'interface frontend...');
    try {
      const frontendResponse = await fetch(`${FRONTEND_URL}/admin`);
      if (frontendResponse.ok) {
        console.log('✅ Interface admin accessible !');
        console.log(`   URL: ${FRONTEND_URL}/admin`);
      } else {
        console.log(`❌ Interface admin non accessible: ${frontendResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Erreur interface frontend: ${error.message}`);
    }

    console.log('\n🎉 Tests du flux admin terminés avec succès !');
    console.log('\n📝 Instructions pour utiliser l\'interface admin:');
    console.log('   1. Ouvrez votre navigateur');
    console.log('   2. Allez sur http://localhost:4000/admin');
    console.log('   3. Connectez-vous avec:');
    console.log('      Email: admin@cocoti.com');
    console.log('      Mot de passe: admin123');
    console.log('   4. Vous devriez accéder au dashboard admin');

  } catch (error) {
    console.log(`❌ Erreur lors du test: ${error.message}`);
    console.log('\n🔧 Vérifications à effectuer:');
    console.log('   1. L\'API est-elle démarrée ? (http://localhost:8000)');
    console.log('   2. Le frontend est-il démarré ? (http://localhost:4000)');
    console.log('   3. L\'utilisateur admin existe-t-il dans la base de données ?');
  }
}

// Exécuter le test
testCompleteAdminFlow();
