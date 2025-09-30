"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { translate } from "@/utils/translations";

type WhatsAppEditorProps = {
  whatsapp: {
    number: string;
    message: string;
  };
  onUpdate: (data: { number: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  locale: 'fr' | 'en';
};

export default function WhatsAppEditor({ whatsapp, onUpdate, locale }: WhatsAppEditorProps) {
  const [formData, setFormData] = useState({
    number: whatsapp?.number || "",
    message: whatsapp?.message || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const t = (key: string) => translate(key, locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await onUpdate(formData);
      if (result && result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-cloud p-6">
        <h3 className="text-lg font-semibold text-night mb-4">
          {t("admin.whatsapp.title")}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Numéro WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-night mb-2">
              {t("admin.whatsapp.numberLabel")}
            </label>
            <input
              type="tel"
              value={formData.number}
              onChange={(e) => handleChange("number", e.target.value)}
              placeholder={t("admin.whatsapp.numberPlaceholder")}
              className="w-full px-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition"
              required
            />
            <p className="text-xs text-ink-muted mt-1">
              {t("admin.whatsapp.numberHelp")}
            </p>
          </div>

          {/* Message WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-night mb-2">
              {t("admin.whatsapp.messageLabel")}
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder={t("admin.whatsapp.messagePlaceholder")}
              rows={4}
              className="w-full px-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition resize-none"
              required
            />
            <p className="text-xs text-ink-muted mt-1">
              {t("admin.whatsapp.messageHelp")}
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-magenta hover:bg-magenta/90 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("admin.forms.saving")}
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  {t("admin.forms.save")}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Message de succès */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700"
          >
            <CheckIcon className="w-5 h-5" />
            {t("admin.forms.saved")}
          </motion.div>
        )}
      </div>
    </div>
  );
}
