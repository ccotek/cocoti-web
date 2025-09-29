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
          <h2 className="text-3xl font-bold sm:text-4xl">{testimonials.title}</h2>
          <p className="text-lg text-ink-muted">{testimonials.subtitle}</p>
          <div className="flex gap-3">
            {items.map((_, indicatorIndex) => (
              <button
                key={indicatorIndex}
                type="button"
                onClick={() => setIndex(indicatorIndex)}
                className={`h-2 w-8 rounded-full transition ${
                  indicatorIndex === index ? "bg-magenta" : "bg-cloud"
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
              className="rounded-3xl border border-cloud bg-white/90 p-8 shadow-xl backdrop-blur"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <Image
                  src={items[index]?.avatar || '/placeholder-avatar.jpg'}
                  alt={items[index]?.name || 'Utilisateur'}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
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
