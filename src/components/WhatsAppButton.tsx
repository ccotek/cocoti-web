"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatBubbleLeftRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { translate } from "@/utils/translations";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  position?: "bottom-right" | "bottom-left";
  locale: 'fr' | 'en';
}

export default function WhatsAppButton({
  phoneNumber,
  message,
  position = "bottom-right",
  locale
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultMessage = translate("whatsapp.defaultMessage", locale);
  const finalMessage = message || defaultMessage;

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const positionClasses = position === "bottom-right"
    ? "bottom-6 right-6"
    : "bottom-6 left-6";

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {/* Bouton principal */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{translate("whatsapp.buttonTitle", locale)}</h3>
                  <p className="text-sm text-green-100">{translate("whatsapp.guarantee", locale)}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">
                {translate("whatsapp.description", locale)}
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  {translate("whatsapp.open", locale)}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  {translate("whatsapp.responseTime", locale)}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>💬 {translate("whatsapp.liveSupport", locale)}</span>
                <span>🕒 {translate("whatsapp.availableNow", locale)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification badge (optionnel) */}
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300 }}
      >
        <span className="text-xs text-white font-bold">!</span>
      </motion.div>
    </div>
  );
}
