"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CurrencyDollarIcon, 
  PlusIcon, 
  XMarkIcon, 
  CheckIcon,
  StarIcon
} from "@heroicons/react/24/outline";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

interface PricingEditorProps {
  pricing: {
    title: string;
    plans: PricingPlan[];
  };
  onUpdate: (pricing: { title: string; plans: PricingPlan[] }) => Promise<{ success: boolean; error?: string }>;
  locale: 'fr' | 'en';
}

export default function PricingEditor({ pricing, onUpdate, locale }: PricingEditorProps) {
  const [localPricing, setLocalPricing] = useState(pricing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour la config locale quand les props changent
  useEffect(() => {
    setLocalPricing(pricing);
  }, [pricing]);

  const handleTitleChange = (value: string) => {
    setLocalPricing(prev => ({ ...prev, title: value }));
  };

  const handlePlanChange = (index: number, field: keyof PricingPlan, value: any) => {
    setLocalPricing(prev => ({
      ...prev,
      plans: prev.plans.map((plan, i) => 
        i === index ? { ...plan, [field]: value } : plan
      )
    }));
  };

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    setLocalPricing(prev => ({
      ...prev,
      plans: prev.plans.map((plan, i) => 
        i === planIndex 
          ? {
              ...plan,
              features: plan.features.map((feature, j) => 
                j === featureIndex ? value : feature
              )
            }
          : plan
      )
    }));
  };

  const addFeature = (planIndex: number) => {
    setLocalPricing(prev => ({
      ...prev,
      plans: prev.plans.map((plan, i) => 
        i === planIndex 
          ? { ...plan, features: [...plan.features, ''] }
          : plan
      )
    }));
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    setLocalPricing(prev => ({
      ...prev,
      plans: prev.plans.map((plan, i) => 
        i === planIndex 
          ? {
              ...plan,
              features: plan.features.filter((_, j) => j !== featureIndex)
            }
          : plan
      )
    }));
  };

  const addPlan = () => {
    const newPlan: PricingPlan = {
      name: locale === 'fr' ? 'Nouveau Plan' : 'New Plan',
      price: '0 FCFA',
      period: locale === 'fr' ? 'par mois' : 'per month',
      description: locale === 'fr' ? 'Description du plan' : 'Plan description',
      features: [locale === 'fr' ? 'Fonctionnalité 1' : 'Feature 1'],
      cta: locale === 'fr' ? 'Commencer' : 'Get Started'
    };

    setLocalPricing(prev => ({
      ...prev,
      plans: [...prev.plans, newPlan]
    }));
  };

  const removePlan = (index: number) => {
    setLocalPricing(prev => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await onUpdate(localPricing);
      if (!result.success) {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Title */}
      <div className="bg-ivory p-4 rounded-lg">
        <label className="block">
          <div className="font-medium text-night mb-2">
            {locale === 'fr' ? 'Titre de la section' : 'Section Title'}
          </div>
          <input
            type="text"
            value={localPricing.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
            placeholder={locale === 'fr' ? 'Ex: Des tarifs pensés pour votre croissance' : 'Ex: Pricing built for growth'}
          />
        </label>
      </div>

      {/* Plans */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-night">
            {locale === 'fr' ? 'Plans tarifaires' : 'Pricing Plans'}
          </h3>
          <button
            onClick={addPlan}
            className="flex items-center space-x-2 px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta/90 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>{locale === 'fr' ? 'Ajouter un plan' : 'Add Plan'}</span>
          </button>
        </div>

        {localPricing.plans.map((plan, planIndex) => (
          <motion.div
            key={planIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-cloud rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h4 className="text-lg font-semibold text-night">
                  {locale === 'fr' ? 'Plan' : 'Plan'} {planIndex + 1}
                </h4>
                {plan.highlight && (
                  <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    <StarIcon className="h-3 w-3" />
                    <span>{locale === 'fr' ? 'Populaire' : 'Popular'}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => removePlan(planIndex)}
                className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-night mb-1">
                  {locale === 'fr' ? 'Nom du plan' : 'Plan Name'}
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-night mb-1">
                  {locale === 'fr' ? 'Prix' : 'Price'}
                </label>
                <input
                  type="text"
                  value={plan.price}
                  onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                  placeholder="Ex: 15 FCFA"
                />
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium text-night mb-1">
                  {locale === 'fr' ? 'Période' : 'Period'}
                </label>
                <input
                  type="text"
                  value={plan.period}
                  onChange={(e) => handlePlanChange(planIndex, 'period', e.target.value)}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                  placeholder="Ex: par mois"
                />
              </div>

              {/* Highlight */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={plan.highlight || false}
                  onChange={(e) => handlePlanChange(planIndex, 'highlight', e.target.checked)}
                  className="h-4 w-4 text-magenta focus:ring-magenta border-cloud rounded"
                />
                <label className="text-sm font-medium text-night">
                  {locale === 'fr' ? 'Plan mis en avant' : 'Highlighted Plan'}
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-night mb-1">
                {locale === 'fr' ? 'Description' : 'Description'}
              </label>
              <textarea
                value={plan.description}
                onChange={(e) => handlePlanChange(planIndex, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                placeholder={locale === 'fr' ? 'Description du plan...' : 'Plan description...'}
              />
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-night">
                  {locale === 'fr' ? 'Fonctionnalités' : 'Features'}
                </label>
                <button
                  onClick={() => addFeature(planIndex)}
                  className="flex items-center space-x-1 text-magenta hover:text-magenta/80 text-sm"
                >
                  <PlusIcon className="h-3 w-3" />
                  <span>{locale === 'fr' ? 'Ajouter' : 'Add'}</span>
                </button>
              </div>
              <div className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                      placeholder={locale === 'fr' ? 'Fonctionnalité...' : 'Feature...'}
                    />
                    <button
                      onClick={() => removeFeature(planIndex, featureIndex)}
                      className="p-1 text-coral hover:bg-coral/10 rounded"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <label className="block text-sm font-medium text-night mb-1">
                {locale === 'fr' ? 'Texte du bouton' : 'Button Text'}
              </label>
              <input
                type="text"
                value={plan.cta}
                onChange={(e) => handlePlanChange(planIndex, 'cta', e.target.value)}
                className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                placeholder={locale === 'fr' ? 'Ex: Commencer maintenant' : 'Ex: Get Started Now'}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-cloud">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            locale === 'fr' ? 'Sauvegarde...' : 'Saving...'
          ) : (
            locale === 'fr' ? 'Sauvegarder' : 'Save'
          )}
        </button>
      </div>
    </div>
  );
}
