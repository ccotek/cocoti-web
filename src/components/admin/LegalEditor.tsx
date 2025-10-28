"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface LegalData {
  title: string;
  subtitle: string;
  sections: Array<{
    title: string;
    content: string;
    company?: CompanyInfo;
  }>;
}

interface LegalEditorProps {
  legal: LegalData;
  onUpdate: (data: LegalData) => Promise<{ success: boolean; error?: string }>;
  locale: 'fr' | 'en';
}

export default function LegalEditor({ legal, onUpdate, locale }: LegalEditorProps) {
  const [formData, setFormData] = useState<LegalData>(legal);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(legal);
  }, [legal]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const result = await onUpdate(formData);
      if (result.success) {
        setIsEditing(false);
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(legal);
    setIsEditing(false);
    setError(null);
  };


  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const updateSectionCompany = (index: number, field: keyof CompanyInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { 
          ...section, 
          company: { 
            ...section.company, 
            [field]: value 
          } 
        } : section
      )
    }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: '', content: '' }
      ]
    }));
  };

  const removeSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header avec boutons d'action */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-cloud text-ink-muted rounded-lg hover:bg-ivory transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="w-4 h-4 mr-2 inline" />
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg hover:shadow-glow transition-all disabled:opacity-50"
              >
                <CheckIcon className="w-4 h-4 mr-2 inline" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg hover:shadow-glow transition-all"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2 inline" />
              Modifier
            </button>
          )}
        </div>
      </div>


      {/* Sections légales */}
      <div className="bg-ivory rounded-2xl p-6 border border-cloud">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-night flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2 text-magenta" />
            {locale === 'fr' ? 'Sections légales' : 'Legal Sections'}
          </h4>
          {isEditing && (
            <button
              onClick={addSection}
              className="px-3 py-1 bg-magenta text-white rounded-lg hover:shadow-glow transition-all text-sm"
            >
              + Ajouter une section
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {formData.sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-4 border border-cloud"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-ink-muted">
                  Section {index + 1}
                </span>
                {isEditing && (
                  <button
                    onClick={() => removeSection(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                  disabled={!isEditing}
                  placeholder={locale === 'fr' ? 'Titre de la section' : 'Section title'}
                  className="w-full px-3 py-2 border border-cloud rounded-lg bg-white disabled:bg-ivory focus:ring-2 focus:ring-magenta focus:border-magenta font-medium"
                />
                
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                  disabled={!isEditing}
                  placeholder={locale === 'fr' ? 'Contenu de la section' : 'Section content'}
                  rows={4}
                  className="w-full px-3 py-2 border border-cloud rounded-lg bg-white disabled:bg-ivory focus:ring-2 focus:ring-magenta focus:border-magenta"
                />

                {/* Informations d'entreprise spécifiques à la section (pour Éditeur du site) */}
                {section.company && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-cloud">
                    <h5 className="text-sm font-medium text-night mb-3 flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2 text-magenta" />
                      {locale === 'fr' ? 'Informations spécifiques à cette section' : 'Section-specific information'}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">
                          {locale === 'fr' ? 'Nom' : 'Name'}
                        </label>
                        <input
                          type="text"
                          value={section.company.name}
                          onChange={(e) => updateSectionCompany(index, 'name', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-2 py-1 text-sm border border-cloud rounded bg-white disabled:bg-ivory focus:ring-1 focus:ring-magenta focus:border-magenta"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">
                          {locale === 'fr' ? 'Email' : 'Email'}
                        </label>
                        <input
                          type="email"
                          value={section.company.email}
                          onChange={(e) => updateSectionCompany(index, 'email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-2 py-1 text-sm border border-cloud rounded bg-white disabled:bg-ivory focus:ring-1 focus:ring-magenta focus:border-magenta"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">
                          {locale === 'fr' ? 'Téléphone' : 'Phone'}
                        </label>
                        <input
                          type="tel"
                          value={section.company.phone}
                          onChange={(e) => updateSectionCompany(index, 'phone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-2 py-1 text-sm border border-cloud rounded bg-white disabled:bg-ivory focus:ring-1 focus:ring-magenta focus:border-magenta"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink-muted mb-1">
                          {locale === 'fr' ? 'Adresse' : 'Address'}
                        </label>
                        <textarea
                          value={section.company.address}
                          onChange={(e) => updateSectionCompany(index, 'address', e.target.value)}
                          disabled={!isEditing}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-cloud rounded bg-white disabled:bg-ivory focus:ring-1 focus:ring-magenta focus:border-magenta"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
