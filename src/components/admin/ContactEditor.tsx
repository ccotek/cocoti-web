"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PlusIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon
} from "@heroicons/react/24/outline";

interface ContactEditorProps {
  contact: any;
  onUpdate: (data: any) => Promise<{ success: boolean }>;
  locale: string;
}

export default function ContactEditor({ contact, onUpdate, locale }: ContactEditorProps) {
  const [localContact, setLocalContact] = useState(contact);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'hours'>('basic');

  // Mettre à jour le contact local quand les props changent
  useEffect(() => {
    setLocalContact(contact);
  }, [contact]);

  const handleUpdate = async (data: any) => {
    setLoading(true);
    try {
      const result = await onUpdate(data);
      if (result && result.success) {
        console.log('✅ Contact mis à jour avec succès');
      } else {
        console.warn('⚠️ Résultat de mise à jour inattendu:', result);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await handleUpdate(localContact);
  };

  const updateField = (field: string, value: any) => {
    setLocalContact((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setLocalContact((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addSocialLink = () => {
    const newLink = {
      platform: 'Facebook',
      url: '',
      icon: '📘'
    };
    
    setLocalContact((prev: any) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink]
    }));
  };

  const removeSocialLink = (index: number) => {
    setLocalContact((prev: any) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateSocialLink = (index: number, field: string, value: any) => {
    setLocalContact((prev: any) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link: any, i: number) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Informations de base', icon: '📝' },
    { id: 'social', label: 'Réseaux sociaux', icon: '🌐' },
    { id: 'hours', label: 'Horaires', icon: '⏰' }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cloud">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-magenta text-white'
                : 'text-ink-muted hover:text-night hover:bg-ivory'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Information */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Titre principal
              </label>
              <input
                type="text"
                value={localContact.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Prêts à lancer votre communauté ?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Sous-titre
              </label>
              <input
                type="text"
                value={localContact.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Notre équipe est là pour vous accompagner"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-night mb-2">
                Description
              </label>
              <textarea
                value={localContact.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Contactez-nous pour une démo personnalisée..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Bouton CTA
              </label>
              <input
                type="text"
                value={localContact.button || ''}
                onChange={(e) => updateField('button', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Contactez-nous"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Email
              </label>
              <input
                type="email"
                value={localContact.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="contact@cocoti.sn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={localContact.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="+221331455871"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                WhatsApp - Texte du bouton
              </label>
              <input
                type="text"
                value={localContact.whatsapp || ''}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Continuer sur WhatsApp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                WhatsApp - Lien
              </label>
              <input
                type="url"
                value={localContact.whatsappLink || ''}
                onChange={(e) => updateField('whatsappLink', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="https://wa.me/221771234567"
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Links */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-night">Réseaux sociaux</h3>
            <button
              onClick={addSocialLink}
              className="flex items-center gap-2 px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/90 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Ajouter un réseau
            </button>
          </div>

          <div className="space-y-4">
            {(localContact.socialLinks || []).map((link: any, index: number) => (
              <div key={index} className="p-4 bg-ivory rounded-lg border border-cloud">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-night">Réseau {index + 1}</h4>
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-night mb-2">
                      Plateforme
                    </label>
                    <select
                      value={link.platform || 'Facebook'}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Custom">Personnalisé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-night mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={link.url || ''}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                      placeholder="https://facebook.com/cocoti"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-night mb-2">
                      Icône (emoji)
                    </label>
                    <input
                      type="text"
                      value={link.icon || ''}
                      onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                      placeholder="📘"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hours */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-night">Horaires d'ouverture</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Titre des horaires
              </label>
              <input
                type="text"
                value={localContact.hours?.title || ''}
                onChange={(e) => updateNestedField('hours', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Horaires d'ouverture"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Horaires semaine
              </label>
              <input
                type="text"
                value={localContact.hours?.description || ''}
                onChange={(e) => updateNestedField('hours', 'description', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Lundi - Vendredi: 9h00 - 18h00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-night mb-2">
                Horaires weekend
              </label>
              <input
                type="text"
                value={localContact.hours?.weekend || ''}
                onChange={(e) => updateNestedField('hours', 'weekend', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta transition-colors bg-white"
                placeholder="Samedi: 10h00 - 16h00"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-cloud">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  );
}