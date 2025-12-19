"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getAppStoreLink } from "@/utils/device";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
} as const;

type PricingSectionProps = {
  pricing: {
    title: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      description: string;
      features: string[];
      cta: string;
      highlight?: boolean;
    }>;
    comparisonTable?: {
      features: Array<{
        label: string;
        free: string;
        premium: string;
        community: string;
      }>;
    };
    apps?: Array<{ store: string; label: string; href: string }>;
  };
  locale?: 'fr' | 'en';
};

export default function PricingSection({ pricing, locale = 'fr' }: PricingSectionProps) {
  // Si on a un tableau de comparaison, l'afficher, sinon afficher les cartes
  const hasComparisonTable = pricing.comparisonTable && pricing.comparisonTable.features && pricing.comparisonTable.features.length > 0;

  // URL du store pour redirection - Éviter les problèmes d'hydratation
  const [appStoreLink, setAppStoreLink] = useState("");

  useEffect(() => {
    setAppStoreLink(getAppStoreLink(pricing.apps || []));
  }, [pricing.apps]);

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="container space-y-10">
        <motion.div className="max-w-2xl space-y-4" {...fadeInUp}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">{pricing.title}</h2>
        </motion.div>

        {hasComparisonTable ? (
          // Style cartes verticales avec features intégrées
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-7xl mx-auto">
            {pricing.plans && Array.isArray(pricing.plans) && pricing.plans.map((plan, planIndex) => {
              // Design avec couleurs exactes de la charte Cocoti
              const isPremium = plan.highlight;
              const planColors = isPremium
                ? {
                  // Premium - Gradient magenta/sunset (couleurs principales)
                  title: 'text-night',
                  priceBar: 'bg-gradient-to-r from-magenta to-sunset',
                  featuresBg: 'bg-gradient-to-br from-magenta/10 to-sunset/10 border border-magenta/30',
                  button: 'bg-gradient-to-r from-magenta to-sunset text-white shadow-lg shadow-magenta/20 hover:shadow-xl',
                  checkColor: 'text-magenta',
                  xColor: 'text-ink-muted'
                }
                : planIndex === 0
                  ? {
                    // Free - Sunset (orange)
                    title: 'text-night',
                    priceBar: 'bg-sunset',
                    featuresBg: 'bg-sand border border-cloud',
                    button: 'bg-sunset text-white hover:bg-sunset/90 shadow-md',
                    checkColor: 'text-sunset',
                    xColor: 'text-ink-muted'
                  }
                  : {
                    // Community - Magenta
                    title: 'text-night',
                    priceBar: 'bg-magenta',
                    featuresBg: 'bg-ivory border border-cloud',
                    button: 'bg-magenta text-white hover:bg-magenta/90 shadow-md',
                    checkColor: 'text-magenta',
                    xColor: 'text-ink-muted'
                  };

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: planIndex * 0.1, duration: 0.5 }}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${plan.highlight ? 'scale-105 border-2 border-magenta' : 'border border-cloud'
                    }`}
                >
                  {/* Titre du plan */}
                  <div className="p-6 pb-4">
                    <h3 className={`text-3xl font-bold ${planColors.title}`}>
                      {plan.name}
                    </h3>
                  </div>

                  {/* Barre de prix */}
                  <div className={`${planColors.priceBar} px-6 py-4`}>
                    <div className="text-white">
                      <div className="text-2xl font-bold">{plan.price}</div>
                      <div className="text-sm opacity-90">{plan.period}</div>
                    </div>
                  </div>

                  {/* Section des features */}
                  <div className={`${planColors.featuresBg} px-6 py-6 space-y-3 rounded-b-2xl`}>
                    {pricing.comparisonTable?.features.map((feature, featureIndex) => {
                      // Déterminer la valeur pour ce plan
                      let featureValue = '';
                      if (planIndex === 0) featureValue = feature.free;
                      else if (planIndex === 1) featureValue = feature.premium;
                      else featureValue = feature.community;

                      // Vérifier si la feature est incluse (pas "Non disponible", "Non inclus", etc.)
                      // Utiliser des regex pour matcher des mots complets, pas des sous-chaînes
                      const lowerValue = featureValue.toLowerCase().trim();

                      // Patterns d'exclusion : valeurs qui indiquent que la feature n'est PAS disponible
                      const exclusionPatterns = [
                        /^non\s+(disponible|inclus|incluse|disponibles|incluses|supporté|supportée)$/i, // "Non disponible", "Non inclus"
                        /^non$/i, // Juste "Non"
                        /^n\/a$/i, // "N/A"
                        /^aucun$/i, // "Aucun"
                        /^aucune$/i, // "Aucune"
                        /^pas\s+(disponible|inclus|incluse)$/i, // "Pas disponible", "Pas inclus"
                      ];

                      // Vérifier si la valeur correspond à un pattern d'exclusion
                      const isExcluded = exclusionPatterns.some(pattern => pattern.test(lowerValue)) || lowerValue === '';

                      // Si la valeur contient "uniquement" mais n'est pas une exclusion explicite,
                      // c'est une limitation mais la feature est disponible (ex: "Privée uniquement")
                      const isIncluded = !isExcluded;

                      return (
                        <div key={featureIndex} className="flex items-start gap-3">
                          {isIncluded ? (
                            <CheckIcon className={`w-5 h-5 ${planColors.checkColor} flex-shrink-0 mt-0.5`} />
                          ) : (
                            <XMarkIcon className={`w-5 h-5 ${planColors.xColor} flex-shrink-0 mt-0.5`} />
                          )}
                          <span className="text-night text-sm leading-relaxed">
                            <span className="font-semibold">{feature.label}:</span>{' '}
                            <span
                              dangerouslySetInnerHTML={{
                                __html: featureValue.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              }}
                            />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bouton CTA */}
                  <div className="p-6 pt-4">
                    {plan.cta.includes('disponible') || plan.cta.includes('Available') || plan.cta.includes('Not Available') ? (
                      <button
                        disabled
                        className="block w-full text-center rounded-xl px-6 py-3 font-semibold transition-all bg-cloud text-ink-muted cursor-not-allowed opacity-60"
                      >
                        {plan.cta}
                      </button>
                    ) : (
                      <a
                        href={appStoreLink}
                        className={`block w-full text-center rounded-xl px-6 py-3 font-semibold transition-all ${planColors.button} hover:scale-105 transform`}
                      >
                        {plan.cta}
                      </a>
                    )}
                  </div>

                  {/* Badge populaire */}
                  {plan.highlight && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-magenta to-sunset text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        ⭐ Populaire
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Affichage en cartes (fallback)
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 max-w-7xl mx-auto">
            {pricing.plans && Array.isArray(pricing.plans) && pricing.plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`rounded-3xl border p-6 shadow-sm transition relative ${plan.highlight
                  ? "border-magenta bg-gradient-to-br from-magenta/10 to-sunset/10 scale-110 shadow-xl shadow-magenta/20"
                  : "border-cloud bg-ivory/80"
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-magenta to-sunset text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Populaire
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className={`text-xl font-semibold ${plan.highlight ? 'text-magenta' : 'text-night'}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    <span className={`text-3xl font-bold ${plan.highlight ? 'text-magenta' : 'text-night'}`}>
                      {plan.price}
                    </span>
                    <span className="text-sm text-ink-muted ml-1">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted leading-relaxed">{plan.description}</p>
                </div>

                <ul className="mt-6 space-y-3 text-sm text-night">
                  {plan.features && Array.isArray(plan.features) && plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckIcon className="h-5 w-5 text-magenta flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={appStoreLink}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${plan.highlight
                    ? "bg-gradient-to-r from-sunset to-magenta text-white shadow-lg shadow-magenta/20 hover:shadow-xl hover:scale-105 transform"
                    : "border border-magenta text-magenta hover:bg-magenta hover:text-white"
                    }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
