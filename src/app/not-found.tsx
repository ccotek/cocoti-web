"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HomeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger automatiquement vers l'accueil après 3 secondes
    const timer = setTimeout(() => {
      router.push("/fr");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-sunset to-magenta rounded-3xl flex items-center justify-center mb-6 shadow-glow"
          >
            <span className="text-4xl font-bold text-white">404</span>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-night mb-4">
            Page introuvable
          </h1>
          
          <p className="text-ink-muted mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={() => router.push("/fr")}
            className="w-full bg-gradient-to-r from-sunset to-magenta text-white py-3 px-6 rounded-2xl font-medium hover:shadow-glow focus:ring-2 focus:ring-magenta focus:ring-offset-2 transition-all shadow-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HomeIcon className="w-5 h-5" />
            Retour à l'accueil
          </motion.button>
          
          <motion.button
            onClick={() => router.back()}
            className="w-full border border-cloud text-night py-3 px-6 rounded-2xl font-medium hover:bg-ivory focus:ring-2 focus:ring-magenta focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Page précédente
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-ink-muted mt-6"
        >
          Redirection automatique dans 3 secondes...
        </motion.p>
      </motion.div>
    </div>
  );
}
