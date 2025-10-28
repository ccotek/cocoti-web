"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useContent, ContentData } from "@/hooks/useContent";

type GenericSectionFormProps = {
  section: string;
  sectionTitle: string;
  sectionDescription: string;
  onSave: (data: any) => void;
  onCancel: () => void;
  locale: 'fr' | 'en';
};

export default function GenericSectionForm({ 
  section, 
  sectionTitle, 
  sectionDescription, 
  onSave, 
  onCancel,
  locale 
}: GenericSectionFormProps) {
  const { content, updateContent } = useContent(locale);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content && content[section as keyof typeof content]) {
      const sectionData = content[section as keyof typeof content] as any;
      // Pour la section hero, s'assurer que le champ image existe
      if (section === 'hero') {
        if (!sectionData.image) {
          sectionData.image = 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=720&q=80';
        }
      }
      setFormData(sectionData);
    }
  }, [content, section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      
      const result = await updateContent(section as keyof ContentData, formData);
      if (result.success) {
        onSave(formData);
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: string, index: number, subField: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) => 
        i === index ? { ...item, [subField]: value } : item
      )
    }));
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultItem]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const renderField = (key: string, value: any, path: string = '') => {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      return (
        <div key={fullPath}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          {key === 'image' ? (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      const result = await response.json();
                      
                      if (result.success) {
                        handleFieldChange(key, result.url);
                      } else {
                        console.error('Échec de l\'upload:', result.error);
                        alert('Erreur lors de l\'upload: ' + result.error);
                      }
                    } catch (error) {
                      console.error('Erreur lors de l\'upload:', error);
                      alert('Erreur lors de l\'upload: ' + error);
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Ou entrez une URL :</p>
              <input
                type="url"
                value={formData[key] || ''}
                onChange={(e) => handleFieldChange(key, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
              {formData[key] && (
                <div className="mt-2">
                  <img 
                    src={formData[key]} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ) : value.length > 100 ? (
            <textarea
              value={formData[key] || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type="text"
              value={formData[key] || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      );
    }
    
    if (typeof value === 'number') {
      return (
        <div key={fullPath}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            type="number"
            value={formData[key] || ''}
            onChange={(e) => handleFieldChange(key, Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div key={fullPath}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            <button
              type="button"
              onClick={() => addArrayItem(key, {})}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
            >
              + Ajouter
            </button>
          </div>
          <div className="space-y-4">
            {(formData[key] || []).map((item: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(item).map(subKey => (
                    <div key={subKey}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {subKey.charAt(0).toUpperCase() + subKey.slice(1)}
                      </label>
                      <input
                        type="text"
                        value={item[subKey] || ''}
                        onChange={(e) => handleArrayFieldChange(key, index, subKey, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem(key, index)}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={fullPath}>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-gray-200">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderField(subKey, subValue, fullPath)
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (!content) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du contenu...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(formData).map(([key, value]) => 
          renderField(key, value)
        )}
        

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
