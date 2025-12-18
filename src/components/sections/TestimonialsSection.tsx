"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
} as const;

type TestimonialsSectionProps = {
  testimonials: {
    title: string;
    subtitle: string;
    items: Array<{
      name: string;
      role: string;
      quote: string;
      avatar: string;
    }>;
  };
};

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0);
  const items = Array.isArray(testimonials.items) ? testimonials.items : [];

  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % items.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [items.length]);

  // Ne pas rendre si pas de données
  if (items.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="section-padding">
      <div className="container grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
        <motion.div className="space-y-4" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">{testimonials.title}</h2>
          <p className="text-base md:text-lg text-ink-muted leading-relaxed">{testimonials.subtitle}</p>
          <div className="flex gap-3">
            {items && Array.isArray(items) && items.map((_, indicatorIndex) => (
              <button
                key={indicatorIndex}
                type="button"
                onClick={() => setIndex(indicatorIndex)}
                className={`h-2 w-8 rounded-full transition ${indicatorIndex === index ? "bg-magenta" : "bg-cloud"
                  }`}
                aria-label={`Afficher le témoignage ${indicatorIndex + 1}`}
              />
            ))}
          </div>
        </motion.div>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={items[index].name}
              className="group relative rounded-3xl border border-cloud bg-white/95 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-3xl"
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                y: [0, -2, 0],
                transition: {
                  duration: 0.5,
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }
              }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              whileHover={{
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                  animate={{
                    rotate: [0, 2, -2, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <Image
                    src={items[index]?.avatar || '/placeholder-avatar.jpg'}
                    alt={items[index]?.name || 'Utilisateur'}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover shadow-lg ring-2 ring-white"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-magenta/20 to-sunset/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </motion.div>
                <div>
                  <p className="text-lg font-semibold text-night">{items[index]?.name || 'Utilisateur'}</p>
                  <p className="text-sm text-ink-muted">{items[index]?.role || 'Client'}</p>
                </div>
              </div>
              <p className="mt-6 text-base italic text-night">"{items[index]?.quote || 'Témoignage par défaut'}"</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
