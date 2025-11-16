'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ShareIcon,
  XMarkIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface ShareMenuProps {
  shareUrl: string;
  title: string;
  description: string;
  locale: string;
  onClose: () => void;
}

export default function ShareMenu({
  shareUrl,
  title,
  description,
  locale,
  onClose
}: ShareMenuProps) {
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Copier le lien
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error copying link:', err);
    }
  };

  // Partager via l'API Web Share native (fallback si appelé depuis le menu)
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: shareUrl
        });
        onClose();
      } else {
        // Si navigator.share n'est pas disponible, copier le lien
        await handleCopyLink();
      }
    } catch (error: any) {
      // Ignorer si l'utilisateur annule
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Error sharing:', error);
      // En cas d'erreur, copier le lien
      await handleCopyLink();
    }
  };

  // Partager sur Facebook
  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    onClose();
  };

  // Partager sur WhatsApp
  const handleShareWhatsApp = () => {
    const text = locale === 'fr'
      ? `${title}\n${description}\n${shareUrl}`
      : `${title}\n${description}\n${shareUrl}`;
    
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
    onClose();
  };

  // Partager sur Twitter/X
  const handleShareTwitter = () => {
    const text = locale === 'fr'
      ? `${title} - ${shareUrl}`
      : `${title} - ${shareUrl}`;
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    onClose();
  };

  // Partager sur LinkedIn
  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={menuRef}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cloud transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-night" />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold text-night mb-6 pr-8">
          {locale === 'fr' ? 'Partager' : 'Share'}
        </h3>

        {/* Share options - en ligne */}
        <div className="flex flex-wrap gap-3 justify-center">
          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <ShareIcon className="w-5 h-5" />
              <span>{locale === 'fr' ? 'Partager' : 'Share'}</span>
            </button>
          )}

          {/* Facebook */}
          <button
            onClick={handleShareFacebook}
            className="flex items-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-xl font-semibold hover:bg-[#166FE5] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20ba5a] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleShareTwitter}
            className="flex items-center gap-2 px-4 py-3 bg-[#000000] text-white rounded-xl font-semibold hover:bg-[#1a1a1a] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Twitter</span>
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleShareLinkedIn}
            className="flex items-center gap-2 px-4 py-3 bg-[#0077B5] text-white rounded-xl font-semibold hover:bg-[#006399] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </button>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-cloud text-night rounded-xl font-semibold hover:border-magenta hover:bg-magenta/5 transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            <span>
              {copied
                ? (locale === 'fr' ? 'Copié !' : 'Copied!')
                : (locale === 'fr' ? 'Copier' : 'Copy')
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

