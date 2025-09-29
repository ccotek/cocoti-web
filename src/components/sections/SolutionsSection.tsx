"use client";

import { motion } from "framer-motion";
import { UsersIcon, HeartIcon, SparklesIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

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

const solutionIcons: Record<string, any> = {
  tontines: UsersIcon,
  cagnottes: HeartIcon,
  crowdfunding: SparklesIcon,
  "group-buys": ShoppingBagIcon
};

type SolutionsSectionProps = {
  solutions: {
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
};

export default function SolutionsSection({ solutions }: SolutionsSectionProps) {
  return (
    <section id="solutions" className="section-padding">
      <div className="container space-y-10">
        <motion.div className="max-w-2xl space-y-4" {...fadeInUp}>
          <h2 className="text-3xl font-bold sm:text-4xl">{solutions.title}</h2>
          <p className="text-lg text-ink-muted">{solutions.subtitle}</p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2">
          {solutions.items.map((item, index) => {
            const IconComponent = solutionIcons[item.id] ?? SparklesIcon;
            return (
              <motion.div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-cloud bg-white/80 p-8 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
                {...scaleIn}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-magenta/10 text-magenta">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-night">{item.title}</h3>
                <p className="mt-3 text-sm text-ink-muted">{item.description}</p>
                <div className="absolute -bottom-12 right-4 h-36 w-36 rounded-full bg-gradient-to-br from-magenta/10 via-transparent to-transparent blur-2xl transition duration-500 group-hover:-bottom-6" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
