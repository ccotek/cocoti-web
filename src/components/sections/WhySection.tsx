"use client";

import { motion } from "framer-motion";
import { BanknotesIcon, ShieldCheckIcon, EyeIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

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

const valueIcons: Record<number, any> = {
  0: BanknotesIcon,
  1: ShieldCheckIcon,
  2: EyeIcon,
  3: GlobeAltIcon
};

type WhySectionProps = {
  why: {
    title: string;
    subtitle: string;
    values: Array<{
      title: string;
      description: string;
    }>;
  };
};

export default function WhySection({ why }: WhySectionProps) {
  return (
    <section id="why" className="section-padding">
      <div className="container space-y-10">
        <motion.div className="max-w-2xl space-y-4" {...fadeInUp}>
          <h2 className="text-3xl font-bold sm:text-4xl">{why.title}</h2>
          <p className="text-lg text-ink-muted">{why.subtitle}</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {why.values.map((value, index) => {
            const Icon = valueIcons[index] ?? BanknotesIcon;
            return (
              <motion.div
                key={value.title}
                className="flex flex-col gap-4 rounded-3xl border border-cloud bg-white/80 p-8 shadow-sm"
                {...scaleIn}
                transition={{ delay: index * 0.1 }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sunset/10 text-sunset">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-night">{value.title}</h3>
                <p className="text-sm text-ink-muted">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
