"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { HeartIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePublicProjects, PublicProject } from "@/hooks/usePublicProjects";
import { useCausesCarouselConfig } from "@/hooks/useCausesCarouselConfig";

// Utiliser le type PublicProject du hook
type Cause = PublicProject;

type CausesSectionProps = {
  locale: 'fr' | 'en';
};

export default function CausesSection({ locale }: CausesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { projects, loading, error, hasApiUrl } = usePublicProjects(locale);
  const { config: carouselConfig } = useCausesCarouselConfig(locale);


  // Auto-rotation des causes
  useEffect(() => {
    if (projects.length > 0 && carouselConfig.autoRotate) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, carouselConfig.rotationSpeed * 1000);

      return () => clearInterval(interval);
    }
  }, [projects.length, carouselConfig.autoRotate, carouselConfig.rotationSpeed]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Ne pas afficher la section si désactivée dans le CMS
  if (!carouselConfig.enabled) {
    return null;
  }

  // Ne pas afficher la section si pas de données
  // Si en erreur ou vide, simplement ne rien afficher
  if ((!loading && projects.length === 0) || error) {
    return null;
  }
  
  // Si en train de charger et qu'il y aura des données, afficher un loader
  // Sinon ne rien afficher
  if (loading && projects.length === 0) {
    return null; // Pas de loader si on ne sait pas encore s'il y aura des données
  }


  return (
    <section className="section-padding bg-white">
      <div className="container">
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-night mb-4 sm:text-4xl font-inter">
            {carouselConfig.title}
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl font-inter">
            {carouselConfig.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {projects.map((cause, index) => (
                <div key={cause.id} className="w-full flex-shrink-0 px-4">
                  <motion.div
                    className="bg-white rounded-2xl border border-cloud shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex h-48">
                      {/* Image Section - Left */}
                      <div className="relative w-1/3 flex-shrink-0">
                        <img
                          src={cause.image}
                          alt={cause.title}
                          className="w-full h-full object-cover"
                        />
                        {cause.urgent && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-coral text-white px-2 py-1 rounded-full text-xs font-semibold font-inter">
                              {locale === 'fr' ? 'Urgent' : 'Urgent'}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 text-night px-2 py-1 rounded-full text-xs font-semibold font-inter">
                            {cause.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Section - Right */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-night mb-2 font-inter">
                            {cause.title}
                          </h3>
                          <p className="text-sm text-ink-muted mb-4 line-clamp-2 font-inter">
                            {cause.description}
                          </p>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs font-inter">
                            <span className="text-ink-muted">
                              {locale === 'fr' ? 'Collecté' : 'Raised'}
                            </span>
                            <span className="font-semibold text-night">
                              {cause.raised} / {cause.target}
                            </span>
                          </div>
                          
                          <div className="w-full bg-cloud rounded-full h-1.5">
                            <motion.div
                              className="bg-gradient-to-r from-sunset to-magenta h-1.5 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${cause.progress}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>

                          <div className="flex items-center justify-between font-inter">
                            <span className="text-xs text-ink-muted">
                              {cause.progress}% {locale === 'fr' ? 'atteint' : 'reached'}
                            </span>
                            <a 
                              href={`/${locale}/money-pool/${cause.id}`}
                              className="flex items-center gap-1 bg-gradient-to-r from-sunset to-magenta text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:shadow-lg transition-all"
                            >
                              <HeartIcon className="h-3 w-3" />
                              {locale === 'fr' ? 'Soutenir' : 'Support'}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all z-10"
            aria-label={locale === 'fr' ? 'Précédent' : 'Previous'}
          >
            <ChevronLeftIcon className="h-6 w-6 text-night" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all z-10"
            aria-label={locale === 'fr' ? 'Suivant' : 'Next'}
          >
            <ChevronRightIcon className="h-6 w-6 text-night" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-magenta scale-110'
                    : 'bg-cloud hover:bg-magenta/50'
                }`}
                aria-label={`${locale === 'fr' ? 'Aller à la slide' : 'Go to slide'} ${index + 1}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
