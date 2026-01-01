'use client';

import { useEffect, useState } from 'react';

interface AppDeepLinkProps {
  moneyPoolId: string;
  locale?: string;
}

/**
 * Composant pour gérer le deep linking vers l'application mobile
 * Affiche un banner avec bouton pour ouvrir l'app si elle est installée
 */
export function AppDeepLink({ moneyPoolId, locale = 'fr' }: AppDeepLinkProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isAttemptingOpen, setIsAttemptingOpen] = useState(false);

  useEffect(() => {
    // Détecter si l'utilisateur est sur mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      setShowBanner(true);
    }
  }, []);

  const tryOpenApp = () => {
    if (isAttemptingOpen) return;
    
    setIsAttemptingOpen(true);
    const now = Date.now();
    
    // URL de l'app (deep link)
    const appUrl = `cocoti://money-pool/${moneyPoolId}`;
    
    // URL universelle (pour iOS/Android avec Universal/App Links)
    const universalUrl = `https://cocoti.app/${locale}/money-pool/${moneyPoolId}`;
    
    // Essayer d'abord le deep link direct
    window.location.href = appUrl;
    
    // Si l'app ne s'ouvre pas après 1.5 secondes, rester sur la page web
    setTimeout(() => {
      if (Date.now() - now < 2000) {
        // L'app n'est probablement pas installée
        console.log('App not installed or failed to open, staying on web');
      }
      setIsAttemptingOpen(false);
    }, 1500);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        padding: '16px',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
          {locale === 'fr' ? 'Ouvrir dans l\'app Cocoti' : 'Open in Cocoti app'}
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
          {locale === 'fr' 
            ? 'Meilleure expérience sur mobile' 
            : 'Better experience on mobile'}
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={tryOpenApp}
          disabled={isAttemptingOpen}
          style={{
            background: 'white',
            color: '#6366f1',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isAttemptingOpen ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            opacity: isAttemptingOpen ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {isAttemptingOpen 
            ? (locale === 'fr' ? 'Ouverture...' : 'Opening...') 
            : (locale === 'fr' ? 'Ouvrir' : 'Open')}
        </button>
        
        <button
          onClick={() => setShowBanner(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          aria-label={locale === 'fr' ? 'Fermer' : 'Close'}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

