"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { XMarkIcon, PhotoIcon, CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

type CreateMoneyPoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
};

export default function CreateMoneyPoolModal({ isOpen, onClose, locale }: CreateMoneyPoolModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    category: '',
    endDate: '',
    image: null as File | null,
    imagePreview: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'education', label: locale === 'fr' ? 'Éducation' : 'Education' },
    { value: 'health', label: locale === 'fr' ? 'Santé' : 'Health' },
    { value: 'development', label: locale === 'fr' ? 'Développement' : 'Development' },
    { value: 'agriculture', label: locale === 'fr' ? 'Agriculture' : 'Agriculture' },
    { value: 'entrepreneurship', label: locale === 'fr' ? 'Entrepreneuriat' : 'Entrepreneurship' },
    { value: 'energy', label: locale === 'fr' ? 'Énergie' : 'Energy' },
    { value: 'other', label: locale === 'fr' ? 'Autre' : 'Other' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ici on redirigerait vers le dashboard avec les données du formulaire
      // Pour l'instant, on simule une soumission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers le dashboard
      window.open(`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn'}/${locale}`, '_blank');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      target: '',
      category: '',
      endDate: '',
      image: null,
      imagePreview: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sunset to-magenta p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-inter">
                    {locale === 'fr' ? 'Créer une cagnotte' : 'Create a Money Pool'}
                  </h2>
                  <p className="text-white/80 mt-1 font-inter">
                    {locale === 'fr' 
                      ? 'Rassemblez votre communauté autour d\'une cause qui vous tient à cœur'
                      : 'Gather your community around a cause that matters to you'
                    }
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Titre */}
              <div>
                <label className="block text-sm font-semibold text-night mb-2 font-inter">
                  {locale === 'fr' ? 'Titre de votre cagnotte' : 'Money Pool Title'} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={locale === 'fr' ? 'Ex: École primaire de Ndiaganiao' : 'Ex: Ndiaganiao Primary School'}
                  className="w-full px-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-night mb-2 font-inter">
                  {locale === 'fr' ? 'Description' : 'Description'} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={locale === 'fr' 
                    ? 'Décrivez votre projet, son impact et pourquoi il est important...'
                    : 'Describe your project, its impact and why it\'s important...'
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all resize-none font-inter"
                  required
                />
              </div>

              {/* Objectif et Catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Objectif (FCFA)' : 'Target (FCFA)'} *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                    <input
                      type="number"
                      name="target"
                      value={formData.target}
                      onChange={handleInputChange}
                      placeholder="15000000"
                      className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Catégorie' : 'Category'} *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                    required
                  >
                    <option value="">{locale === 'fr' ? 'Sélectionnez une catégorie' : 'Select a category'}</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date de fin */}
              <div>
                <label className="block text-sm font-semibold text-night mb-2 font-inter">
                  {locale === 'fr' ? 'Date de fin' : 'End Date'} *
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                    required
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-night mb-2 font-inter">
                  {locale === 'fr' ? 'Image de couverture' : 'Cover Image'}
                </label>
                <div className="space-y-3">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: null, imagePreview: '' }))}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-cloud rounded-xl cursor-pointer hover:border-magenta transition-colors">
                      <PhotoIcon className="h-12 w-12 text-ink-muted mb-2" />
                      <p className="text-sm text-ink-muted font-inter">
                        {locale === 'fr' ? 'Cliquez pour ajouter une image' : 'Click to add an image'}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="bg-cloud/30 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-ink-muted hover:text-night transition-colors font-inter"
              >
                {locale === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {locale === 'fr' ? 'Création...' : 'Creating...'}
                  </div>
                ) : (
                  locale === 'fr' ? 'Créer la cagnotte' : 'Create Money Pool'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
