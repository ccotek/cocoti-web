"use client";

import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { motion } from "framer-motion";
import { LockClosedIcon } from "@heroicons/react/24/outline";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, loading, requireAuth } = useAdminAuth();

  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

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
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="w-8 h-8 text-coral" />
          </div>
          <h1 className="text-2xl font-bold text-night mb-2">
            Accès Refusé
          </h1>
          <p className="text-ink-muted mb-6">
            Vous devez être connecté pour accéder à cette page.
          </p>
          <a
            href="/cms/login"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl hover:shadow-glow transition-all"
          >
            Se connecter
          </a>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
