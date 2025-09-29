"use client";

import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminAuthService } from "@/services/adminAuthService";
import { ADMIN_ADMIN_API_CONFIG } from "@/config/adminApi";

export default function DebugAdminAuth() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { login, loading, error, isAuthenticated, user } = useAdminAuth();

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const testDirectAPI = async () => {
    addDebugInfo("🔍 Test direct de l'API...");
    
    try {
      const url = `${ADMIN_API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
      addDebugInfo(`URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@cocoti.com',
          password: 'admin123'
        }),
      });

      addDebugInfo(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addDebugInfo(`✅ Connexion réussie ! Token: ${data.access_token.substring(0, 20)}...`);
        
        // Test /admin/me
        const meResponse = await fetch(`${ADMIN_API_CONFIG.BASE_URL}/admin/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
          },
        });
        
        if (meResponse.ok) {
          const meData = await meResponse.json();
          addDebugInfo(`✅ Profil: ${meData.email} (${meData.admin_type})`);
        } else {
          addDebugInfo(`❌ Erreur profil: ${meResponse.status}`);
        }
      } else {
        const errorText = await response.text();
        addDebugInfo(`❌ Erreur API: ${errorText}`);
      }
    } catch (error: any) {
      addDebugInfo(`❌ Erreur: ${error.message}`);
    }
  };

  const testService = async () => {
    addDebugInfo("🔍 Test du service d'authentification...");
    
    try {
      const result = await adminAuthService.login({
        email: 'admin@cocoti.com',
        password: 'admin123'
      });
      
      addDebugInfo(`✅ Service login réussi ! Token: ${result.access_token.substring(0, 20)}...`);
      
      // Test des permissions
      const hasPermissions = await adminAuthService.checkAdminPermissions();
      addDebugInfo(`Permissions: ${hasPermissions ? '✅' : '❌'}`);
      
      // Test du profil
      const profile = await adminAuthService.getCurrentAdmin();
      addDebugInfo(`Profil: ${profile.email} (${profile.admin_type})`);
      
    } catch (error: any) {
      addDebugInfo(`❌ Erreur service: ${error.message}`);
    }
  };

  const testHook = async () => {
    addDebugInfo("🔍 Test du hook useAdminAuth...");
    
    try {
      const result = await login('admin@cocoti.com', 'admin123');
      addDebugInfo(`Hook result: ${JSON.stringify(result)}`);
      addDebugInfo(`Authenticated: ${isAuthenticated}`);
      addDebugInfo(`User: ${user ? user.email : 'null'}`);
      addDebugInfo(`Error: ${error || 'null'}`);
    } catch (error: any) {
      addDebugInfo(`❌ Erreur hook: ${error.message}`);
    }
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">🔍 Debug Admin Auth</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">État actuel:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Loading: {loading ? '✅' : '❌'}</div>
          <div>Authenticated: {isAuthenticated ? '✅' : '❌'}</div>
          <div>User: {user ? user.email : 'null'}</div>
          <div>Error: {error || 'null'}</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Tests:</h3>
        <div className="flex gap-2 mb-4">
          <button
            onClick={testDirectAPI}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test API Direct
          </button>
          <button
            onClick={testService}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Service
          </button>
          <button
            onClick={testHook}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Hook
          </button>
          <button
            onClick={clearDebug}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Configuration:</h3>
        <div className="text-sm bg-gray-100 p-3 rounded">
          <div>API_BASE_URL: {ADMIN_API_CONFIG.BASE_URL}</div>
          <div>AUTH_LOGIN: {API_ENDPOINTS.AUTH.LOGIN}</div>
          <div>Full URL: {ADMIN_API_CONFIG.BASE_URL}{API_ENDPOINTS.AUTH.LOGIN}</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Debug Logs:</h3>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {debugInfo.length === 0 ? (
            <div className="text-gray-500">Aucun log pour le moment...</div>
          ) : (
            debugInfo.map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
