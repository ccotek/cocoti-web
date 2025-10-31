"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";

interface MoneyPoolImageProps {
  images?: string[];
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showDefaultIcon?: boolean;
}

export default function MoneyPoolImage({ 
  images, 
  alt, 
  className = "w-full h-full object-cover",
  fallbackClassName = "w-full h-full",
  showDefaultIcon = true
}: MoneyPoolImageProps) {
  // Image par défaut - une belle image de solidarité/communauté
  const defaultImage = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80";
  
  // Si pas d'images ou tableau vide, utiliser l'image par défaut
  const imageToShow = images && images.length > 0 ? images[0] : defaultImage;
  
  return (
    <div className={`relative ${fallbackClassName}`}>
      <img
        src={imageToShow}
        alt={alt}
        className={className}
        onError={(e) => {
          // Si l'image par défaut échoue aussi, afficher l'icône
          if (e.currentTarget.src !== defaultImage) {
            e.currentTarget.src = defaultImage;
          } else {
            // Masquer l'image et afficher l'icône
            e.currentTarget.style.display = 'none';
            const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallbackDiv) {
              fallbackDiv.style.display = 'flex';
            }
          }
        }}
      />
      
      {/* Fallback avec icône si aucune image ne charge */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-magenta/20 to-sunset/20 flex items-center justify-center"
        style={{ display: 'none' }}
      >
        {showDefaultIcon && (
          <div className="text-center">
            <HeartIcon className="h-16 w-16 text-magenta mx-auto mb-2" />
            <p className="text-magenta font-semibold text-sm">Cagnotte Solidaire</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant spécialisé pour les grilles d'images
export function MoneyPoolImageGrid({ 
  images, 
  alt, 
  className = "w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg"
}: MoneyPoolImageProps) {
  const defaultImage = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80";
  
  if (!images || images.length === 0) {
    return (
      <div className="col-span-3 bg-gradient-to-br from-magenta/10 to-sunset/10 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-magenta mx-auto mb-2" />
          <p className="text-magenta font-semibold">Cagnotte Solidaire</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {images.map((image, index) => (
        <MoneyPoolImage
          key={index}
          images={[image]}
          alt={`${alt} - ${index + 1}`}
          className={className}
        />
      ))}
    </>
  );
}
