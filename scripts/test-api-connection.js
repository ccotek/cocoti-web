// Test de connexion à l'API depuis le frontend
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testApiConnection() {
  console.log('🔗 Test de connexion à l\'API...\n');

  try {
    // Test 1: Vérifier que l'API répond
    console.log('1️⃣ Test de base de l\'API...');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@cocoti.com',
          password: 'admin123'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API accessible et authentification fonctionne !');
        console.log(`   Token: ${data.access_token.substring(0, 20)}...`);
        console.log(`   Expires: ${data.expires_at}`);
      } else {
        console.log(`❌ Erreur API: ${response.status} - ${response.statusText}`);
        const errorText = await response.text();
        console.log(`   Détails: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Erreur de connexion: ${error.message}`);
      console.log('\n🔧 Vérifications:');
      console.log('   1. L\'API est-elle démarrée ? (python -m uvicorn app.main:app --reload --port 8000)');
      console.log('   2. L\'API est-elle accessible sur http://localhost:8000 ?');
      console.log('   3. Y a-t-il des erreurs CORS ?');
    }

    // Test 2: Test de l'endpoint /admin/me
    console.log('\n2️⃣ Test de l\'endpoint /admin/me...');
    try {
      // D'abord, obtenir un token
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

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        
        // Tester /admin/me
        const meResponse = await fetch(`${API_BASE_URL}/admin/me`, {
          headers: {
            'Authorization': `Bearer ${loginData.access_token}`,
          },
        });

        if (meResponse.ok) {
          const meData = await meResponse.json();
          console.log('✅ Endpoint /admin/me fonctionne !');
          console.log(`   Email: ${meData.email}`);
          console.log(`   Type: ${meData.admin_type}`);
        } else {
          console.log(`❌ Erreur /admin/me: ${meResponse.status} - ${meResponse.statusText}`);
        }
      }
    } catch (error) {
      console.log(`❌ Erreur /admin/me: ${error.message}`);
    }

    console.log('\n📝 Instructions pour le frontend:');
    console.log('   1. Ouvrez http://localhost:4000/admin');
    console.log('   2. Connectez-vous avec admin@cocoti.com / admin123');
    console.log('   3. Vérifiez la console du navigateur pour les erreurs');

  } catch (error) {
    console.log(`❌ Erreur générale: ${error.message}`);
  }
}

// Exécuter le test
testApiConnection();
