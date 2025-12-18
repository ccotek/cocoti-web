"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { getAppStoreLink } from "@/utils/device";

type SimpleFloatingButtonProps = {
  locale: 'fr' | 'en';
  apps?: Array<{ store: string; label: string; href: string }>;
};

export default function SimpleFloatingButton({ apps = [] }: SimpleFloatingButtonProps) {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setDownloadUrl(getAppStoreLink(apps));
  }, [apps]);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] md:hidden">
      {/* Bouton principal de téléchargement */}
      <a
        href={downloadUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-sunset to-magenta shadow-2xl transition-all hover:shadow-3xl"
      >
        {/* Halo d'animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-sunset to-magenta"
          style={{ zIndex: -1 }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
        />

        <ArrowDownTrayIcon className="relative z-10 h-8 w-8 text-white drop-shadow-lg" />
      </a>
    </div>
  );
}
