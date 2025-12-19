"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
} as const;

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.4 }
} as const;

type HowSectionProps = {
  how: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
};

export default function HowSection({ how }: HowSectionProps) {
  return (
    <section id="how" className="section-padding bg-white">
      <div className="container space-y-10">
        <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight" {...fadeInUp}>
          {how.title}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {how.steps && Array.isArray(how.steps) && how.steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="group relative flex flex-col gap-4 rounded-3xl border border-cloud bg-white/90 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-magenta/10"
              {...scaleIn}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
                rotateY: 1,
                transition: { duration: 0.3 }
              }}
              animate={{
                y: [0, -1, 0],
                transition: {
                  duration: 5 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-magenta to-sunset text-sm font-semibold text-white shadow-lg"
                whileHover={{
                  scale: 1.1,
                  rotate: 360,
                  transition: { duration: 0.5 }
                }}
                animate={{
                  rotate: [0, 2, -2, 0],
                  transition: {
                    duration: 3 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                {index + 1}
              </motion.span>
              <h3 className="text-xl font-semibold text-night">{step.title}</h3>
              <p className="text-sm text-ink-muted">{step.description}</p>
              <div className="absolute inset-0 rounded-3xl border border-transparent transition duration-300 hover:border-magenta/40" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
