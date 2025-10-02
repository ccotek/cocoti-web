"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { XMarkIcon, PhotoIcon, CalendarIcon, CurrencyDollarIcon, PhoneIcon, UserIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { authService, User } from "@/services/authService";

type CreateMoneyPoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: 'fr' | 'en';
};

type Step = 'form' | 'phone' | 'otp' | 'registration';

export default function CreateMoneyPoolModal({ isOpen, onClose, locale }: CreateMoneyPoolModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('form');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpResendTimer, setOtpResendTimer] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    category: '',
    endDate: '',
    image: null as File | null,
    imagePreview: '',
    firstName: '',
    lastName: ''
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

  // Gestion de l'authentification
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const phoneValidation = authService.validatePhone(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.message || 'Numéro de téléphone invalide');
      setIsLoading(false);
      return;
    }

    const result = await authService.requestOTP(phone);
    if (result.success) {
      setCurrentStep('otp');
      setOtpResendTimer(60); // 60 secondes avant de pouvoir renvoyer
    } else {
      setError(result.message || 'Erreur lors de l\'envoi du code');
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const otpValidation = authService.validateOTP(otp);
    if (!otpValidation.isValid) {
      setError(otpValidation.message || 'Code OTP invalide');
      setIsLoading(false);
      return;
    }

    const result = await authService.verifyOTP(phone, otp);
    if (result.success) {
      if (result.user) {
        // Utilisateur existant - finaliser la création
        setUser(result.user);
        await handleFinalSubmit();
      } else {
        // Nouvel utilisateur - afficher le formulaire d'inscription
        setCurrentStep('registration');
      }
    } else {
      setError(result.message || 'Code OTP incorrect');
    }
    setIsLoading(false);
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError(locale === 'fr' ? 'Veuillez remplir tous les champs' : 'Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await authService.createUser({
      phone,
      firstName: formData.firstName,
      lastName: formData.lastName
    });

    if (result.success && result.user) {
      setUser(result.user);
      await handleFinalSubmit();
    } else {
      setError(result.message || 'Erreur lors de la création du compte');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    if (otpResendTimer > 0) return;
    
    setIsLoading(true);
    setError('');
    
    const result = await authService.requestOTP(phone);
    if (result.success) {
      setOtpResendTimer(60);
    } else {
      setError(result.message || 'Erreur lors du renvoi du code');
    }
    setIsLoading(false);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Simulation de la création de la money pool
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers le dashboard
      window.open(`${process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.cocoti.sn'}/${locale}`, '_blank');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError(locale === 'fr' ? 'Erreur lors de la création de la money pool' : 'Error creating money pool');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    setError('');

    // Validation de la description (minimum 10 mots)
    const descriptionValidation = authService.validateDescription(formData.description, 10);
    if (!descriptionValidation.isValid) {
      setError(descriptionValidation.message || 'Description trop courte');
      return;
    }

    // Validation des champs obligatoires
    if (!formData.title.trim() || !formData.target || !formData.category || !formData.endDate) {
      setError(locale === 'fr' ? 'Veuillez remplir tous les champs obligatoires' : 'Please fill in all required fields');
      return;
    }

    // Passer à l'étape d'authentification
    setCurrentStep('phone');
  };

  const resetForm = () => {
    setCurrentStep('form');
    setPhone('');
    setOtp('');
    setUser(null);
    setError('');
    setOtpResendTimer(0);
    setFormData({
      title: '',
      description: '',
      target: '',
      category: '',
      endDate: '',
      image: null,
      imagePreview: '',
      firstName: '',
      lastName: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Timer pour le renvoi d'OTP
  React.useEffect(() => {
    if (otpResendTimer > 0) {
      const timer = setTimeout(() => {
        setOtpResendTimer(otpResendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpResendTimer]);

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
                    {currentStep === 'form' && (locale === 'fr' ? 'Créer une cagnotte' : 'Create a Money Pool')}
                    {currentStep === 'phone' && (locale === 'fr' ? 'Connexion requise' : 'Login Required')}
                    {currentStep === 'otp' && (locale === 'fr' ? 'Vérification' : 'Verification')}
                    {currentStep === 'registration' && (locale === 'fr' ? 'Inscription' : 'Registration')}
                  </h2>
                  <p className="text-white/80 mt-1 font-inter">
                    {currentStep === 'form' && (locale === 'fr' 
                      ? 'Rassemblez votre communauté autour d\'une cause qui vous tient à cœur'
                      : 'Gather your community around a cause that matters to you'
                    )}
                    {currentStep === 'phone' && (locale === 'fr' 
                      ? 'Connectez-vous pour finaliser la création de votre cagnotte'
                      : 'Login to finalize your money pool creation'
                    )}
                    {currentStep === 'otp' && (locale === 'fr' 
                      ? 'Entrez le code reçu par SMS'
                      : 'Enter the code received by SMS'
                    )}
                    {currentStep === 'registration' && (locale === 'fr' 
                      ? 'Complétez votre profil pour finaliser la création'
                      : 'Complete your profile to finalize creation'
                    )}
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

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-inter">
                  {error}
                </div>
              )}

              {/* Étape 1: Formulaire de création */}
              {currentStep === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      {locale === 'fr' ? 'Description (min. 10 mots)' : 'Description (min. 10 words)'} *
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
                    <p className="text-xs text-ink-muted mt-1 font-inter">
                      {locale === 'fr' 
                        ? `${formData.description.trim().split(/\s+/).filter(w => w.length > 0).length} mots`
                        : `${formData.description.trim().split(/\s+/).filter(w => w.length > 0).length} words`
                      }
                    </p>
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
              )}

              {/* Étape 2: Numéro de téléphone */}
              {currentStep === 'phone' && (
                <form onSubmit={handleRequestOTP} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-night mb-2 font-inter">
                      {locale === 'fr' ? 'Numéro de téléphone' : 'Phone Number'} *
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={locale === 'fr' ? 'Ex: +221771234567' : 'Ex: +221771234567'}
                        className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                        required
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1 font-inter">
                      {locale === 'fr' 
                        ? 'Code de test: 123456'
                        : 'Test code: 123456'
                      }
                    </p>
                  </div>
                </form>
              )}

              {/* Étape 2: Vérification OTP */}
              {currentStep === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-night mb-2 font-inter">
                      {locale === 'fr' ? 'Code de vérification' : 'Verification Code'} *
                    </label>
                    <div className="relative">
                      <CheckCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter text-center text-lg tracking-widest"
                        required
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1 font-inter">
                      {locale === 'fr' 
                        ? `Code envoyé au ${phone}`
                        : `Code sent to ${phone}`
                      }
                    </p>
                  </div>
                </form>
              )}

              {/* Étape 3: Vérification OTP */}
              {currentStep === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-night mb-2 font-inter">
                      {locale === 'fr' ? 'Code de vérification' : 'Verification Code'} *
                    </label>
                    <div className="relative">
                      <CheckCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter text-center text-lg tracking-widest"
                        required
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1 font-inter">
                      {locale === 'fr' 
                        ? `Code envoyé au ${phone}`
                        : `Code sent to ${phone}`
                      }
                    </p>
                  </div>
                </form>
              )}

              {/* Étape 4: Inscription */}
              {currentStep === 'registration' && (
                <form onSubmit={handleRegistration} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Prénom' : 'First Name'} *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder={locale === 'fr' ? 'Votre prénom' : 'Your first name'}
                          className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Nom' : 'Last Name'} *
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder={locale === 'fr' ? 'Votre nom' : 'Your last name'}
                          className="w-full pl-10 pr-4 py-3 border border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}

            </div>

            {/* Footer */}
            <div className="bg-cloud/30 px-6 py-4 flex justify-between items-center">
              <div className="flex gap-2">
                {/* Bouton retour */}
                {currentStep !== 'form' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 'phone') setCurrentStep('form');
                      else if (currentStep === 'otp') setCurrentStep('phone');
                      else if (currentStep === 'registration') setCurrentStep('otp');
                    }}
                    className="px-4 py-2 text-ink-muted hover:text-night transition-colors font-inter"
                  >
                    {locale === 'fr' ? 'Retour' : 'Back'}
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 text-ink-muted hover:text-night transition-colors font-inter"
                >
                  {locale === 'fr' ? 'Annuler' : 'Cancel'}
                </button>

                {/* Bouton principal selon l'étape */}
                {currentStep === 'form' && (
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!formData.title.trim() || !formData.description.trim() || !formData.target || !formData.category || !formData.endDate}
                    className="px-8 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                  >
                    {locale === 'fr' ? 'Continuer' : 'Continue'}
                  </button>
                )}

                {currentStep === 'phone' && (
                  <button
                    type="submit"
                    onClick={handleRequestOTP}
                    disabled={isLoading || !phone.trim()}
                    className="px-8 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {locale === 'fr' ? 'Envoi...' : 'Sending...'}
                      </div>
                    ) : (
                      locale === 'fr' ? 'Envoyer le code' : 'Send Code'
                    )}
                  </button>
                )}

                {currentStep === 'otp' && (
                  <div className="flex gap-2">
                    {otpResendTimer > 0 ? (
                      <span className="px-4 py-2 text-sm text-ink-muted font-inter">
                        {locale === 'fr' ? `Renvoyer dans ${otpResendTimer}s` : `Resend in ${otpResendTimer}s`}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="px-4 py-2 text-magenta hover:text-magenta/80 transition-colors font-inter"
                      >
                        {locale === 'fr' ? 'Renvoyer' : 'Resend'}
                      </button>
                    )}
                    <button
                      type="submit"
                      onClick={handleVerifyOTP}
                      disabled={isLoading || !otp.trim()}
                      className="px-8 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {locale === 'fr' ? 'Vérification...' : 'Verifying...'}
                        </div>
                      ) : (
                        locale === 'fr' ? 'Vérifier' : 'Verify'
                      )}
                    </button>
                  </div>
                )}

                {currentStep === 'registration' && (
                  <button
                    type="submit"
                    onClick={handleRegistration}
                    disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim()}
                    className="px-8 py-2 bg-gradient-to-r from-sunset to-magenta text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {locale === 'fr' ? 'Création...' : 'Creating...'}
                      </div>
                    ) : (
                      locale === 'fr' ? 'Créer le compte' : 'Create Account'
                    )}
                  </button>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
