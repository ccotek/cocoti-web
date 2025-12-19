"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SparklesIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { getAppStoreLink } from "@/utils/device";

// Images du carousel - Définies à l'extérieur pour éviter les changements de référence
const HERO_IMAGES = [
  "/hero1.png",
  "/hero2.png",
  "/hero3.png"
];

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
} as const;

type HeroSectionProps = {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    download: string;
    viewDashboard: string;
    viewDashboardLink: string;
    apps: Array<{ store: string; label: string; href: string }>;
    stats: Array<{ value: string; label: string }>;
    mockupAlt: string;
    image?: string;
  };
};

export default function HeroSection({ hero }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [appStoreLink, setAppStoreLink] = useState("");

  // Éviter les problèmes d'hydratation en calculant le lien côté client uniquement
  useEffect(() => {
    setAppStoreLink(getAppStoreLink(hero.apps));
  }, [hero.apps]);

  // Auto-rotation des images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % HERO_IMAGES.length
      );
    }, 5000); // Change d'image toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden bg-ivory">
      <div className="absolute inset-0" aria-hidden>
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-gradient-to-br from-sunset/50 to-magenta/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-96 w-96 rounded-full bg-sunset/20 blur-3xl" />
      </div>
      <div className="container relative flex flex-col gap-12 py-12 md:py-20 md:flex-row md:items-center">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-coral/50 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-coral shadow-sm">
            <SparklesIcon className="h-4 w-4" />
            {hero.badge}
          </span>
          <motion.h1
            className="text-4xl font-bold leading-tight md:text-6xl text-night"
            {...fadeInUp}
          >
            {hero.title}
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-ink-muted leading-relaxed" {...fadeInUp} transition={{ delay: 0.1 }}>
            {hero.subtitle}
          </motion.p>
          <motion.div className="flex flex-wrap items-center gap-4" {...fadeInUp} transition={{ delay: 0.2 }}>
            <a
              href={appStoreLink || "#"}
              className="rounded-full bg-gradient-to-r from-sunset to-magenta px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-magenta/30 transition hover:shadow-xl"
            >
              {hero.download}
            </a>
          </motion.div>
          <motion.div className="hidden md:flex flex-col gap-3 text-sm text-ink-muted" {...fadeInUp} transition={{ delay: 0.3 }}>
            {hero.apps && Array.isArray(hero.apps) && hero.apps.map((app) => (
              <div key={app.store} className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-magenta" />
                <span className="font-semibold text-night">{app.store}</span>
                <span>{app.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="relative ml-auto hidden md:flex w-full max-w-md items-center justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="relative overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl"
            animate={{ y: [0, -16, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {/* Image avec animation fade + scale */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src={HERO_IMAGES[currentImageIndex]}
                  alt={hero.mockupAlt}
                  width={360}
                  height={720}
                  priority
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Indicateurs de pagination avec animation */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-10">
              {HERO_IMAGES.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${index === currentImageIndex
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/75'
                    }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: index === currentImageIndex ? 1.1 : 1,
                    opacity: index === currentImageIndex ? 1 : 0.6
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="container grid grid-cols-1 gap-6 pb-16 pt-4 sm:grid-cols-3"
        {...fadeInUp}
        transition={{ delay: 0.1 }}
      >
        {hero.stats && Array.isArray(hero.stats) && hero.stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white bg-white/70 px-6 py-5 shadow-sm backdrop-blur">
            <span className="text-3xl font-bold bg-gradient-to-r from-sunset to-magenta bg-clip-text text-transparent">
              {stat.value}
            </span>
            <p className="text-sm text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
