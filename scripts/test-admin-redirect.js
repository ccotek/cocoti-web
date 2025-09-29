// Test de redirection admin
const API_BASE_URL = 'http://localhost:8001/api/v1';
const FRONTEND_URL = 'http://localhost:4000';

async function testAdminRedirect() {
  console.log('🔄 Test de redirection admin...\n');

  try {
    // Test 1: Connexion admin
    console.log('1️⃣ Test de connexion admin...');
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
      console.log(`❌ Erreur de connexion: ${loginResponse.status}`);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Connexion admin réussie !');
    console.log(`   Token: ${loginData.access_token.substring(0, 20)}...`);

    // Test 2: Vérification du profil admin
    console.log('\n2️⃣ Test du profil admin...');
    const profileResponse = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      console.log(`❌ Erreur profil: ${profileResponse.status}`);
      return;
    }

    const profileData = await profileResponse.json();
    console.log('✅ Profil admin récupéré !');
    console.log(`   Email: ${profileData.email}`);
    console.log(`   Type: ${profileData.admin_type}`);

    // Test 3: Interface frontend
    console.log('\n3️⃣ Test de l\'interface frontend...');
    try {
      const frontendResponse = await fetch(`${FRONTEND_URL}/admin`);
      if (frontendResponse.ok) {
        console.log('✅ Interface admin accessible !');
        console.log(`   URL: ${FRONTEND_URL}/admin`);
      } else {
        console.log(`❌ Interface admin non accessible: ${frontendResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Erreur interface: ${error.message}`);
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📝 Instructions pour tester la redirection:');
    console.log('   1. Ouvrez http://localhost:4000/admin');
    console.log('   2. Connectez-vous avec:');
    console.log('      Email: admin@cocoti.com');
    console.log('      Mot de passe: admin123');
    console.log('   3. Vous devriez être redirigé vers le dashboard admin');

  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Exécuter le test
testAdminRedirect();
