"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  PlusIcon, 
  TrashIcon, 
  LinkIcon, 
  ShareIcon,
  DocumentTextIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

interface FooterEditorProps {
  footer: {
    company: string;
    legalLinks: Array<{ label: string; href: string }>;
    socialLinks: Array<{ label: string; href: string; icon?: string }>;
    quickLinks: Array<{ label: string; href: string }>;
  };
  onUpdate: (data: any) => Promise<{ success: boolean }>;
  locale: string;
}

export default function FooterEditor({ footer, onUpdate, locale }: FooterEditorProps) {
  const [activeTab, setActiveTab] = useState<'company' | 'quickLinks' | 'legalLinks' | 'socialLinks'>('company');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (data: any) => {
    setLoading(true);
    try {
      await onUpdate(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await handleUpdate(localFooter);
  };

  const [localFooter, setLocalFooter] = useState(footer);

  // Mettre à jour le footer local quand les props changent
  useEffect(() => {
    setLocalFooter(footer);
  }, [footer]);

  const addLink = (type: 'quickLinks' | 'legalLinks' | 'socialLinks') => {
    const newLink = type === 'socialLinks' 
      ? { label: '', href: '', icon: '' }
      : { label: '', href: '' };
    
    const updatedFooter = {
      ...localFooter,
      [type]: [...localFooter[type], newLink]
    };
    setLocalFooter(updatedFooter);
  };

  const removeLink = (type: 'quickLinks' | 'legalLinks' | 'socialLinks', index: number) => {
    const updatedFooter = {
      ...localFooter,
      [type]: localFooter[type].filter((_, i) => i !== index)
    };
    setLocalFooter(updatedFooter);
  };

  const updateLink = (type: 'quickLinks' | 'legalLinks' | 'socialLinks', index: number, field: string, value: string) => {
    const updatedFooter = {
      ...localFooter,
      [type]: localFooter[type].map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    };
    setLocalFooter(updatedFooter);
  };

  const updateCompany = (value: string) => {
    const updatedFooter = { ...localFooter, company: value };
    setLocalFooter(updatedFooter);
  };

  // Traductions pour le FooterEditor
  const footerTranslations = {
    fr: {
      title: "Configuration du Footer",
      tabs: {
        company: "Description",
        quickLinks: "Liens rapides", 
        legalLinks: "Liens légaux",
        socialLinks: "Réseaux sociaux"
      },
      labels: {
        company: "Description de l'entreprise",
        add: "Ajouter",
        save: "Sauvegarder les modifications"
      }
    },
    en: {
      title: "Footer Configuration",
      tabs: {
        company: "Description",
        quickLinks: "Quick Links",
        legalLinks: "Legal Links", 
        socialLinks: "Social Networks"
      },
      labels: {
        company: "Company description",
        add: "Add",
        save: "Save changes"
      }
    }
  };

  const t = footerTranslations[locale as keyof typeof footerTranslations] || footerTranslations.fr;

  const tabs = [
    { id: 'company', label: t.tabs.company, icon: DocumentTextIcon },
    { id: 'quickLinks', label: t.tabs.quickLinks, icon: LinkIcon },
    { id: 'legalLinks', label: t.tabs.legalLinks, icon: DocumentTextIcon },
    { id: 'socialLinks', label: t.tabs.socialLinks, icon: ShareIcon },
  ];

  return (
    <div className="bg-white rounded-2xl border border-cloud p-6">
      <div className="flex items-center gap-3 mb-6">
        <GlobeAltIcon className="w-6 h-6 text-magenta" />
        <h3 className="text-xl font-semibold text-night">{t.title}</h3>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-magenta text-white'
                : 'bg-ivory text-ink-muted hover:bg-cloud'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-4">
        {activeTab === 'company' && (
          <div>
            <label className="block text-sm font-medium text-night mb-2">
              Description de l'entreprise
            </label>
            <textarea
              value={localFooter.company}
              onChange={(e) => updateCompany(e.target.value)}
              className="w-full px-4 py-3 border border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-ivory"
              rows={3}
              placeholder="Description de votre entreprise..."
            />
          </div>
        )}

        {activeTab === 'quickLinks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-night">Liens rapides</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addLink('quickLinks')}
                className="flex items-center gap-2 px-3 py-2 bg-magenta text-white rounded-lg text-sm font-medium hover:bg-magenta-dark transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                {t.labels.add}
              </motion.button>
            </div>
            <div className="space-y-3">
              {localFooter.quickLinks.map((link, index) => (
                <div key={index} className="flex gap-3 p-3 bg-ivory rounded-lg border border-cloud">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink('quickLinks', index, 'label', e.target.value)}
                    placeholder="Label du lien"
                    className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateLink('quickLinks', index, 'href', e.target.value)}
                    placeholder="URL du lien"
                    className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                  />
                  <button
                    onClick={() => removeLink('quickLinks', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'legalLinks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-night">Liens légaux</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addLink('legalLinks')}
                className="flex items-center gap-2 px-3 py-2 bg-magenta text-white rounded-lg text-sm font-medium hover:bg-magenta-dark transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                {t.labels.add}
              </motion.button>
            </div>
            <div className="space-y-3">
              {localFooter.legalLinks.map((link, index) => (
                <div key={index} className="flex gap-3 p-3 bg-ivory rounded-lg border border-cloud">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink('legalLinks', index, 'label', e.target.value)}
                    placeholder="Label du lien"
                    className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateLink('legalLinks', index, 'href', e.target.value)}
                    placeholder="URL du lien"
                    className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                  />
                  <button
                    onClick={() => removeLink('legalLinks', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'socialLinks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-night">Réseaux sociaux</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addLink('socialLinks')}
                className="flex items-center gap-2 px-3 py-2 bg-magenta text-white rounded-lg text-sm font-medium hover:bg-magenta-dark transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                {t.labels.add}
              </motion.button>
            </div>
            <div className="space-y-3">
              {localFooter.socialLinks.map((link, index) => (
                <div key={index} className="flex gap-3 p-3 bg-ivory rounded-lg border border-cloud">
                  <input
                    type="text"
                    value={link.icon || ''}
                    onChange={(e) => updateLink('socialLinks', index, 'icon', e.target.value)}
                    placeholder="Emoji (ex: 📘)"
                    className="w-20 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white text-center"
                  />
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink('socialLinks', index, 'label', e.target.value)}
                    placeholder="Nom du réseau"
                    className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                  />
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => updateLink('socialLinks', index, 'href', e.target.value)}
                    placeholder="URL du profil"
                    className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                  />
                  <button
                    onClick={() => removeLink('socialLinks', index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Astuce :</strong> Utilisez des emojis pour les icônes (📘 Facebook, 📷 Instagram, 💼 LinkedIn, 🐦 X/Twitter, 📺 YouTube)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de sauvegarde */}
      <div className="mt-8 pt-6 border-t border-cloud/60 flex justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-2xl font-medium hover:shadow-glow focus:ring-2 focus:ring-magenta focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sauvegarde...
            </div>
          ) : (
            t.labels.save
          )}
        </motion.button>
      </div>
    </div>
  );
}
