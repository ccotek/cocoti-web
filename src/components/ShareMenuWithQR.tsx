'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShareIcon,
  XMarkIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import QRCode from 'qrcode';

interface ShareMenuWithQRProps {
  shareUrl: string;
  title: string;
  description: string;
  locale: string;
  onClose: () => void;
}

export default function ShareMenuWithQR({
  shareUrl,
  title,
  description,
  locale,
  onClose
}: ShareMenuWithQRProps) {
  // Helper function for translations
  const t = (key: string): string => {
    try {
      const translations: Record<string, any> = {
        fr: require('@/i18n/messages/fr.json').moneyPool?.create?.shareMenu || {},
        en: require('@/i18n/messages/en.json').moneyPool?.create?.shareMenu || {}
      };
      
      // Handle nested keys like "title"
      const keys = key.split('.');
      let value: any = translations[locale];
      
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined || value === null) {
          break;
        }
      }
      
      return typeof value === 'string' ? value : key;
    } catch (error) {
      console.error('Error loading translations:', error);
      return key;
    }
  };
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState('');
  const [qrLoading, setQrLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Ref pour protection synchrone contre les appels multiples à navigator.share()
  const isSharingRef = useRef(false);
  // Ref pour accéder à la valeur actuelle de qrData de manière synchrone
  const qrDataRef = useRef('');

  // S'assurer que le lien a un protocole pour qu'il soit cliquable
  const ensureProtocol = useCallback((url: string): string => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }, []);
  
  const shareUrlWithProtocol = ensureProtocol(shareUrl);

  // Fonction utilitaire pour convertir hex en RGB (mémorisée)
  const hexToRgb = useCallback((hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }, []);
  
  // Fonction utilitaire pour interpoler entre deux couleurs RGB (mémorisée)
  const interpolateRgb = useCallback((rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }, factor: number): { r: number; g: number; b: number } => {
    return {
      r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor),
      g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor),
      b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)
    };
  }, []);

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

  // Générer QR code avec dégradé de la charte graphique (même style que les boutons)
  // Générer le QR code dès l'ouverture du menu pour pouvoir le partager
  useEffect(() => {
    // Générer le QR code dès que le composant est monté (menu ouvert)
    // On génère toujours le QR code pour qu'il soit disponible pour le partage
    if (!qrData && !qrLoading && shareUrl) {
      setQrLoading(true);
      
      // Couleurs de la charte graphique Cocoti (même que les boutons)
      const magenta = '#ff3a81';
      const sunset = '#ff7c32';
      const coral = '#ff5a5f';
      
      // Générer le QR code en noir d'abord (pour créer un masque)
      // Utiliser le lien avec protocole pour le QR code
      const qrUrl = ensureProtocol(shareUrl);
      QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 3,
        color: {
          dark: '#000000', // Noir pour créer un masque
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
        .then((dataUrl) => {
          // Créer un canvas pour appliquer le dégradé
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              setQrData(dataUrl);
              setQrLoading(false);
              return;
            }
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Dessiner d'abord le QR code pour obtenir les données des pixels
            ctx.drawImage(img, 0, 0);
            
            // Obtenir les données de l'image
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Parcourir tous les pixels et appliquer le dégradé horizontal sur les pixels noirs
            for (let i = 0; i < data.length; i += 4) {
              const pixelIndex = i / 4;
              const x = pixelIndex % canvas.width;
              const y = Math.floor(pixelIndex / canvas.width);
              
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              
              // Détecter si c'est un pixel sombre (module du QR code)
              // Un pixel noir a des valeurs RGB proches de 0
              const isDark = r < 200 && g < 200 && b < 200;
              
              if (isDark) {
                // Calculer la position dans le dégradé horizontal (0 à 1)
                const gradientPos = x / canvas.width;
                
                // Interpoler entre les couleurs du dégradé
                let finalRgb;
                if (gradientPos < 0.5) {
                  // Entre magenta et sunset
                  const t = gradientPos * 2;
                  finalRgb = interpolateRgb(
                    hexToRgb(magenta)!,
                    hexToRgb(sunset)!,
                    t
                  );
                } else {
                  // Entre sunset et coral
                  const t = (gradientPos - 0.5) * 2;
                  finalRgb = interpolateRgb(
                    hexToRgb(sunset)!,
                    hexToRgb(coral)!,
                    t
                  );
                }
                
                // Appliquer la couleur du dégradé
                data[i] = finalRgb.r;     // R
                data[i + 1] = finalRgb.g; // G
                data[i + 2] = finalRgb.b; // B
                data[i + 3] = 255;        // A (opaque)
              } else {
                // Pixel clair = fond blanc
                data[i] = 255;     // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A (opaque)
              }
            }
            
            // Appliquer les données modifiées
            ctx.putImageData(imageData, 0, 0);
            
            // Convertir en data URL
            const finalDataUrl = canvas.toDataURL('image/png');
            setQrData(finalDataUrl);
            qrDataRef.current = finalDataUrl; // Mettre à jour le ref aussi
            setQrLoading(false);
          };
          img.onerror = () => {
            // Fallback: utiliser l'image originale
            setQrData(dataUrl);
            qrDataRef.current = dataUrl; // Mettre à jour le ref aussi
            setQrLoading(false);
          };
          img.src = dataUrl;
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
          setQrLoading(false);
        });
    }
  }, [showQR, shareUrl, interpolateRgb, hexToRgb, qrData, qrLoading]);

  // Partager via l'API Web Share native (avec QR code si disponible)
  const handleNativeShare = async () => {
    // Protection synchrone contre les appels multiples
    if (isSharingRef.current) {
      return;
    }

    try {
      if (navigator.share) {
        // Marquer immédiatement comme en cours (synchrone)
        isSharingRef.current = true;
        
        // Timeout de sécurité pour réinitialiser l'état après 35 secondes maximum
        // (plus long que le timeout du partage de 30 secondes)
        const timeoutId = setTimeout(() => {
          console.warn('Share timeout - resetting state');
          isSharingRef.current = false;
        }, 35000);
        
        try {
          // Attendre que le QR code soit généré si nécessaire (max 3 secondes)
          let qrDataToUse = qrDataRef.current || qrData;
          if (!qrDataToUse && qrLoading) {
            console.log('Waiting for QR code generation...');
            const maxWait = 3000; // 3 secondes max
            const startTime = Date.now();
            while (!qrDataToUse && (Date.now() - startTime) < maxWait) {
              await new Promise(resolve => setTimeout(resolve, 100));
              qrDataToUse = qrDataRef.current || qrData;
            }
          }
          
          console.log('QR code check:', { qrDataToUse: !!qrDataToUse, qrData: !!qrData, qrLoading });
          
          // Si le QR code est disponible, le partager avec le lien
          if (qrDataToUse) {
            try {
              console.log('QR code available, converting to file...');
              
              // Convertir le data URL en Blob puis en File
              // Méthode directe pour convertir data URL en Blob
              const base64Data = qrDataToUse.split(',')[1];
              if (!base64Data) {
                throw new Error('Invalid QR code data URL');
              }
              
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'image/png' });
              
              const qrFile = new File(
                [blob],
                `cocoti-qr-${title.replace(/\s+/g, '-').toLowerCase()}.png`,
                { type: 'image/png' }
              );
              
              console.log('QR file created:', qrFile.name, qrFile.size, 'bytes');
              
              // Vérifier si on peut partager des fichiers
              const canShareFiles = navigator.canShare && navigator.canShare({ files: [qrFile] });
              console.log('Can share files:', canShareFiles);
              
              if (canShareFiles) {
                console.log('Sharing QR code with file...');
                // Partager le QR code en image avec le titre et le lien uniquement
                // Ne pas utiliser le champ 'text' pour éviter que la description soit utilisée
                try {
                  // Timeout plus long (30 secondes) car le partage peut prendre du temps
                  await Promise.race([
                    navigator.share({
                      title: `${title}\n${shareUrlWithProtocol}`, // Titre + lien dans le titre
                      files: [qrFile] // Le QR code en image
                    }),
                    // Timeout de 30 secondes pour le partage (plus long pour laisser le temps à l'utilisateur)
                    new Promise((_, reject) => 
                      setTimeout(() => reject(new Error('Share timeout')), 30000)
                    )
                  ]);
                  console.log('Share completed with QR code');
                  onClose();
                  return;
                } catch (shareError: any) {
                  if (shareError.name === 'AbortError') {
                    // L'utilisateur a annulé, c'est normal
                    console.log('Share cancelled by user');
                    // Réinitialiser le flag pour permettre un nouveau partage
                    isSharingRef.current = false;
                    return;
                  } else if (shareError.message === 'Share timeout') {
                    console.warn('Share timed out after 30 seconds');
                    // Ne pas faire de fallback automatique, juste fermer
                    // L'utilisateur peut réessayer s'il le souhaite
                    onClose();
                    return;
                  } else {
                    console.error('Share error:', shareError);
                    // En cas d'erreur, ne pas faire de fallback automatique
                    // Réinitialiser le flag et fermer
                    isSharingRef.current = false;
                    onClose();
                    return;
                  }
                }
              } else {
                console.warn('File sharing not supported, falling back to text only');
              }
            } catch (fileError) {
              // Si l'ajout du fichier échoue, continuer avec le partage texte
              console.error('Could not share QR code as file:', fileError);
            }
          } else {
            console.warn('QR code not available yet, sharing text only. qrData:', qrData, 'qrLoading:', qrLoading);
          }
          
          // Fallback: partager juste le titre et le lien (sans description)
          console.log('Sharing text only (no QR code)');
          await navigator.share({
            title: title, // Titre de la cagnotte
            text: shareUrlWithProtocol, // Juste le lien, pas la description
            url: shareUrlWithProtocol
          });
          onClose();
        } finally {
          // Annuler le timeout et réinitialiser l'état
          clearTimeout(timeoutId);
          isSharingRef.current = false;
        }
      } else {
        // Fallback: copier le lien
        await navigator.clipboard.writeText(shareUrl);
        alert(t('linkCopied'));
        onClose();
      }
    } catch (error: any) {
      // Réinitialiser l'état même en cas d'erreur
      isSharingRef.current = false;
      
      // Ignorer si l'utilisateur annule
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  // Copier le lien
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrlWithProtocol);
      alert(t('linkCopied'));
      onClose();
    } catch (err) {
      console.error('Error copying link:', err);
    }
  };
  const encodedUrl = encodeURIComponent(shareUrlWithProtocol);
  // Pour WhatsApp, on envoie juste le lien (les liens sont automatiquement cliquables dans WhatsApp)
  const whatsappText = encodeURIComponent(shareUrlWithProtocol);

  const socialLinks = [
    {
      name: t('facebook'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]'
    },
    {
      name: t('whatsapp'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.77.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${whatsappText}`,
      color: 'bg-[#25D366] hover:bg-[#20ba5a]'
    },
    {
      name: t('twitter'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
      color: 'bg-[#000000] hover:bg-[#1a1a1a]'
    },
    {
      name: t('linkedin'),
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-[#0077B5] hover:bg-[#006399]'
    }
  ];

  // Si on affiche le QR code, montrer la modal QR
  if (showQR) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div
          ref={menuRef}
          className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={() => setShowQR(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-cloud transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-night" />
          </button>

          {/* Title */}
          <h3 className="text-2xl font-bold text-night mb-4 pr-8">
            {t('qrCode')}
          </h3>

          {/* QR Code */}
          {qrLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-magenta border-t-transparent mb-4"></div>
              <p className="text-ink-muted font-inter">
                {t('generatingQR')}
              </p>
            </div>
          ) : qrData ? (
            <div className="flex flex-col items-center gap-4">
              <img 
                src={qrData} 
                alt="QR code" 
                className="w-full max-w-[300px] rounded-2xl shadow-lg border-4 border-cloud" 
              />
              <p className="text-sm text-ink-muted text-center font-inter">
                {t('scanToParticipate')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-500 font-inter">
                {t('errorGeneratingQR')}
              </p>
            </div>
          )}

          {/* Back button */}
          <button
            onClick={() => setShowQR(false)}
            className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {t('back')}
          </button>
        </div>
      </div>
    );
  }

  // Modal principale avec options de partage
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
          {t('title')}
        </h3>

        {/* Share options */}
        <div className="space-y-3">
          {/* Native share */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <ShareIcon className="w-6 h-6" />
              <span>{t('shareVia')}</span>
            </button>
          )}

          {/* Social links - Liens directs vers les réseaux sociaux */}
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className={`w-full flex items-center gap-3 p-4 ${social.color} text-white rounded-xl font-semibold transition-colors`}
            >
              {social.icon}
              <span>{social.name}</span>
            </a>
          ))}

          {/* QR Code button */}
          <button
            onClick={() => setShowQR(true)}
            className="w-full flex items-center gap-3 p-4 bg-white border-2 border-cloud text-night rounded-xl font-semibold hover:border-magenta hover:bg-magenta/5 transition-colors"
          >
            <QrCodeIcon className="w-6 h-6" />
            <span>{t('showQRCode')}</span>
          </button>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-4 bg-white border-2 border-cloud text-night rounded-xl font-semibold hover:border-magenta hover:bg-magenta/5 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>{t('copyLink')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

