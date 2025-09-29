"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
};

export default function AuthModal({ isOpen, onClose, locale }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pouvez ajouter la logique d'authentification
    console.log('Login form submitted:', formData);
    // Pour l'instant, on ferme juste le modal
    onClose();
  };

  const isFrench = locale === 'fr';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/50 p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-night">
                  {isFrench ? 'Se connecter' : 'Login'}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {isFrench ? 'Accédez à votre espace Cocoti' : 'Access your Cocoti space'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-cloud p-2"
                aria-label={isFrench ? 'Fermer' : 'Close'}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm text-night">
                {isFrench ? 'Email' : 'Email'}
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="rounded-2xl border border-cloud px-4 py-3 text-sm focus:border-magenta focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-night">
                {isFrench ? 'Mot de passe' : 'Password'}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-2xl border border-cloud px-4 py-3 pr-12 text-sm focus:border-magenta focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-ink-muted" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-ink-muted" />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sunset to-magenta px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-magenta/30 transition hover:shadow-xl"
              >
                {isFrench ? 'Se connecter' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-magenta hover:underline"
              >
                {isFrench ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </a>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-ink-muted">
                {isFrench 
                  ? 'En continuant, vous acceptez nos conditions d\'utilisation'
                  : 'By continuing, you agree to our terms of service'
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
