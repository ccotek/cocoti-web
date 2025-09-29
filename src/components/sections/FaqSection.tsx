"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
} as const;

type FaqSectionProps = {
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
};

export default function FaqSection({ faq }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container space-y-8">
        <motion.h2 className="text-3xl font-bold sm:text-4xl" {...fadeInUp}>
          {faq.title}
        </motion.h2>
        <div className="grid gap-4">
          {faq.items.map((item, index) => (
            <motion.div
              key={item.question}
              className="rounded-2xl border border-cloud bg-ivory/70"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
              >
                <span className="text-sm font-semibold text-night">{item.question}</span>
                <span className="text-xl text-magenta">{openIndex === index ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    className="px-6 pb-5 text-sm text-ink-muted"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
