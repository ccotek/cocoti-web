"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { XMarkIcon, PhotoIcon, CalendarIcon, CurrencyDollarIcon, PhoneIcon, UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

type CreateMoneyPoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
};

type Step = 'form' | 'success';

export default function CreateMoneyPoolModal({ isOpen, onClose, locale }: CreateMoneyPoolModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'general',
    endDate: '',
    organizerName: '',
    organizerPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation simple
      if (!formData.title.trim()) {
        throw new Error(locale === 'fr' ? 'Le titre est requis' : 'Title is required');
      }
      if (!formData.description.trim()) {
        throw new Error(locale === 'fr' ? 'La description est requise' : 'Description is required');
      }
      if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
        throw new Error(locale === 'fr' ? 'Le montant cible doit être supérieur à 0' : 'Target amount must be greater than 0');
      }

      // Simuler la création (pour l'instant, rediriger vers le dashboard)
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn';
      window.open(`${dashboardUrl}/${locale}`, '_blank');
      
      setCurrentStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('form');
    setError('');
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      category: 'general',
      endDate: '',
      organizerName: '',
      organizerPhone: ''
    });
    onClose();
  };

  const categories = [
    { value: 'general', label: locale === 'fr' ? 'Général' : 'General' },
    { value: 'wedding', label: locale === 'fr' ? 'Mariage' : 'Wedding' },
    { value: 'birthday', label: locale === 'fr' ? 'Anniversaire' : 'Birthday' },
    { value: 'charity', label: locale === 'fr' ? 'Charité' : 'Charity' },
    { value: 'education', label: locale === 'fr' ? 'Éducation' : 'Education' },
    { value: 'medical', label: locale === 'fr' ? 'Médical' : 'Medical' },
    { value: 'business', label: locale === 'fr' ? 'Business' : 'Business' },
    { value: 'other', label: locale === 'fr' ? 'Autre' : 'Other' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'fr' ? 'Créer une cagnotte' : 'Create a Money Pool'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {currentStep === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Titre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Titre de la cagnotte' : 'Money Pool Title'} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                      placeholder={locale === 'fr' ? 'Ex: Cagnotte pour le mariage de Marie' : 'Ex: Wedding fund for Marie'}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Description' : 'Description'} *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                      placeholder={locale === 'fr' ? 'Décrivez votre projet...' : 'Describe your project...'}
                      required
                    />
                  </div>

                  {/* Montant cible */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Montant cible (FCFA)' : 'Target Amount (FCFA)'} *
                    </label>
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      min="1"
                      step="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                      placeholder="100000"
                      required
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Catégorie' : 'Category'}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date de fin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'fr' ? 'Date de fin (optionnel)' : 'End Date (optional)'}
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                    />
                  </div>

                  {/* Organisateur */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'fr' ? 'Nom de l\'organisateur' : 'Organizer Name'}
                      </label>
                      <input
                        type="text"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                        placeholder={locale === 'fr' ? 'Votre nom' : 'Your name'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {locale === 'fr' ? 'Téléphone' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        name="organizerPhone"
                        value={formData.organizerPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                        placeholder="+221 77 123 45 67"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {locale === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        locale === 'fr' ? 'Création...' : 'Creating...'
                      ) : (
                        locale === 'fr' ? 'Créer la cagnotte' : 'Create Money Pool'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {currentStep === 'success' && (
                <div className="text-center py-8">
                  <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {locale === 'fr' ? 'Cagnotte créée !' : 'Money Pool Created!'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {locale === 'fr' 
                      ? 'Votre cagnotte a été créée avec succès. Vous allez être redirigé vers le dashboard pour la gérer.'
                      : 'Your money pool has been created successfully. You will be redirected to the dashboard to manage it.'
                    }
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    {locale === 'fr' ? 'Fermer' : 'Close'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
