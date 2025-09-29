"use client";

import { motion } from "framer-motion";
import { EnvelopeOpenIcon, PhoneIcon } from "@heroicons/react/24/outline";

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

type ContactSectionProps = {
  contact: {
    title: string;
    description: string;
    button: string;
    whatsapp: string;
    whatsappLink: string;
  };
  onOpenModal: () => void;
};

export default function ContactSection({ contact, onOpenModal }: ContactSectionProps) {
  return (
    <section id="contact" className="section-padding">
      <div className="container grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
        <motion.div className="space-y-4" {...fadeInUp}>
          <h2 className="text-3xl font-bold sm:text-4xl">{contact.title}</h2>
          <p className="text-lg text-ink-muted">{contact.description}</p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sunset to-magenta px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-magenta/30 transition hover:shadow-xl"
            >
              <EnvelopeOpenIcon className="h-5 w-5" />
              {contact.button}
            </button>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-magenta px-6 py-3 text-sm font-semibold text-magenta transition hover:bg-magenta hover:text-white"
            >
              <PhoneIcon className="h-5 w-5" />
              {contact.whatsapp}
            </a>
          </div>
        </motion.div>
        <motion.div
          className="relative rounded-3xl border border-cloud bg-white/80 p-6 shadow-sm"
          {...scaleIn}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-magenta/20 to-sunset/20 blur-2xl" aria-hidden />
          <h3 className="text-lg font-semibold text-night">Email</h3>
          <p className="mt-2 text-sm text-ink-muted">hello@cocoti.africa</p>
          <h3 className="mt-6 text-lg font-semibold text-night">Adresses</h3>
          <p className="mt-2 text-sm text-ink-muted">Dakar • Paris</p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-ink-muted">Support 7j/7</p>
        </motion.div>
      </div>
    </section>
  );
}
