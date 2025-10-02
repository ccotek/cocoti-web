"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { PlusIcon, XMarkIcon, HeartIcon } from "@heroicons/react/24/outline";

type FloatingCreateButtonProps = {
  locale: 'fr' | 'en';
};

export default function FloatingCreateButton({ locale }: FloatingCreateButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Pour l'instant, garder le bouton toujours visible pour debug
  // TODO: Réactiver le comportement de scroll plus tard
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCreateCagnotte = () => {
    // Rediriger vers le dashboard pour créer une cagnotte
    window.open(`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn'}/${locale}`, '_blank');
  };

  const handleQuickCreate = () => {
    // Action pour création rapide (peut-être ouvrir un modal ou rediriger)
    console.log('Quick create cagnotte');
    setIsExpanded(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-[9999]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Menu expandable */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="absolute bottom-16 right-0 mb-2 space-y-3"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Option création rapide */}
                <motion.button
                  onClick={handleQuickCreate}
                  className="flex items-center gap-3 bg-white text-night px-4 py-3 rounded-2xl shadow-lg border border-cloud hover:shadow-xl transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-turquoise to-sunset rounded-full flex items-center justify-center">
                    <HeartIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      {locale === 'fr' ? 'Création rapide' : 'Quick Create'}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {locale === 'fr' ? 'Cagnotte en 30s' : 'Cagnotte in 30s'}
                    </div>
                  </div>
                </motion.button>

                {/* Option création complète */}
                <motion.button
                  onClick={handleCreateCagnotte}
                  className="flex items-center gap-3 bg-gradient-to-r from-sunset to-magenta text-white px-4 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      {locale === 'fr' ? 'Créer une cagnotte' : 'Create Cagnotte'}
                    </div>
                    <div className="text-xs text-white/80">
                      {locale === 'fr' ? 'Personnalisation complète' : 'Full customization'}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton principal */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative w-16 h-16 bg-gradient-to-r from-sunset to-magenta rounded-full shadow-2xl hover:shadow-3xl transition-all group border-2 border-white"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              rotate: isExpanded ? 45 : 0,
              boxShadow: isExpanded 
                ? "0 20px 40px rgba(236, 72, 153, 0.6)" 
                : "0 10px 30px rgba(236, 72, 153, 0.5)"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ 
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999
            }}
          >
            {/* Effet de pulsation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-sunset to-magenta rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Icône */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PlusIcon className="h-6 w-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tooltip */}
            <motion.div
              className="absolute right-16 top-1/2 -translate-y-1/2 bg-night text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
            >
              {locale === 'fr' ? 'Créer une cagnotte' : 'Create Cagnotte'}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-night rotate-45" />
            </motion.div>
          </motion.button>

          {/* Particules flottantes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-magenta/30 rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${30 + i * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
