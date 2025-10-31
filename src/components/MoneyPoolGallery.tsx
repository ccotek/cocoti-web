"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

interface MoneyPoolGalleryProps {
  images?: string[];
  videos?: string[];
  alt: string;
  className?: string;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
];

const MoneyPoolGallery: React.FC<MoneyPoolGalleryProps> = ({ 
  images, 
  videos = [], 
  alt, 
  className = "" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Créer la liste des médias (images + vidéos)
  const safeImages = images || [];
  const safeVideos = videos || [];
  
  // Prendre les 3 premières images
  const existingImages = safeImages.slice(0, 3).map(url => ({ type: 'image' as const, url, alt }));
  
  // Ajouter des images par défaut seulement si on n'a pas assez d'images
  const defaultImagesNeeded = Math.max(0, 3 - existingImages.length);
  const defaultImages = Array.from({ length: defaultImagesNeeded }, (_, i) => ({
    type: 'image' as const,
    url: DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
    alt: `${alt} - Image ${existingImages.length + i + 1}`
  }));
  
  // Ajouter les vidéos (max 2)
  const videoItems = safeVideos.slice(0, 2).map(url => ({ type: 'video' as const, url, alt }));
  
  const mediaItems: MediaItem[] = [
    ...existingImages,
    ...defaultImages,
    ...videoItems
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (mediaItems.length === 0) {
    return (
      <div className={`relative w-full h-64 bg-gradient-to-br from-magenta/20 to-sunset/20 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-magenta/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <PlayIcon className="h-8 w-8 text-magenta" />
          </div>
          <p className="text-magenta font-semibold text-sm">Cagnotte Solidaire</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Galerie principale */}
      <div className={`relative w-full h-64 rounded-lg overflow-hidden group cursor-pointer ${className}`} onClick={openModal}>
        {/* Image/Vidéo principale */}
        <div className="relative w-full h-full">
          {mediaItems[currentIndex].type === 'image' ? (
            <Image
              src={mediaItems[currentIndex].url}
              alt={mediaItems[currentIndex].alt || alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
              <video
                src={mediaItems[currentIndex].url}
                className="w-full h-full object-cover"
                muted
                loop
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <PlayIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          )}
          
          {/* Overlay avec informations */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-semibold">
                {mediaItems[currentIndex].type === 'image' ? '📷 Image' : '🎥 Vidéo'} {currentIndex + 1}/{mediaItems.length}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicateurs */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal plein écran */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-[80vh]">
            {mediaItems[currentIndex].type === 'image' ? (
              <Image
                src={mediaItems[currentIndex].url}
                alt={mediaItems[currentIndex].alt || alt}
                fill
                className="object-contain"
              />
            ) : (
              <video
                src={mediaItems[currentIndex].url}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            )}
          </div>

          {/* Navigation dans le modal */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicateurs dans le modal */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {mediaItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default MoneyPoolGallery;
