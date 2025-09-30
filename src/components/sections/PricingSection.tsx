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

type PricingSectionProps = {
  pricing: {
    title: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      cta: string;
      highlight?: boolean;
    }>;
  };
};

export default function PricingSection({ pricing }: PricingSectionProps) {
  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container space-y-10">
        <motion.h2 className="text-3xl font-bold sm:text-4xl" {...fadeInUp}>
          {pricing.title}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2">
          {pricing.plans && Array.isArray(pricing.plans) && pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`rounded-3xl border p-8 shadow-sm transition ${
                plan.highlight
                  ? "border-magenta bg-gradient-to-br from-magenta/10 to-sunset/10"
                  : "border-cloud bg-ivory/80"
              }`}
              {...scaleIn}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <span className="text-sm text-ink-muted">{plan.period}</span>
              </div>
              <p className="mt-2 text-4xl font-bold">
                {plan.price}
              </p>
              <p className="mt-4 text-sm text-ink-muted">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-night">
                {plan.features && Array.isArray(plan.features) && plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-magenta" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-magenta text-white shadow-lg shadow-magenta/20 hover:shadow-xl"
                    : "border border-magenta text-magenta hover:bg-magenta hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
