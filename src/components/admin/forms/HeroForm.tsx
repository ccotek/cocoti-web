"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type HeroFormProps = {
  content: any;
  onSave: (data: any) => void;
  onCancel: () => void;
};

export default function HeroForm({ content, onSave, onCancel }: HeroFormProps) {
  const [formData, setFormData] = useState({
    badge: content?.badge || '',
    title: content?.title || '',
    subtitle: content?.subtitle || '',
    download: content?.download || '',
    viewDashboard: content?.viewDashboard || '',
    viewDashboardLink: content?.viewDashboardLink || '',
    mockupAlt: content?.mockupAlt || '',
    apps: content?.apps || [{ store: '', label: '', href: '' }],
    stats: content?.stats || [{ value: '', label: '' }]
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const addApp = () => {
    setFormData(prev => ({
      ...prev,
      apps: [...prev.apps, { store: '', label: '', href: '' }]
    }));
  };

  const removeApp = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      apps: prev.apps.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateApp = (index: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      apps: prev.apps.map((app: any, i: number) => 
        i === index ? { ...app, [field]: value } : app
      )
    }));
  };

  const addStat = () => {
    setFormData((prev: any) => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      stats: prev.stats.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateStat = (index: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      stats: prev.stats.map((stat: any, i: number) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Badge
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="L'app qui digitalise la solidarité africaine"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre principal
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Réinventons les tontines et projets collectifs."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sous-titre
        </label>
        <textarea
          value={formData.subtitle}
          onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Avec Cocoti, gérez vos tontines, cagnottes et projets en toute simplicité..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte bouton téléchargement
          </label>
          <input
            type="text"
            value={formData.download}
            onChange={(e) => setFormData(prev => ({ ...prev, download: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Télécharger l'app"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte bouton dashboard
          </label>
          <input
            type="text"
            value={formData.viewDashboard}
            onChange={(e) => setFormData(prev => ({ ...prev, viewDashboard: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Voir le dashboard"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lien dashboard
        </label>
        <input
          type="url"
          value={formData.viewDashboardLink}
          onChange={(e) => setFormData(prev => ({ ...prev, viewDashboardLink: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://join.cocoti.app"
        />
      </div>

      {/* Apps */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Applications</h3>
          <button
            type="button"
            onClick={addApp}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {formData.apps.map((app: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store
                </label>
                <input
                  type="text"
                  value={app.store}
                  onChange={(e) => updateApp(index, 'store', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="App Store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={app.label}
                  onChange={(e) => updateApp(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Disponible bientôt"
                />
              </div>
              <div className="flex items-end">
                <input
                  type="url"
                  value={app.href}
                  onChange={(e) => updateApp(index, 'href', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://apps.apple.com/"
                />
                <button
                  type="button"
                  onClick={() => removeApp(index)}
                  className="ml-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Statistiques</h3>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-4">
          {formData.stats.map((stat: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valeur
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, 'value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12K+"
                />
              </div>
              <div className="flex items-end">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, 'label', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Membres accompagnés"
                />
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="ml-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
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
    </motion.form>
  );
}
