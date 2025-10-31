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
        <motion.h2 className="text-3xl font-bold sm:text-4xl text-center" {...fadeInUp}>
          {pricing.title}
        </motion.h2>
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-7xl mx-auto">
          {pricing.plans && Array.isArray(pricing.plans) && pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`rounded-3xl border p-6 shadow-sm transition relative ${
                plan.highlight
                  ? "border-magenta bg-gradient-to-br from-magenta/10 to-sunset/10 scale-110 shadow-xl shadow-magenta/20"
                  : "border-cloud bg-ivory/80"
              }`}
              {...scaleIn}
              transition={{ delay: index * 0.1 }}
            >
              {/* Badge populaire */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-magenta to-sunset text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Populaire
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className={`text-xl font-semibold ${plan.highlight ? 'text-magenta' : 'text-night'}`}>
                  {plan.name}
                </h3>
                <div className="mt-2">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-magenta' : 'text-night'}`}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-ink-muted ml-1">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{plan.description}</p>
              </div>
              
              <ul className="mt-6 space-y-3 text-sm text-night">
                {plan.features && Array.isArray(plan.features) && plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className={`mt-1 inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                      plan.highlight ? 'bg-magenta' : 'bg-magenta'
                    }`} aria-hidden />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a
                href="#contact"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-gradient-to-r from-magenta to-sunset text-white shadow-lg shadow-magenta/20 hover:shadow-xl hover:scale-105 transform"
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
