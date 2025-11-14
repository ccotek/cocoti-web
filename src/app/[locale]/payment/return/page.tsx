'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * Page intermédiaire pour gérer la redirection PayDunya
 * Cette page reçoit le token depuis PayDunya, le stocke dans sessionStorage,
 * puis redirige vers la page money-pool sans le token dans l'URL
 */
export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPaymentReturn = async () => {
      // Récupérer le token depuis l'URL (ajouté par PayDunya)
      const invoiceToken = searchParams.get('token') || searchParams.get('invoice_token');
      
      // Récupérer le money_pool_id depuis l'URL (si fourni) ou depuis sessionStorage
      let moneyPoolId = searchParams.get('money_pool_id') || sessionStorage.getItem('pending_money_pool_id');
      const locale = searchParams.get('locale') || sessionStorage.getItem('pending_locale') || 'fr';
      const isCancelled = searchParams.get('cancelled') === 'true';

      console.log('[PAYMENT RETURN] Processing payment return:', {
        invoiceToken: invoiceToken ? 'present' : 'missing',
        moneyPoolId,
        locale,
        isCancelled
      });

      // Si on a un token mais pas de money_pool_id, essayer de le récupérer depuis l'API
      if (invoiceToken && !moneyPoolId) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const baseUrl = API_URL.endsWith('/api/v1') ? API_URL.replace('/api/v1', '') : API_URL;
          
          // Récupérer le statut du paiement pour obtenir les métadonnées de la transaction
          const statusResponse = await fetch(`${baseUrl}/api/v1/payments/paydunya/status/${invoiceToken}`);
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            // Le money_pool_id devrait être dans les métadonnées de la transaction
            // On peut le récupérer depuis l'API si nécessaire
            console.log('[PAYMENT RETURN] Payment status retrieved:', statusData);
          }
        } catch (error) {
          console.error('[PAYMENT RETURN] Error fetching payment status:', error);
        }
      }

      // Si on a un token, le stocker dans sessionStorage (même si annulé, pour mettre à jour le statut)
      if (invoiceToken) {
        sessionStorage.setItem('pending_payment_token', invoiceToken);
        console.log('[PAYMENT RETURN] Token stored in sessionStorage:', invoiceToken);
      }

      // Si annulé (avec ou sans token), traiter comme une annulation
      if (isCancelled) {
        // Paiement annulé - rediriger vers la page money-pool
        if (moneyPoolId) {
          const cleanPath = `/${locale}/money-pool/${moneyPoolId}`;
          console.log('[PAYMENT RETURN] Payment cancelled, redirecting to money pool:', cleanPath);
          
          // Nettoyer sessionStorage des données temporaires (mais garder le token pour vérification du statut)
          sessionStorage.removeItem('pending_money_pool_id');
          sessionStorage.removeItem('pending_locale');
          // Ne pas supprimer pending_payment_token car la page money-pool en a besoin pour vérifier le statut
          
          router.replace(cleanPath);
        } else {
          console.warn('[PAYMENT RETURN] Payment cancelled but no money_pool_id, redirecting to home');
          sessionStorage.removeItem('pending_money_pool_id');
          sessionStorage.removeItem('pending_locale');
          router.replace(`/${locale}`);
        }
      } else if (invoiceToken) {
        // Paiement réussi (avec token) - rediriger vers la page money-pool
        if (moneyPoolId) {
          const cleanPath = `/${locale}/money-pool/${moneyPoolId}`;
          console.log('[PAYMENT RETURN] Payment successful, redirecting to money pool:', cleanPath);
          
          // Nettoyer sessionStorage des données temporaires
          sessionStorage.removeItem('pending_money_pool_id');
          sessionStorage.removeItem('pending_locale');
          
          // Rediriger vers la page money-pool sans le token (URL propre)
          router.replace(cleanPath);
        } else {
          // Si pas de money_pool_id, essayer de le récupérer depuis sessionStorage ou rediriger vers l'accueil
          console.warn('[PAYMENT RETURN] No money_pool_id found, checking sessionStorage...');
          const storedMoneyPoolId = sessionStorage.getItem('pending_money_pool_id');
          if (storedMoneyPoolId) {
            const cleanPath = `/${locale}/money-pool/${storedMoneyPoolId}`;
            console.log('[PAYMENT RETURN] Found money_pool_id in sessionStorage, redirecting:', cleanPath);
            sessionStorage.removeItem('pending_money_pool_id');
            sessionStorage.removeItem('pending_locale');
            router.replace(cleanPath);
          } else {
            console.warn('[PAYMENT RETURN] No money_pool_id found anywhere, redirecting to home');
            sessionStorage.removeItem('pending_money_pool_id');
            sessionStorage.removeItem('pending_locale');
            router.replace(`/${locale}`);
          }
        }
      } else {
        // Pas de token et pas d'annulation, rediriger vers l'accueil
        console.warn('[PAYMENT RETURN] No token found and not cancelled, redirecting to home');
        sessionStorage.removeItem('pending_money_pool_id');
        sessionStorage.removeItem('pending_locale');
        router.replace(`/${locale}`);
      }
      
      setIsProcessing(false);
    };

    // Attendre un court délai pour s'assurer que les paramètres sont disponibles
    const timeoutId = setTimeout(processPaymentReturn, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [router, searchParams]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
        <p className="text-gray-600">Traitement du paiement...</p>
      </div>
    </div>
  );
}

