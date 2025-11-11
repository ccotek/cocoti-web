"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PlusIcon, XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import CreateMoneyPoolModal from "./CreateMoneyPoolModal";

type SimpleFloatingButtonProps = {
  locale: 'fr' | 'en';
};

export default function SimpleFloatingButton({ locale }: SimpleFloatingButtonProps) {
  const params = useParams();
  const localeParam = (params?.locale as string) || locale;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCagnotte = () => {
    // Redirect to create page instead of opening modal
    window.location.href = `/${localeParam}/money-pool/create`;
  };

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-32 z-[9999]">
      {/* Menu expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-20 right-0 mb-4"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Option créer cagnotte */}
            <motion.button
              onClick={handleCreateCagnotte}
              className="flex items-center gap-3 bg-gradient-to-r from-sunset to-magenta text-white px-5 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all group min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
                     <div className="font-semibold text-base whitespace-nowrap">
                       {locale === 'fr' ? 'Créer une cagnotte' : 'Create a Money Pool'}
                     </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton principal */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-sunset to-magenta rounded-full shadow-2xl hover:shadow-3xl transition-all border-2 border-white flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: isExpanded ? 1 : [1, 1.15, 1],
          rotate: isExpanded ? 45 : 0
        }}
        transition={{ 
          duration: 0.3,
          scale: {
            duration: 4,
            repeat: Infinity,
            repeatDelay: 6,
            ease: "easeInOut"
          }
        }}
      >
        {/* Animation de mise en évidence périodique */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sunset to-magenta rounded-full -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 8, // Pause de 8 secondes entre chaque animation
            ease: "easeInOut"
          }}
        />
        
        {/* Animation de pulsation continue */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-sunset to-magenta rounded-full -z-10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              className="relative z-10"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="h-8 w-8 lg:h-12 lg:w-12 text-white drop-shadow-lg" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              className="relative z-10"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PlusIcon className="h-8 w-8 lg:h-12 lg:w-12 text-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Modal de création de money pool */}
      <CreateMoneyPoolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />
    </div>
  );
}
