"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAuthService, AdminUser } from "@/services/adminAuthService";

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    checkAuth();
  }, []);

  // Re-vérifier l'authentification quand le composant se monte
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier immédiatement
    checkAuth();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Vérification synchrone d'abord
      if (!adminAuthService.isAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }


      // Vérifier les permissions admin
      const hasPermissions = await adminAuthService.checkAdminPermissions();
      if (!hasPermissions) {
        setError("Accès refusé : privilèges admin insuffisants");
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }


      // Récupérer les informations de l'admin
      const adminData = await adminAuthService.getCurrentAdmin();
      setUser(adminData);
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      setError("Erreur de vérification des permissions");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAuthService.login({ email, password });
      
      // Vérifier les permissions après connexion
      const hasPermissions = await adminAuthService.checkAdminPermissions();
      if (!hasPermissions) {
        adminAuthService.logout();
        setError("Accès refusé : seuls les super_admin, admin et marketing_admin sont autorisés");
        return { success: false, error: "Privilèges insuffisants" };
      }

      // Récupérer les informations de l'admin
      const adminData = await adminAuthService.getCurrentAdmin();
      setUser(adminData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      const errorMessage = error.message || "Erreur de connexion";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    router.push("/admin/login");
  };

  const requireAuth = () => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
    requireAuth,
    checkAuth
  };
}
