"use client";

import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { usePublicProjects } from '@/hooks/usePublicProjects';
import { useCausesCarouselConfig } from '@/hooks/useCausesCarouselConfig';
import MoneyPoolCard from '@/components/MoneyPoolCard';
import { getAppStoreLink } from '@/utils/device';

type CausesSectionProps = {
  locale: 'fr' | 'en';
  apps?: Array<{ store: string; href: string }>;
};

export default function CausesSection({ locale, apps = [] }: CausesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appStoreLink, setAppStoreLink] = useState('#');
  const { projects, loading, error } = usePublicProjects(locale);
  const { config: carouselConfig } = useCausesCarouselConfig(locale);

  // Déterminer le lien du store côté client
  useEffect(() => {
    setAppStoreLink(getAppStoreLink(apps));
  }, [apps]);

  // Auto-rotation des causes - uniquement pour desktop
  useEffect(() => {
    if (projects.length > 0 && carouselConfig.autoRotate) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      }, carouselConfig.rotationSpeed * 1000);

      return () => clearInterval(interval);
    }
  }, [projects.length, carouselConfig.autoRotate, carouselConfig.rotationSpeed]);

  // Reset currentIndex quand les projets changent
  useEffect(() => {
    if (projects.length > 0) {
      setCurrentIndex(0);
    }
  }, [projects.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!carouselConfig.enabled || (!loading && projects.length === 0) || error) {
    return null;
  }

  if (loading && projects.length === 0) {
    return null;
  }

  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container">
        <motion.div
          className="mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-night mb-4 font-inter tracking-tight">
            {carouselConfig.title}
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl font-inter">
            {carouselConfig.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          {/* Mobile Snap Scroll Container */}
          <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4 gap-4">
            {projects.map((cause) => (
              <div key={cause.id} className="min-w-[85vw] snap-center">
                <MoneyPoolCard
                  {...cause}
                  locale={locale}
                  layout="vertical"
                  currency="XAF"
                />
              </div>
            ))}
          </div>

          {/* Desktop Classic Carousel */}
          <div className="hidden md:block overflow-hidden rounded-[2.5rem] relative">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {projects.map((cause) => (
                <div key={cause.id} className="w-full flex-shrink-0 px-4">
                  <MoneyPoolCard
                    {...cause}
                    locale={locale}
                    layout="horizontal"
                    currency="XAF"
                  />
                </div>
              ))}
            </motion.div>

            {/* Navigation Arrows - Desktop Only */}
            <button
              onClick={prevSlide}
              className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center justify-center bg-white/90 hover:bg-white shadow-xl rounded-full w-14 h-14 transition-all z-10 border border-cloud"
              aria-label={locale === 'fr' ? 'Précédent' : 'Previous'}
            >
              <ChevronLeftIcon className="h-6 w-6 text-night" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center bg-white/90 hover:bg-white shadow-xl rounded-full w-14 h-14 transition-all z-10 border border-cloud"
              aria-label={locale === 'fr' ? 'Suivant' : 'Next'}
            >
              <ChevronRightIcon className="h-6 w-6 text-night" />
            </button>
          </div>

          {/* Dots Indicator - Responsive sizing */}
          <div className="flex justify-center mt-4 md:mt-8 gap-3">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${index === currentIndex
                  ? 'w-10 h-2.5 bg-magenta rounded-full'
                  : 'w-2.5 h-2.5 bg-cloud rounded-full hover:bg-magenta/30'
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
