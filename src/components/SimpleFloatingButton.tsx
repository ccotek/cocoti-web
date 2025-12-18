"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { getAppStoreLink } from "@/utils/device";

type SimpleFloatingButtonProps = {
  locale: 'fr' | 'en';
  apps?: Array<{ store: string; label: string; href: string }>;
};

export default function SimpleFloatingButton({ locale, apps = [] }: SimpleFloatingButtonProps) {
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    setDownloadUrl(getAppStoreLink(apps));
  }, [apps]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] md:hidden">
      {/* Bouton principal de téléchargement */}
      <a
        href={downloadUrl}
        className="w-16 h-16 bg-gradient-to-r from-sunset to-magenta rounded-full shadow-2xl hover:shadow-3xl transition-all border-2 border-white flex items-center justify-center group"
      >
        {/* Animation de mise en évidence périodique */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sunset to-magenta rounded-full -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 8, // Pause de 8 secondes entre chaque animation
            ease: "easeInOut"
          }}
        />

        {/* Animation de pulsation continue */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sunset to-magenta rounded-full -z-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <ArrowDownTrayIcon className="h-8 w-8 text-white drop-shadow-lg" />
      </a>
    </div>
  );
}
