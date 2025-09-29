// Script pour créer un admin de test
const API_BASE_URL = 'http://localhost:8000/api/v1';

async function createTestAdmin() {
  console.log('👤 Création d\'un admin de test...\n');

  try {
    // D'abord, essayons de nous connecter avec un super_admin existant
    // Si ça ne marche pas, on créera un admin directement
    console.log('1️⃣ Tentative de connexion avec un super_admin existant...');
    
    let adminToken = null;
    try {
      const loginResponse = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'superadmin@cocoti.com',
          password: 'superadmin123'
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        adminToken = loginData.access_token;
        console.log('✅ Connexion réussie avec super_admin existant');
      }
    } catch (error) {
      console.log('❌ Pas de super_admin existant, création d\'un admin de test...');
    }

    // Si on n'a pas de token, on va créer un admin directement dans la base
    if (!adminToken) {
      console.log('\n2️⃣ Création directe d\'un admin de test...');
      console.log('⚠️  Note: Cette méthode nécessite un accès direct à la base de données');
      console.log('   ou un super_admin existant pour créer d\'autres admins.');
      
      console.log('\n📝 Instructions pour créer un admin manuellement:');
      console.log('   1. Connectez-vous à MongoDB');
      console.log('   2. Insérez un document dans la collection "users":');
      console.log('   {');
      console.log('     "email": "admin@cocoti.com",');
      console.log('     "password_hash": "$2b$12$...", // Hash du mot de passe "admin123"');
      console.log('     "roles": ["admin"],');
      console.log('     "admin_type": "admin",');
      console.log('     "first_name": "Admin",');
      console.log('     "last_name": "Cocoti",');
      console.log('     "phone_number": "+221701234567",');
      console.log('     "is_verified": true,');
      console.log('     "is_active": true,');
      console.log('     "must_change_password": false,');
      console.log('     "created_at": new Date(),');
      console.log('     "updated_at": new Date()');
      console.log('   }');
      
      console.log('\n🔧 Ou utilisez ce script Python pour créer l\'admin:');
      console.log('```python');
      console.log('import bcrypt');
      console.log('from datetime import datetime');
      console.log('');
      console.log('# Hash du mot de passe "admin123"');
      console.log('password_hash = bcrypt.hashpw("admin123".encode("utf-8"), bcrypt.gensalt())');
      console.log('');
      console.log('admin_doc = {');
      console.log('    "email": "admin@cocoti.com",');
      console.log('    "password_hash": password_hash.decode("utf-8"),');
      console.log('    "roles": ["admin"],');
      console.log('    "admin_type": "admin",');
      console.log('    "first_name": "Admin",');
      console.log('    "last_name": "Cocoti",');
      console.log('    "phone_number": "+221701234567",');
      console.log('    "is_verified": True,');
      console.log('    "is_active": True,');
      console.log('    "must_change_password": False,');
      console.log('    "created_at": datetime.utcnow(),');
      console.log('    "updated_at": datetime.utcnow()');
      console.log('}');
      console.log('');
      console.log('# Insérer dans MongoDB');
      console.log('# db.users.insert_one(admin_doc)');
      console.log('```');
      
      return;
    }

    // Si on a un token, créons un admin via l'API
    console.log('\n2️⃣ Création d\'un admin via l\'API...');
    const createResponse = await fetch(`${API_BASE_URL}/admin/admins`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        email: 'admin@cocoti.com',
        password: 'admin123',
        first_name: 'Admin',
        last_name: 'Cocoti',
        phone_number: '+221701234567',
        roles: ['admin'],
        admin_type: 'admin'
      }),
    });

    if (createResponse.ok) {
      const adminData = await createResponse.json();
      console.log('✅ Admin créé avec succès !');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Type: ${adminData.admin_type}`);
      console.log(`   Rôles: ${adminData.roles.join(', ')}`);
    } else {
      const errorData = await createResponse.json().catch(() => ({}));
      console.log(`❌ Erreur lors de la création: ${errorData.detail || createResponse.statusText}`);
    }

  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

// Exécuter le script
createTestAdmin();
