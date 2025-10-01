"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import { ADMIN_CONFIG } from "@/config/admin";

export default function CmsPage() {
  const { isAuthenticated, loading, user } = useAdminAuthContext();
  const router = useRouter();

  // Vérifier si l'admin est activé - retourner 404 si désactivé
  if (!ADMIN_CONFIG.ENABLED) {
    notFound();
  }

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/cms/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
          <p className="text-ink-muted">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // La redirection se fait dans useEffect
  }

  return <AdminDashboard />;
}
