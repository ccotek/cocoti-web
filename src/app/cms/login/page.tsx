"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import { ADMIN_CONFIG } from "@/config/admin";

export default function CmsLoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAdminAuthContext();
  const router = useRouter();

  // Vérifier si l'admin est activé - retourner 404 si désactivé
  if (!ADMIN_CONFIG.ENABLED) {
    notFound();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(credentials.email, credentials.password);
    if (result.success) {
      // Attendre un peu pour que le token soit stocké
      setTimeout(() => {
        router.push("/cms");
      }, 100);
    } else {
    }
  };

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-4xl shadow-2xl p-8 border border-cloud">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-sunset to-magenta rounded-2xl flex items-center justify-center mb-4 shadow-glow">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-night mb-2">
              Connexion CMS
            </h1>
            <p className="text-ink-muted">
              Accès au système de gestion de contenu
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-ivory"
                placeholder="admin@cocoti.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-12 border border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-ivory"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-night"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sunset to-magenta text-white py-3 px-4 rounded-2xl font-medium hover:shadow-glow focus:ring-2 focus:ring-magenta focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
