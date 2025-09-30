"use client";

import { motion } from "framer-motion";
import { EnvelopeOpenIcon, PhoneIcon, ClockIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

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
    subtitle?: string;
    description: string;
    button: string;
    email: string;
    phone: string;
    whatsapp: string;
    whatsappLink: string;
    social?: {
      title: string;
      description: string;
    };
    hours?: {
      title: string;
      description: string;
      weekend: string;
    };
  };
  onOpenModal: () => void;
};

export default function ContactSection({ contact, onOpenModal }: ContactSectionProps) {
  return (
    <section id="contact" className="section-padding bg-ivory/30">
      <div className="container">
        {/* Header */}
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">{contact.title || 'Contactez-nous'}</h2>
          {contact.subtitle && (
            <p className="text-lg text-magenta font-medium mb-4">{contact.subtitle}</p>
          )}
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">{contact.description || 'Nous sommes là pour vous aider'}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info Card */}
          <motion.div
            className="lg:col-span-2 grid gap-6 md:grid-cols-2"
            {...fadeInUp}
          >
            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cloud">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sunset to-magenta rounded-lg flex items-center justify-center">
                  <EnvelopeOpenIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-night">Email</h3>
              </div>
              <p className="text-ink-muted mb-4">{contact.email || 'Email non configuré'}</p>
              <button
                onClick={onOpenModal}
                className="w-full bg-gradient-to-r from-sunset to-magenta text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                {contact.button || 'Contactez-nous'}
              </button>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cloud">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-turquoise to-magenta rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-night">Téléphone</h3>
              </div>
                  <p className="text-ink-muted mb-4">{contact.phone || 'Téléphone non configuré'}</p>
              <a
                href={`tel:${contact.phone?.replace(/\s/g, '') || ''}`}
                className="w-full border border-turquoise text-turquoise py-2 px-4 rounded-lg font-medium hover:bg-turquoise hover:text-white transition-all inline-block text-center"
              >
                Appeler
              </a>
            </div>


            {/* Hours */}
            {contact.hours && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cloud">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-sunset to-turquoise rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-night">{contact.hours.title}</h3>
                </div>
                    <p className="text-ink-muted text-sm mb-2">{contact.hours.description || 'Horaires non configurés'}</p>
                    <p className="text-ink-muted text-sm">{contact.hours.weekend || 'Weekend non configuré'}</p>
              </div>
            )}
          </motion.div>

          {/* WhatsApp & Social */}
          <motion.div className="space-y-6" {...scaleIn}>
            {/* WhatsApp Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-night">WhatsApp</h3>
              </div>
              <p className="text-ink-muted text-sm mb-4">Réponse rapide garantie</p>
              <a
                href={contact.whatsappLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-all inline-block text-center"
              >
                {contact.whatsapp || 'WhatsApp'}
              </a>
            </div>

            {/* Social Card */}
            {contact.social && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-cloud">
                <h3 className="text-lg font-semibold text-night mb-2">{contact.social.title || 'Réseaux sociaux'}</h3>
                    <p className="text-ink-muted text-sm mb-4">{contact.social.description || 'Réseaux sociaux non configurés'}</p>
                <div className="flex gap-3">
                  <a href="https://facebook.com/cocoti" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    📘
                  </a>
                  <a href="https://instagram.com/cocoti" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-pink-500 text-white rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors">
                    📷
                  </a>
                  <a href="https://linkedin.com/company/cocoti" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                    💼
                  </a>
                  <a href="https://twitter.com/cocoti" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors">
                    🐦
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
