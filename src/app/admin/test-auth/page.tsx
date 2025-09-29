"use client";

import { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { adminAuthService } from "@/services/adminAuthService";
import { ADMIN_ADMIN_API_CONFIG } from "@/config/adminApi";

export default function TestAuthPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const { login, loading, error, isAuthenticated, user } = useAdminAuth();

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDirectAPI = async () => {
    addLog("🔍 Test direct de l'API...");
    
    try {
      const url = `${ADMIN_API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;
      addLog(`URL: ${url}`);
      
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

      addLog(`Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Connexion réussie ! Token: ${data.access_token.substring(0, 20)}...`);
        
        // Stocker le token manuellement
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_refresh_token', data.refresh_token);
        localStorage.setItem('admin_expires_at', data.expires_at);
        
        // Définir le cookie pour le middleware
        document.cookie = `admin_token=${data.access_token}; path=/; max-age=${60 * 60 * 24}; samesite=Lax`;
        
        addLog("✅ Token stocké dans localStorage et cookie");
      } else {
        const errorText = await response.text();
        addLog(`❌ Erreur API: ${errorText}`);
      }
    } catch (error: any) {
      addLog(`❌ Erreur: ${error.message}`);
    }
  };

  const testService = async () => {
    addLog("🔍 Test du service d'authentification...");
    
    try {
      const result = await adminAuthService.login({
        email: 'admin@cocoti.com',
        password: 'admin123'
      });
      
      addLog(`✅ Service login réussi ! Token: ${result.access_token.substring(0, 20)}...`);
      
    } catch (error: any) {
      addLog(`❌ Erreur service: ${error.message}`);
    }
  };

  const testHook = async () => {
    addLog("🔍 Test du hook useAdminAuth...");
    
    try {
      const result = await login('admin@cocoti.com', 'admin123');
      addLog(`Hook result: ${JSON.stringify(result)}`);
    } catch (error: any) {
      addLog(`❌ Erreur hook: ${error.message}`);
    }
  };

  const checkAuth = () => {
    addLog("🔍 Vérification de l'état d'authentification...");
    addLog(`isAuthenticated: ${isAuthenticated}`);
    addLog(`user: ${user ? JSON.stringify(user) : 'null'}`);
    addLog(`loading: ${loading}`);
    addLog(`error: ${error || 'null'}`);
    
    // Vérifier localStorage
    const token = localStorage.getItem('admin_token');
    const expires = localStorage.getItem('admin_expires_at');
    addLog(`localStorage token: ${token ? token.substring(0, 20) + '...' : 'null'}`);
    addLog(`localStorage expires: ${expires || 'null'}`);
    
    // Vérifier cookie
    const cookies = document.cookie;
    addLog(`cookies: ${cookies}`);
  };

  const clearAuth = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_expires_at');
    document.cookie = 'admin_token=; path=/; max-age=0; samesite=Lax';
    addLog("✅ Authentification effacée");
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-sand p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-night">🔍 Test d'Authentification Admin</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* État actuel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cloud">
            <h2 className="text-xl font-semibold mb-4 text-night">État Actuel</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Authenticated:</span>
                <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
                  {isAuthenticated ? "✅ Oui" : "❌ Non"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Loading:</span>
                <span className={loading ? "text-blue-600" : "text-gray-600"}>
                  {loading ? "⏳ Oui" : "✅ Non"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>User:</span>
                <span className="text-gray-600">
                  {user ? user.email : "null"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Error:</span>
                <span className={error ? "text-red-600" : "text-gray-600"}>
                  {error || "null"}
                </span>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cloud">
            <h2 className="text-xl font-semibold mb-4 text-night">Configuration</h2>
            <div className="space-y-2 text-sm">
              <div>API_BASE_URL: <code className="bg-ivory px-2 py-1 rounded">{ADMIN_API_CONFIG.BASE_URL}</code></div>
              <div>AUTH_LOGIN: <code className="bg-ivory px-2 py-1 rounded">{API_ENDPOINTS.AUTH.LOGIN}</code></div>
              <div>Full URL: <code className="bg-ivory px-2 py-1 rounded">{ADMIN_API_CONFIG.BASE_URL}{API_ENDPOINTS.AUTH.LOGIN}</code></div>
            </div>
          </div>
        </div>

        {/* Boutons de test */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-cloud">
          <h2 className="text-xl font-semibold mb-4 text-night">Tests</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={testDirectAPI}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Test API Direct
            </button>
            <button
              onClick={testService}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Test Service
            </button>
            <button
              onClick={testHook}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Test Hook
            </button>
            <button
              onClick={checkAuth}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Check Auth
            </button>
            <button
              onClick={clearAuth}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Auth
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-cloud">
          <h2 className="text-xl font-semibold mb-4 text-night">Logs de Debug</h2>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">Aucun log pour le moment...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
