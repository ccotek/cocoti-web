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
        <motion.h2 className="text-3xl font-bold sm:text-4xl" {...fadeInUp}>
          {how.title}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {how.steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative flex flex-col gap-4 rounded-3xl border border-cloud bg-ivory/80 p-8 shadow-sm"
              {...scaleIn}
              transition={{ delay: index * 0.1 }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-magenta text-sm font-semibold text-white">
                {index + 1}
              </span>
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
