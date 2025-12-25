"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { translate } from "@/utils/translations";

interface WhatsAppButtonSimpleProps {
  phoneNumber?: string;
  message?: string;
  locale: 'fr' | 'en';
}

export default function WhatsAppButtonSimple({
  phoneNumber = "+221771234567",
  message,
  locale
}: WhatsAppButtonSimpleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const finalMessage = message || translate("whatsapp.defaultMessage", locale);

  useEffect(() => {
    // Afficher le bouton après un délai
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    console.log('🚀 Ouverture WhatsApp:', whatsappUrl);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-50">
      {/* Bouton principal */}
      <motion.button
        onClick={handleWhatsAppClick}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        title={translate("whatsapp.buttonTitle", locale)}
      >
        <ChatBubbleLeftRightIcon className="w-6 h-6" />
      </motion.button>


      {/* Animation de pulsation */}
      <motion.div
        className="absolute inset-0 bg-green-500 rounded-full opacity-30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}
