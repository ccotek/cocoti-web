"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
} as const;

type FaqSectionProps = {
  faq: {
    title: string;
    subtitle: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
    cta?: {
      title: string;
      description: string;
      whatsapp: string;
    };
    whatsappNumber?: string;
    whatsappMessage?: string;
  };
};

export default function FaqSection({ faq }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const whatsappNumber = faq.whatsappNumber || "221771234567";
  const whatsappMessage = faq.whatsappMessage || "Bonjour ! Je suis intéressé(e) par Cocoti. Pouvez-vous m'en dire plus ?";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="section-padding bg-sand relative overflow-hidden">
      {/* Abstract decorative background */}
      <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-magenta/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-[-10%] w-[40%] h-[40%] bg-sunset/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        {/* Header Section - Top aligned for consistency */}
        <motion.div
          id="faq"
          className="max-w-3xl mb-8 lg:mb-12 scroll-mt-[100px]"
          {...fadeInUp}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-magenta/10 text-magenta text-xs font-bold uppercase tracking-widest mb-6">
            Toujours à vos côtés
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-night mb-6 leading-tight">
            {faq.title}
          </h2>
          <p className="text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl">
            {faq.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-start">
          {/* Questions Column */}
          <div className="space-y-4">
            {faq.items?.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={item.question}
                  className={`group relative rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${isOpen
                    ? "border-magenta/30 bg-white/80 shadow-2xl shadow-magenta/5 translate-x-2"
                    : "border-cloud/60 bg-white/40 hover:border-magenta/20 hover:bg-white/60 hover:-translate-y-1"
                    }`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-8 py-6 text-left"
                  >
                    <span className={`text-lg font-bold transition-colors ${isOpen ? "text-magenta" : "text-night"}`}>
                      {item.question}
                    </span>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? "bg-gradient-to-br from-magenta to-sunset text-white rotate-45" : "bg-magenta/10 text-magenta group-hover:scale-110"
                      }`}>
                      <PlusIcon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="px-8 pb-8 text-base text-ink-muted leading-relaxed border-t border-cloud/10 pt-4">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Card Column */}
          <motion.div
            className="lg:sticky lg:top-32"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="group relative rounded-[2.5rem] border border-cloud/50 bg-white/60 p-8 md:p-10 shadow-2xl shadow-night/[0.03] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-magenta to-sunset text-white mb-6 shadow-lg shadow-magenta/20">
                <QuestionMarkCircleIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-night mb-4">
                {faq.cta?.title || "Vous ne trouvez pas votre réponse ?"}
              </h3>
              <p className="text-ink-muted mb-8 text-base leading-relaxed">
                {faq.cta?.description || "Notre équipe est là pour vous aider. On discute ensemble sur WhatsApp ?"}
              </p>

              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-magenta to-sunset text-white px-8 py-4 font-bold text-base shadow-lg shadow-magenta/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-magenta/30 overflow-hidden group/btn"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                {faq.cta?.whatsapp || "Nous écrire sur WhatsApp"}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
