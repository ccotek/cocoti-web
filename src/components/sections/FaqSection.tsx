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

  // Pré-calculer l'URL WhatsApp pour éviter les problèmes d'hydratation
  const whatsappNumber = faq.whatsappNumber || "221771234567";
  const whatsappMessage = faq.whatsappMessage || "Bonjour ! Je suis intéressé(e) par Cocoti. Pouvez-vous m'en dire plus ?";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container space-y-8">
        <motion.h2 className="text-3xl font-bold sm:text-4xl" {...fadeInUp}>
          {faq.title}
        </motion.h2>
        <div className="grid gap-4">
          {faq.items && Array.isArray(faq.items) && faq.items.map((item, index) => (
            <motion.div
              key={item.question}
              className="group relative rounded-2xl border border-cloud bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-magenta/10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              animate={{ 
                y: [0, -1, 0],
                transition: { 
                  duration: 3 + index * 0.2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }
              }}
            >
              <motion.button
                type="button"
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-magenta/5"
                onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                whileHover={{ 
                  scale: 1.005,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.995 }}
              >
                <span className="text-sm font-semibold text-night">{item.question}</span>
                <motion.span 
                  className="text-xl text-magenta"
                  animate={{ 
                    rotate: openIndex === index ? 45 : 0,
                    scale: openIndex === index ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === index ? "−" : "+"}
                </motion.span>
              </motion.button>
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
        
        {/* CTA pour contacter si la FAQ ne satisfait pas */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="group relative rounded-3xl border border-cloud bg-gradient-to-br from-magenta/5 to-sunset/5 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            animate={{ 
              y: [0, -2, 0],
              transition: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }
            }}
          >
            <h3 className="text-xl font-semibold text-night mb-3">
              {faq.cta?.title || "Vous ne trouvez pas votre réponse ?"}
            </h3>
            <p className="text-ink-muted mb-6 max-w-2xl mx-auto">
              {faq.cta?.description || "Notre équipe est là pour vous aider. Contactez-nous directement sur WhatsApp pour une réponse personnalisée."}
            </p>
            <div className="flex justify-center">
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30"
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  y: [0, -1, 0],
                  transition: { 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }
                }}
              >
                <motion.svg 
                  className="w-6 h-6" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    transition: { 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }
                  }}
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </motion.svg>
                {faq.cta?.whatsapp || "Nous écrire sur WhatsApp"}
                
                {/* Effet de particules au hover */}
                <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
