"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useCookies } from '@/hooks/useCookies';

/**
 * ScriptLoader - Charge les scripts de tracking conditionnellement
 * selon les préférences cookies de l'utilisateur
 */
export default function ScriptLoader() {
  const { canUseAnalytics, canUseMarketing, hasConsent } = useCookies();
  const [key, setKey] = useState(0); // Force re-render quand les préférences changent

  // Log de debug (uniquement en développement)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ScriptLoader] Cookie preferences:', {
        hasConsent,
        analytics: canUseAnalytics(),
        marketing: canUseMarketing(),
      });
    }
  }, [hasConsent, canUseAnalytics, canUseMarketing]);

  // Écouter les changements de préférences
  useEffect(() => {
    const handleConsentUpdate = () => {
      // Force un re-render pour recharger les scripts
      setKey(prev => prev + 1);
      if (process.env.NODE_ENV === 'development') {
        console.log('[ScriptLoader] Cookie preferences updated, reloading scripts');
      }
    };

    window.addEventListener('cookie-consent-updated', handleConsentUpdate);
    return () => {
      window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
    };
  }, []);

  // Ne rien charger si l'utilisateur n'a pas encore donné son consentement
  if (!hasConsent) {
    return null;
  }

  return (
    <div key={key}>
      {/* Google Analytics - Se charge uniquement si analytics est accepté */}
      {canUseAnalytics() && (
        <>
          {/* Remplacer GA_MEASUREMENT_ID par votre ID Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <>
              <Script
                key={`ga-script-${key}`}
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
              />
              <Script key={`ga-config-${key}`} id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          )}
        </>
      )}

      {/* Facebook Pixel - Se charge uniquement si marketing est accepté */}
      {canUseMarketing() && (
        <>
          {/* Remplacer FACEBOOK_PIXEL_ID par votre ID Facebook Pixel */}
          {process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID && (
            <Script key={`fb-pixel-${key}`} id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
          )}
        </>
      )}
    </div>
  );
}

