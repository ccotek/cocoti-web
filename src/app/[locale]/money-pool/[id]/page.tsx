'use client';

import { useState, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  UsersIcon,
  ClockIcon,
  CheckBadgeIcon,
  PhotoIcon,
  EyeSlashIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import MoneyPoolGallery from '@/components/MoneyPoolGallery';
import Link from 'next/link';
import { APP_CONFIG } from '@/config/app';
import { WaveIcon, OrangeMoneyIcon, CreditCardIcon } from '@/components/payment-icons';
import { formatCurrency, formatAmount } from '@/utils/formatAmount';
import ShareMenuWithQR from '@/components/ShareMenuWithQR';

interface MoneyPool {
  id: string;
  name: string;
  description: string;
  images: string[];
  videos?: string[];  // Liste des URLs de vidéos (max 2, 30s chacune)
  status: string;
  visibility: string;
  verified?: boolean;
  settings: {
    target_amount: number;
    min_contribution?: number;
    max_contribution?: number;
    allow_recurring_contributions: boolean;
    auto_approve_contributors: boolean;
    cross_country: boolean;
    require_kyc_for_contributors: boolean;
    allow_anonymous?: boolean;
  };
  currency: string;
  max_participants?: number;
  current_participants_count: number;
  current_amount: number;
  country: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface Contributor {
  participant_id?: string | null;  // FK vers money_pool_participants (peut être null pour contributions anonymes)
  full_name?: string | null;
  amount: number;
  message?: string;
  anonymous: boolean;
  created_at: string;
}

// Helper function to display currency symbol/name only
const getCurrencySymbol = (currency: string): string => {
  if (currency === 'XOF') return 'FCFA';
  return currency;
};

// Regex patterns for validation
const phoneRegex = /^[\d\s\+\-\(\)]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MoneyPoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const moneyPoolId = params.id as string;
  const locale = params.locale as string;

  // Vérifier s'il y a un paiement en attente de vérification (stocké dans sessionStorage)
  // Plus besoin de nettoyer l'URL car PayDunya utilise maintenant des URLs propres

  // API URL configuration (same as money-pools list page)
  const API_URL = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return baseUrl.endsWith('/api/v1') ? baseUrl.replace('/api/v1', '') : baseUrl;
  }, []);

  // Helper function for translations using JSON files
  const t = (key: string): string => {
    try {
      const translations: Record<string, any> = {
        fr: require('@/i18n/messages/fr.json').moneyPool || {},
        en: require('@/i18n/messages/en.json').moneyPool || {}
      };

      // Handle nested keys like "paymentInfo.title"
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

  const [moneyPool, setMoneyPool] = useState<MoneyPool | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ref pour éviter les traitements multiples du paiement
  const paymentProcessedRef = useRef<Set<string>>(new Set());
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionStep, setContributionStep] = useState<1 | 2>(1); // Étape 1: formulaire, Étape 2: paiement
  const [isContributing, setIsContributing] = useState(false);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Vérifier si l'utilisateur est connecté
  const [userFullName, setUserFullName] = useState<string | null>(null); // Nom complet de l'utilisateur connecté
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [paymentError, setPaymentError] = useState<{ type: 'cancelled' | 'failed' | null }>({ type: null });
  const [cocotiTip, setCocotiTip] = useState<number>(0);
  const [cocotiTipPercentage, setCocotiTipPercentage] = useState<number>(5.5); // 5.5% par défaut
  const [cocotiTipMin, setCocotiTipMin] = useState<number>(4.5); // Minimum par défaut
  const [cocotiTipMax, setCocotiTipMax] = useState<number>(20.0); // Maximum par défaut
  const [skipCocotiTip, setSkipCocotiTip] = useState<boolean>(false);
  const [showTipModify, setShowTipModify] = useState<boolean>(false); // Cacher la barre de modification par défaut
  // Informations de paiement (étape 2)
  const [paymentFullName, setPaymentFullName] = useState<string>(''); // Nom complet (obligatoire dans étape 2)
  const [paymentEmail, setPaymentEmail] = useState<string>('');
  const [paymentPhone, setPaymentPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>(''); // 'wave', 'orange_money', 'card'
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  // Informations carte bancaire (si méthode = card)
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVC, setCardCVC] = useState<string>('');
  // Sélecteur de pays avec indicatif téléphonique
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('SN'); // Sénégal par défaut
  const [selectedCallingCode, setSelectedCallingCode] = useState<string>('+221'); // +221 par défaut


  // Charger la liste des pays actifs avec indicatifs téléphoniques
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/geography/countries/public?language=${locale}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.countries) {
            setCountries(data.countries);
            // Définir le pays par défaut (Sénégal)
            const defaultCountry = data.countries.find((c: any) => c.code === 'SN');
            if (defaultCountry) {
              setSelectedCountryCode(defaultCountry.code);
              setSelectedCallingCode(defaultCountry.calling_code || '+221');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, [API_URL, locale]);

  useEffect(() => {
    const fetchMoneyPool = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch money pool details
        const response = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}`);

        if (!response.ok) {
          let errorMessage = '';
          let errorData: any = null;
          let rawText = '';

          // Gérer les différents cas d'erreur
          if (response.status === 404) {
            errorMessage = t('notFoundDescription');
          } else {
            // Cloner la réponse pour pouvoir lire le texte ET le JSON si nécessaire
            const clonedResponse = response.clone();

            // D'abord, lire le texte brut pour voir ce que le serveur retourne
            try {
              rawText = await clonedResponse.text();
            } catch (textError) {
              // Ignore text read errors
            }

            // Essayer de parser la réponse JSON
            try {
              if (rawText && rawText.trim()) {
                errorData = JSON.parse(rawText);
              } else {
                errorData = {};
              }

              // Extraire le message d'erreur
              if (errorData && typeof errorData === 'object') {
                errorMessage = errorData.detail || errorData.message || errorData.error || errorData.msg || '';

                // Si le message est "Internal server error", essayer d'obtenir plus de détails
                if (errorMessage === 'Internal server error' || errorMessage === '') {
                  // Vérifier s'il y a d'autres champs dans errorData
                  const errorKeys = Object.keys(errorData);
                  if (errorKeys.length > 0) {
                    errorMessage = `Erreur serveur: ${JSON.stringify(errorData)}`;
                  } else {
                    errorMessage = 'Erreur serveur interne. Veuillez vérifier les logs du serveur.';
                  }
                }
              }

              // Si aucun message n'a été trouvé dans le JSON, utiliser le texte brut ou le statut HTTP
              if (!errorMessage || errorMessage.trim() === '') {
                if (rawText && rawText.trim()) {
                  errorMessage = rawText;
                } else {
                  errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                }
              }

            } catch (jsonError) {
              // Si le parsing JSON échoue, utiliser le texte brut
              errorMessage = rawText || `HTTP ${response.status}: ${response.statusText}`;
            }
          }

          throw new Error(errorMessage || `Erreur serveur (${response.status})`);
        }

        const data = await response.json();

        // Ensure verified is a boolean - normalize it properly
        // Handle all possible types: boolean, string, number, null, undefined
        const verifiedValue = data.verified;
        let normalizedVerified = false;
        if (verifiedValue === true || verifiedValue === 'true' || verifiedValue === 1 || verifiedValue === '1') {
          normalizedVerified = true;
        } else if (verifiedValue === false || verifiedValue === 'false' || verifiedValue === 0 || verifiedValue === '0' || verifiedValue === null || verifiedValue === undefined) {
          normalizedVerified = false;
        } else {
          // Default to false for any other value
          normalizedVerified = false;
        }

        data.verified = normalizedVerified;
        setMoneyPool(data);

        // Fetch contributions
        try {
          const contribResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}/contributions?limit=20&page=1`);
          if (contribResponse.ok) {
            const contribData = await contribResponse.json();
            setContributors(contribData.contributions || []);
          }
        } catch (contribErr) {
          console.error('Error fetching contributions:', contribErr);
          setContributors([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching money pool:', err);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    if (moneyPoolId) {
      fetchMoneyPool();
    }
  }, [moneyPoolId, locale]);

  // Stocker le money_pool_id et locale dans sessionStorage avant d'initier le paiement
  // Cela permettra à la page intermédiaire de savoir où rediriger
  useEffect(() => {
    if (typeof window !== 'undefined' && moneyPoolId && locale) {
      sessionStorage.setItem('pending_money_pool_id', moneyPoolId);
      sessionStorage.setItem('pending_locale', locale);
    }
  }, [moneyPoolId, locale]);

  // Restaurer les informations du formulaire depuis sessionStorage si disponibles (après annulation)
  useEffect(() => {
    if (typeof window !== 'undefined' && showContributeModal && contributionStep === 2) {
      const savedData = sessionStorage.getItem('pending_contribution_data');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.paymentFullName) setPaymentFullName(data.paymentFullName);
          if (data.paymentEmail) setPaymentEmail(data.paymentEmail);
          if (data.paymentPhone) setPaymentPhone(data.paymentPhone);
          if (data.selectedCallingCode) setSelectedCallingCode(data.selectedCallingCode);
          if (data.paymentMethod) setPaymentMethod(data.paymentMethod);
          if (data.cardNumber) setCardNumber(data.cardNumber);
          if (data.cardExpiry) setCardExpiry(data.cardExpiry);
          if (data.cardCVC) setCardCVC(data.cardCVC);
          if (data.contributionAmount) setContributionAmount(data.contributionAmount);
          if (data.message !== undefined) setMessage(data.message);
          if (data.anonymous !== undefined) setAnonymous(data.anonymous);

          console.log('[CONTRIBUTION] Restored form data from sessionStorage');
        } catch (error) {
          console.error('[CONTRIBUTION] Error restoring form data:', error);
        }
      }
    }
  }, [showContributeModal, contributionStep]);

  // Vérifier le statut du paiement après retour de PayDunya
  // Cette partie s'exécute après le nettoyage de l'URL (si nécessaire)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (typeof window === 'undefined') return;

      // Récupérer l'invoice_token depuis sessionStorage (stocké avant nettoyage ou lors de l'initiation)
      let invoiceToken = sessionStorage.getItem('pending_payment_token');

      // Si pas d'invoice_token, ne rien faire
      if (!invoiceToken) {
        return;
      }

      console.log('[PAYMENT CHECK] Checking payment status for invoice_token:', invoiceToken);

      // Vérifier que l'URL est bien propre (sans paramètres)
      if (window.location.search) {
        console.warn('[PAYMENT CHECK] URL still has params, this should not happen:', window.location.search);
      }

      // Créer une clé unique pour ce paiement
      const paymentKey = `token_${invoiceToken}`;

      // Vérifier si ce paiement a déjà été traité (dans cette session)
      if (paymentProcessedRef.current.has(paymentKey)) {
        console.log('[PAYMENT CHECK] Payment already processed in this session, skipping...', paymentKey);
        // Nettoyer sessionStorage
        sessionStorage.removeItem('pending_payment_token');
        return;
      }

      // Marquer comme en cours de traitement
      paymentProcessedRef.current.add(paymentKey);

      // Vérifier le statut du paiement via l'API
      try {
        const { getAuthToken } = await import('@/utils/tokenStorage');
        const token = getAuthToken();

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Accept-Language': locale || 'fr',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Vérifier le statut du paiement via l'API
        const statusResponse = await fetch(`${API_URL}/api/v1/payments/paydunya/status/${invoiceToken}`, {
          method: 'GET',
          headers
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('[PAYMENT CHECK] Payment status from API:', statusData);

          if (statusData.status === 'completed' || statusData.status === 'success') {
            // Afficher la boîte de dialogue de remerciement au lieu d'une simple notification
            setShowThankYouDialog(true);

            // Nettoyer l'erreur de paiement et les données du formulaire sauvegardées après succès
            setPaymentError({ type: null });
            sessionStorage.removeItem('pending_contribution_data');

            // Recharger les données
            try {
              const poolResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}`);
              if (poolResponse.ok) {
                const poolData = await poolResponse.json();
                setMoneyPool(poolData);
              }

              const contribResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}/contributions?limit=20&page=1`);
              if (contribResponse.ok) {
                const contribData = await contribResponse.json();
                setContributors(contribData.contributions || []);
              }
            } catch (reloadError) {
              console.error('[PAYMENT CHECK] Error reloading data:', reloadError);
            }
          } else if (statusData.status === 'failed' || statusData.status === 'cancelled') {
            // Ne pas fermer le modal, revenir à l'étape 2 avec les informations déjà remplies
            // Les informations seront restaurées depuis sessionStorage par le useEffect
            setContributionStep(2);
            setShowContributeModal(true);
            setPaymentProcessing(false);
            setIsContributing(false);

            // Définir l'erreur de paiement pour l'afficher dans le formulaire
            setPaymentError({
              type: statusData.status === 'cancelled' ? 'cancelled' : 'failed'
            });
          }
        } else {
          console.error('[PAYMENT CHECK] Failed to check payment status:', statusResponse.status);
        }

        // Nettoyer sessionStorage après vérification
        sessionStorage.removeItem('pending_payment_token');
      } catch (error) {
        console.error('[PAYMENT CHECK] Error checking payment status:', error);
        // Nettoyer sessionStorage même en cas d'erreur
        sessionStorage.removeItem('pending_payment_token');
      }

      console.log('[PAYMENT CHECK] Payment status check completed');
    };

    // Vérifier immédiatement si on a des paramètres de paiement dans l'URL
    // Utiliser un timeout court pour s'assurer que le composant est monté
    const timeoutId = setTimeout(() => {
      checkPaymentStatus();
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
    // Se déclencher uniquement quand moneyPoolId ou locale changent (nouvelle page)
    // Ne pas inclure API_URL car c'est une constante
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moneyPoolId, locale]); // Se déclencher quand on change de money pool ou locale

  // Récupérer les informations de l'utilisateur connecté (une seule fois au chargement)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { getAuthToken, isAuthenticated } = await import('@/utils/tokenStorage');
        const token = getAuthToken();

        if (token && isAuthenticated()) {
          setIsLoggedIn(true);

          // Récupérer les infos utilisateur depuis l'API
          const response = await fetch(`${API_URL}/api/v1/auth/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            // Concaténer first_name et last_name pour créer le full_name
            const fullNameFromUser = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
            if (fullNameFromUser) {
              setUserFullName(fullNameFromUser);
            }
          }
        } else {
          setIsLoggedIn(false);
          setUserFullName(null);
        }
      } catch (err) {
        // Erreur silencieuse - l'utilisateur n'est peut-être pas connecté
        setIsLoggedIn(false);
        setUserFullName(null);
      }
    };

    fetchUserInfo();
  }, [API_URL]); // Ne dépend que de API_URL, pas de anonymous

  // Ne plus vider le champ nom quand anonymous change - le nom est toujours requis
  // On garde juste la logique de sauvegarde/restauration pour référence
  // mais on ne vide plus le champ

  // Charger la configuration du tip depuis le backend
  useEffect(() => {
    const fetchTipConfig = async () => {
      if (!moneyPool) return;

      try {
        const countryCode = moneyPool.country || 'SN';
        const response = await fetch(
          `${API_URL}/api/v1/money-pools/tip-config/public?product_type=money_pool&country_code=${countryCode}`
        );
        if (response.ok) {
          const config = await response.json();
          if (config.tip_enabled) {
            setCocotiTipMin(config.tip_min_percentage || 4.5);
            setCocotiTipMax(config.tip_max_percentage || 20.0);
            setCocotiTipPercentage(config.tip_default_percentage || 5.5);
          }
        }
      } catch (error) {
        console.error('Error fetching tip config:', error);
        // Garder les valeurs par défaut en cas d'erreur
      }
    };
    fetchTipConfig();
  }, [API_URL, moneyPool]);

  // Préremplir le nom dans l'étape 2 quand le modal s'ouvre (si vide)
  useEffect(() => {
    if (showContributeModal && !paymentFullName.trim() && userFullName) {
      // Pré-remplir avec le nom de l'utilisateur connecté
      setPaymentFullName(userFullName);
    }
  }, [showContributeModal, userFullName, paymentFullName]);


  // Calculer automatiquement le pourboire quand le montant change
  useEffect(() => {
    if (contributionAmount > 0) {
      const calculatedTip = Math.round(contributionAmount * (cocotiTipPercentage / 100));
      setCocotiTip(calculatedTip);
    } else {
      setCocotiTip(0);
    }
  }, [contributionAmount, cocotiTipPercentage]);

  // État pour le menu de partage
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Fonction de partage - ouvre le menu de partage
  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!moneyPool) {
      return;
    }

    setShowShareMenu(true);
  };

  const handleContribute = async () => {
    if (!moneyPool) {
      setNotification({
        type: 'error',
        message: t('notFound')
      });
      return;
    }

    // Vérifier que la cagnotte n'est pas archivée ou clôturée
    if (moneyPool.status === 'archived' || moneyPool.status === 'closed') {
      setNotification({
        type: 'error',
        message: moneyPool.status === 'closed'
          ? (locale === 'fr' ? 'Cette cagnotte est clôturée et n\'accepte plus de contributions.' : 'This money pool is closed and no longer accepts contributions.')
          : t('archivedFundsCollected')
      });
      setShowContributeModal(false);
      return;
    }

    if (contributionStep === 1) {
      // Étape 1 : Validation du formulaire
      if (contributionAmount <= 0) {
        setNotification({
          type: 'error',
          message: t('enterValidAmount')
        });
        return;
      }

      // Validate amount against min/max
      if (moneyPool.settings.min_contribution && contributionAmount < moneyPool.settings.min_contribution) {
        setNotification({
          type: 'error',
          message: `${t('minAmount')} ${formatAmount(moneyPool.settings.min_contribution)} ${getCurrencySymbol(moneyPool.currency)}`
        });
        return;
      }

      if (moneyPool.settings.max_contribution && contributionAmount > moneyPool.settings.max_contribution) {
        setNotification({
          type: 'error',
          message: `${t('maxAmount')} ${formatAmount(moneyPool.settings.max_contribution)} ${getCurrencySymbol(moneyPool.currency)}`
        });
        return;
      }

      // Passer à l'étape 2 : Informations de paiement
      setContributionStep(2);
      return;
    }

    // Étape 2 : Validation et traitement du paiement
    // Réinitialiser l'erreur de paiement si on réessaie
    setPaymentError({ type: null });
    // Full name obligatoire
    if (!paymentFullName.trim()) {
      setNotification({
        type: 'error',
        message: locale === 'fr' ? 'Le nom complet est obligatoire' : 'Full name is required'
      });
      return;
    }

    // Méthode de paiement obligatoire
    if (!paymentMethod) {
      setNotification({
        type: 'error',
        message: locale === 'fr' ? 'Veuillez sélectionner une méthode de paiement' : 'Please select a payment method'
      });
      return;
    }

    // Téléphone obligatoire pour Wave et Orange Money
    if ((paymentMethod === 'wave' || paymentMethod === 'orange_money') && !paymentPhone.trim()) {
      setNotification({
        type: 'error',
        message: t('paymentInfo.phoneRequired')
      });
      return;
    }

    // Valider le téléphone si fourni (format basique)
    if (paymentPhone.trim() && (!phoneRegex.test(paymentPhone.trim()) || paymentPhone.trim().length < 8)) {
      setNotification({
        type: 'error',
        message: t('paymentInfo.phoneInvalid')
      });
      return;
    }

    // Validation carte bancaire si méthode = card
    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()) {
        setNotification({
          type: 'error',
          message: locale === 'fr' ? 'Veuillez remplir tous les champs de la carte bancaire' : 'Please fill all card fields'
        });
        return;
      }
    }

    // Email optionnel mais validé si fourni
    if (paymentEmail.trim()) {
      if (!emailRegex.test(paymentEmail.trim())) {
        setNotification({
          type: 'error',
          message: t('paymentInfo.emailInvalid')
        });
        return;
      }
    }

    // Traiter le paiement
    await processContribution();
  };


  // Fonction helper pour gérer le paiement PayDunya SoftPay
  const handlePayDunyaPayment = (paymentData: any) => {
    console.log('[PAYDUNYA SDK] handlePayDunyaPayment called');
    console.log('[PAYDUNYA SDK] Payment data:', paymentData);
    console.log('[PAYDUNYA SDK] PayDunyaCheckout available?', !!(window as any).PayDunyaCheckout);

    if ((window as any).PayDunyaCheckout) {
      const PayDunyaCheckout = (window as any).PayDunyaCheckout;

      console.log('[PAYDUNYA SDK] Configuring PayDunya Checkout for SoftPay...');

      try {
        // Configurer PayDunya SoftPay (intégration transparente)
        // Note: Les URLs de retour sont configurées dans l'invoice côté backend
        // PayDunya devrait utiliser ces URLs, mais on peut aussi les configurer côté SDK si nécessaire
        const returnUrl = `/${locale}/payment/return?money_pool_id=${moneyPoolId}&locale=${locale}`;
        const cancelUrl = `/${locale}/payment/return?money_pool_id=${moneyPoolId}&locale=${locale}&cancelled=true`;

        PayDunyaCheckout.config({
          public_key: paymentData.public_key,
          invoice_token: paymentData.invoice_token,
          amount: paymentData.amount,
          currency: paymentData.currency || 'XOF',
          customer: paymentData.customer || {},
          // Options SoftPay : pas de branding PayDunya visible
          hide_paydunya_branding: paymentData.hide_paydunya_branding !== false,  // Utiliser la valeur du backend ou true par défaut
          // URLs de retour (si le SDK les supporte)
          return_url: returnUrl,
          cancel_url: cancelUrl
        });

        console.log('[PAYDUNYA SDK] PayDunya Checkout configured successfully');

        // Ouvrir le modal de paiement (transparent, sans mentionner PayDunya)
        console.log('[PAYDUNYA SDK] Opening PayDunya Checkout modal (SoftPay mode)...');
        PayDunyaCheckout.open();

        // Écouter les événements PayDunya
        PayDunyaCheckout.on('success', () => {
          console.log('[PAYDUNYA SDK] Payment success event received');

          // Récupérer l'invoice_token depuis sessionStorage
          const invoiceToken = sessionStorage.getItem('pending_payment_token');
          console.log('[PAYDUNYA SDK] Invoice token from sessionStorage:', invoiceToken);

          // Fermer le modal de contribution
          setShowContributeModal(false);

          // Vérifier le statut via l'API et recharger les données
          if (invoiceToken) {
            // Vérifier le statut via l'API
            const checkStatus = async () => {
              try {
                const { getAuthToken } = await import('@/utils/tokenStorage');
                const token = getAuthToken();

                const headers: HeadersInit = {
                  'Content-Type': 'application/json',
                  'Accept-Language': locale || 'fr',
                };

                if (token) {
                  headers['Authorization'] = `Bearer ${token}`;
                }

                const statusResponse = await fetch(`${API_URL}/api/v1/payments/paydunya/status/${invoiceToken}`, {
                  method: 'GET',
                  headers
                });

                if (statusResponse.ok) {
                  const statusData = await statusResponse.json();
                  console.log('[PAYDUNYA SDK] Payment status from API:', statusData);

                  // Recharger les données
                  const poolResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}`);
                  if (poolResponse.ok) {
                    const poolData = await poolResponse.json();
                    setMoneyPool(poolData);
                  }

                  const contribResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}/contributions?limit=20&page=1`);
                  if (contribResponse.ok) {
                    const contribData = await contribResponse.json();
                    setContributors(contribData.contributions || []);
                  }

                  // Afficher la boîte de dialogue de remerciement
                  setShowThankYouDialog(true);

                  // Nettoyer l'erreur de paiement et les données du formulaire sauvegardées après succès
                  setPaymentError({ type: null });
                  sessionStorage.removeItem('pending_contribution_data');
                } else {
                  console.error('[PAYDUNYA SDK] Failed to check payment status:', statusResponse.status);
                  // Recharger quand même la page
                  window.location.reload();
                }
              } catch (error) {
                console.error('[PAYDUNYA SDK] Error checking payment status:', error);
                // Recharger la page en cas d'erreur
                window.location.reload();
              }
            };

            checkStatus();
          } else {
            // Pas de token, recharger la page
            console.warn('[PAYDUNYA SDK] No invoice token in sessionStorage, reloading page');
            window.location.reload();
          }
        });

        PayDunyaCheckout.on('cancel', () => {
          console.log('[PAYDUNYA SDK] Payment cancel event received');

          // Ne pas fermer le modal, revenir à l'étape 2 avec les informations déjà remplies
          setContributionStep(2);
          setShowContributeModal(true);
          setPaymentProcessing(false);
          setIsContributing(false);

          // Définir l'erreur de paiement pour l'afficher dans le formulaire
          setPaymentError({ type: 'cancelled' });

          // Récupérer l'invoice_token depuis sessionStorage
          const invoiceToken = sessionStorage.getItem('pending_payment_token');
          console.log('[PAYDUNYA SDK] Invoice token from sessionStorage (cancel):', invoiceToken);

          // Vérifier le statut via l'API
          if (invoiceToken) {
            const checkStatus = async () => {
              try {
                const { getAuthToken } = await import('@/utils/tokenStorage');
                const token = getAuthToken();

                const headers: HeadersInit = {
                  'Content-Type': 'application/json',
                  'Accept-Language': locale || 'fr',
                };

                if (token) {
                  headers['Authorization'] = `Bearer ${token}`;
                }

                const statusResponse = await fetch(`${API_URL}/api/v1/payments/paydunya/status/${invoiceToken}`, {
                  method: 'GET',
                  headers
                });

                if (statusResponse.ok) {
                  const statusData = await statusResponse.json();
                  console.log('[PAYDUNYA SDK] Payment status from API (cancel):', statusData);
                }
              } catch (error) {
                console.error('[PAYDUNYA SDK] Error checking payment status (cancel):', error);
              }
            };

            checkStatus();
          }
        });

        PayDunyaCheckout.on('error', (error: any) => {
          console.error('[PAYDUNYA SDK] Payment error event received:', error);

          // Ne pas fermer le modal, revenir à l'étape 2 avec les informations déjà remplies
          setContributionStep(2);
          setShowContributeModal(true);
          setPaymentProcessing(false);
          setIsContributing(false);

          // Définir l'erreur de paiement pour l'afficher dans le formulaire
          setPaymentError({ type: 'failed' });
        });
      } catch (configError) {
        console.error('[PAYDUNYA SDK] Error configuring PayDunya Checkout:', configError);
        // Pas de fallback de redirection pour SoftPay - revenir à l'étape 2
        setContributionStep(2);
        setShowContributeModal(true);
        setPaymentProcessing(false);
        setIsContributing(false);

        // Définir l'erreur de paiement pour l'afficher dans le formulaire
        setPaymentError({ type: 'failed' });
      }
    } else {
      console.error('[PAYDUNYA SDK] PayDunyaCheckout not available - SoftPay requires SDK');
      // Pas de fallback de redirection pour SoftPay - revenir à l'étape 2
      setContributionStep(2);
      setShowContributeModal(true);
      setPaymentProcessing(false);
      setIsContributing(false);

      // Définir l'erreur de paiement pour l'afficher dans le formulaire
      setPaymentError({ type: 'failed' });
    }
  };

  const processContribution = async () => {
    if (!moneyPool) return;

    try {
      // Calculer le montant total (contribution + pourboire Cocoti)
      const totalAmount = contributionAmount + cocotiTip;
      setIsContributing(true);

      setPaymentProcessing(true);

      // Get auth token if user is logged in
      const { getAuthToken } = await import('@/utils/tokenStorage');
      const token = getAuthToken();

      // Créer la contribution ET initier le paiement PayDunya en une seule requête
      // Formater le numéro de téléphone avec l'indicatif
      let formattedPhone: string | undefined = undefined;
      if (paymentPhone.trim()) {
        // Nettoyer le numéro (enlever les espaces et le + s'il est déjà présent)
        const cleanedPhone = paymentPhone.trim().replace(/\s/g, '').replace(/^\+/, '');
        // Ajouter l'indicatif si le numéro ne commence pas déjà par l'indicatif
        if (cleanedPhone && !cleanedPhone.startsWith(selectedCallingCode.replace('+', ''))) {
          formattedPhone = `${selectedCallingCode}${cleanedPhone}`;
        } else if (cleanedPhone) {
          formattedPhone = cleanedPhone.startsWith('+') ? cleanedPhone : `+${cleanedPhone}`;
        }
      }

      console.log('[CONTRIBUTION] Payment phone formatting:', {
        original: paymentPhone,
        callingCode: selectedCallingCode,
        formatted: formattedPhone
      });

      const requestBody: any = {
        amount: contributionAmount,
        currency: moneyPool?.currency || 'XOF',
        message: message.trim() || undefined,
        anonymous: anonymous,
        full_name: paymentFullName.trim(), // Nom complet de l'étape 2
        // Payment information pour initier PayDunya
        customer_name: paymentFullName.trim(),
        customer_email: paymentEmail.trim() || undefined,
        customer_phone: formattedPhone, // Numéro formaté avec indicatif
        payment_method: paymentMethod, // Méthode de paiement choisie
        initiate_payment: true  // Initier le paiement PayDunya après création de la contribution
      };

      console.log('[CONTRIBUTION] Request body:', JSON.stringify(requestBody, null, 2));

      // Stocker les informations du formulaire dans sessionStorage pour les restaurer en cas d'annulation
      sessionStorage.setItem('pending_contribution_data', JSON.stringify({
        paymentFullName,
        paymentEmail,
        paymentPhone,
        selectedCallingCode,
        paymentMethod,
        cardNumber,
        cardExpiry,
        cardCVC,
        contributionAmount,
        message,
        anonymous
      }));

      // Use the same token for the participation request
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept-Language': locale || 'fr',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}/participate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to contribute');
      }

      console.log('[CONTRIBUTION] Response data:', JSON.stringify(data, null, 2));
      console.log('[CONTRIBUTION] Payment initiated?', data.payment_initiated);
      console.log('[CONTRIBUTION] Payment data exists?', !!data.payment);
      console.log('[CONTRIBUTION] Payment error?', data.payment_error);

      // Vérifier si le paiement a été initié
      if (data.payment_initiated === false || data.payment_error) {
        // Le paiement n'a pas été initié - revenir à l'étape 2 avec les informations déjà remplies
        setContributionStep(2);
        setShowContributeModal(true);
        setPaymentProcessing(false);
        setIsContributing(false);

        // Définir l'erreur de paiement pour l'afficher dans le formulaire
        setPaymentError({ type: 'failed' });
        return; // Ne pas fermer le modal, laisser l'utilisateur réessayer
      }

      // Si PayDunya SoftPay a été initié, utiliser l'URL de checkout
      if (data.payment) {
        // Stocker l'invoice_token dans sessionStorage pour vérification après paiement
        const invoiceToken = data.payment.invoice_token;
        console.log('[CONTRIBUTION] Payment response received:', {
          has_invoice_token: !!invoiceToken,
          invoice_token: invoiceToken,
          payment_data: data.payment
        });

        if (invoiceToken) {
          sessionStorage.setItem('pending_payment_token', invoiceToken);
          console.log('[CONTRIBUTION] Stored invoice_token in sessionStorage:', invoiceToken);
          console.log('[CONTRIBUTION] sessionStorage.getItem check:', sessionStorage.getItem('pending_payment_token'));
        } else {
          console.error('[CONTRIBUTION] No invoice_token in payment response!', data.payment);
        }

        // PayDunya renvoie payment_data (pour SDK) ET payment_url (pour redirection fallback)
        const paymentData = data.payment.payment_data;
        const paymentUrl = data.payment.payment_url || data.payment.checkout_url || (paymentData?.checkout_url);

        // Pour SoftPay, on essaie d'abord le SDK, puis on fait fallback vers redirection
        // Si on a payment_data, essayer d'utiliser le SDK (si disponible)
        if (paymentData) {
          console.log('[CONTRIBUTION] PayDunya payment_data received, attempting to use SDK');

          // Pour SoftPay, on utilise le SDK PayDunya directement dans la page (intégration transparente)
          // Charger le SDK PayDunya dynamiquement
          try {
            // Vérifier si le SDK est déjà chargé
            if ((window as any).PayDunyaCheckout) {
              // SDK déjà chargé, utiliser directement
              console.log('[CONTRIBUTION] PayDunya SDK already loaded, using it directly');
              handlePayDunyaPayment(paymentData);
            } else {
              // Vérifier si le script est déjà en cours de chargement
              const existingScript = document.querySelector('script[src="https://cdn.paydunya.com/checkout.js"]');
              if (existingScript) {
                console.log('[CONTRIBUTION] PayDunya SDK script already exists, waiting for it to load...');
                // Attendre que le script existant se charge
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                  attempts++;
                  console.log(`[CONTRIBUTION] Checking for PayDunyaCheckout from existing script (attempt ${attempts}/${maxAttempts})...`);

                  if ((window as any).PayDunyaCheckout) {
                    console.log('[CONTRIBUTION] PayDunyaCheckout is now available from existing script');
                    clearInterval(checkInterval);
                    handlePayDunyaPayment(paymentData);
                  } else if (attempts >= maxAttempts) {
                    console.error('[CONTRIBUTION] PayDunyaCheckout still not available from existing script');
                    clearInterval(checkInterval);
                    setNotification({
                      type: 'error',
                      message: locale === 'fr'
                        ? 'Erreur : Le système de paiement n\'a pas pu être chargé. Veuillez rafraîchir la page et réessayer.'
                        : 'Error: Payment system could not be loaded. Please refresh the page and try again.'
                    });
                    setPaymentProcessing(false);
                    setIsContributing(false);
                  }
                }, 200);
                return; // Ne pas créer un nouveau script
              }

              // Créer un script pour charger le SDK PayDunya
              console.log('[CONTRIBUTION] Creating new script to load PayDunya SDK from https://cdn.paydunya.com/checkout.js');
              const script = document.createElement('script');
              script.src = 'https://cdn.paydunya.com/checkout.js';
              script.async = true;
              script.id = 'paydunya-checkout-script';

              script.onload = () => {
                console.log('[CONTRIBUTION] PayDunya SDK script loaded successfully');
                // Attendre que le SDK soit complètement initialisé
                // Essayer plusieurs fois avec des délais progressifs
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                  attempts++;
                  console.log(`[CONTRIBUTION] Checking for PayDunyaCheckout (attempt ${attempts}/${maxAttempts})...`);

                  if ((window as any).PayDunyaCheckout) {
                    console.log('[CONTRIBUTION] PayDunyaCheckout is now available, calling handlePayDunyaPayment');
                    clearInterval(checkInterval);
                    handlePayDunyaPayment(paymentData);
                  } else if (attempts >= maxAttempts) {
                    console.error('[CONTRIBUTION] PayDunyaCheckout still not available after all attempts');
                    clearInterval(checkInterval);
                    // Fallback : utiliser l'URL de checkout si disponible
                    if (paymentUrl) {
                      console.log('[CONTRIBUTION] SDK not available, falling back to checkout URL:', paymentUrl);
                      window.location.href = paymentUrl;
                      return;
                    }
                    // Pas de fallback disponible
                    setNotification({
                      type: 'error',
                      message: locale === 'fr'
                        ? 'Erreur : Le système de paiement n\'a pas pu être chargé. Veuillez rafraîchir la page et réessayer.'
                        : 'Error: Payment system could not be loaded. Please refresh the page and try again.'
                    });
                    setPaymentProcessing(false);
                    setIsContributing(false);
                  }
                }, 200); // Vérifier toutes les 200ms
              };

              script.onerror = (error) => {
                console.error('[CONTRIBUTION] PayDunya SDK script failed to load:', error);
                // Fallback : utiliser l'URL de checkout si disponible
                if (paymentUrl) {
                  console.log('[CONTRIBUTION] SDK failed to load, falling back to checkout URL:', paymentUrl);
                  window.location.href = paymentUrl;
                  return;
                }
                // Pas de fallback disponible - revenir à l'étape 2
                setContributionStep(2);
                setShowContributeModal(true);
                setPaymentProcessing(false);
                setIsContributing(false);

                // Définir l'erreur de paiement pour l'afficher dans le formulaire
                setPaymentError({ type: 'failed' });
              }

              document.head.appendChild(script);
            }

            return; // Ne pas fermer le modal, attendre le résultat du paiement
          } catch (error) {
            console.error('[CONTRIBUTION] Error loading PayDunya SDK:', error);
            // Fallback : utiliser l'URL de checkout si disponible
            if (paymentUrl) {
              console.log('[CONTRIBUTION] SDK failed, falling back to checkout URL:', paymentUrl);
              window.location.href = paymentUrl;
              return;
            }
            // Pas de fallback disponible - revenir à l'étape 2
            setContributionStep(2);
            setShowContributeModal(true);
            setPaymentProcessing(false);
            setIsContributing(false);

            // Définir l'erreur de paiement pour l'afficher dans le formulaire
            setPaymentError({ type: 'failed' });
          }
        } else if (paymentUrl) {
          // Pas de payment_data mais on a une URL de checkout - utiliser la redirection
          console.log('[CONTRIBUTION] No payment_data but checkout URL available, using redirection:', paymentUrl);
          window.location.href = paymentUrl;
          return; // Ne pas fermer le modal, la redirection va se faire
        } else {
          // Le paiement n'a pas été initié et aucune erreur n'a été retournée
          // Cela ne devrait pas arriver, mais on gère le cas - revenir à l'étape 2
          console.warn('[CONTRIBUTION] No payment data or URL in response, but no error either');
          setContributionStep(2);
          setShowContributeModal(true);
          setPaymentProcessing(false);
          setIsContributing(false);

          // Définir l'erreur de paiement pour l'afficher dans le formulaire
          setPaymentError({ type: 'failed' });
          return; // Ne pas fermer le modal
        }
      }

    } catch (err) {
      console.error('Error contributing:', err);

      // Revenir à l'étape 2 avec les informations déjà remplies
      setContributionStep(2);
      setShowContributeModal(true);
      setPaymentProcessing(false);
      setIsContributing(false);

      // Définir l'erreur de paiement pour l'afficher dans le formulaire
      setPaymentError({ type: 'failed' });
    } finally {
      setIsContributing(false);
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-magenta/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-magenta mx-auto mb-4"></div>
          <p className="text-gray-600">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !moneyPool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-magenta/5 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('notFoundTitle')}
            </h1>
            <p className="text-gray-600 mb-4">
              {error ? error : t('notFoundDescription')}
            </p>
          </div>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-6 py-3 bg-gradient-to-r from-magenta to-sunset text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    );
  }

  // Calculate progress once we have moneyPool data
  const progress = moneyPool ? (moneyPool.settings.target_amount > 0
    ? Math.round((moneyPool.current_amount / moneyPool.settings.target_amount) * 100)
    : 0) : 0;

  return (
    <div className="min-h-screen bg-sand">
      {/* Notification Toast */}
      {/* Notification d'erreur (les succès utilisent maintenant la boîte de dialogue) */}
      {notification && notification.type === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-md bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
        >
          <ExclamationCircleIcon className="h-6 w-6" />
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-white hover:text-gray-200"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Boîte de dialogue de remerciement */}
      {showThankYouDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowThankYouDialog(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture */}
            <button
              onClick={() => setShowThankYouDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={t('accessibility.closeModal')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Contenu de la carte de remerciement */}
            <div className="text-center">
              {/* Icône de succès */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-magenta to-sunset rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-10 w-10 text-white" />
              </div>

              {/* Titre */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {t('thankYouTitle')}
              </h3>

              {/* Message */}
              <p className="text-gray-600 mb-6">
                {t('thankYouMessage')}
              </p>

              {/* Bouton de fermeture */}
              <button
                onClick={() => setShowThankYouDialog(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-magenta to-sunset text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {t('thankYouClose')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-ink-muted hover:text-magenta transition-colors flex items-center gap-1 font-inter"
            >
              <span>{t('home')}</span>
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-cloud" />
            <span className="text-night font-semibold line-clamp-1 font-inter">
              {moneyPool?.name || t('details')}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-night font-inter mb-2">{moneyPool.name}</h1>
        </motion.div>

        {/* Stats Section - Mobile First (visible on mobile, hidden on desktop - will be in sidebar on desktop) */}
        <div className="lg:hidden mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-sm border border-cloud p-6"
          >
            {/* Montant collecté - Mise en évidence */}
            <div className="bg-gradient-to-br from-magenta/10 via-sunset/10 to-coral/10 rounded-2xl p-6 mb-6 border border-magenta/20">
              <div className="text-center">
                <p className="text-sm font-medium text-ink-muted mb-2 font-inter">{t('amountRaised')}</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-magenta to-sunset bg-clip-text text-transparent mb-2 font-inter">
                  {formatCurrency(moneyPool.current_amount, moneyPool.currency)}
                </p>
                <p className="text-sm text-ink-muted font-inter">
                  {t('outOf')} {formatCurrency(moneyPool.settings.target_amount, moneyPool.currency)}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-night text-sm font-semibold font-inter">{t('progress')}</span>
                <span className="text-2xl font-bold text-magenta font-inter">{progress}%</span>
              </div>

              <div className="w-full bg-cloud rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-magenta via-sunset to-coral h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center border-r border-cloud last:border-r-0">
                <div className="p-2 bg-gradient-to-br from-magenta/10 to-sunset/10 rounded-xl w-fit mx-auto mb-2">
                  <UsersIcon className="h-5 w-5 text-magenta" />
                </div>
                <p className="text-xl font-bold text-night font-inter">{moneyPool.current_participants_count}</p>
                <p className="text-xs text-ink-muted font-inter">{t('participants')}</p>
              </div>
              <div className="text-center border-r border-cloud last:border-r-0">
                <div className="p-2 bg-cloud/50 rounded-xl w-fit mx-auto mb-2">
                  <UsersIcon className="h-5 w-5 text-ink-muted" />
                </div>
                <p className="text-xl font-bold text-night font-inter">{moneyPool.max_participants || '∞'}</p>
                <p className="text-xs text-ink-muted font-inter">{t('maximum')}</p>
              </div>
              <div className="text-center">
                <div className="p-2 bg-cloud/50 rounded-xl w-fit mx-auto mb-2">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-ink-muted" />
                </div>
                <p className="text-xl font-bold text-night font-inter">{contributors.length}</p>
                <p className="text-xs text-ink-muted font-inter">{t('contributors')}</p>
              </div>
            </div>

            {/* Contribution Button - Mobile */}
            <button
              onClick={() => setShowContributeModal(true)}
              disabled={moneyPool.status !== 'active'}
              className="w-full mt-4 bg-gradient-to-r from-magenta via-sunset to-coral text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-inter"
            >
              <HeartIconSolid className="h-5 w-5" />
              {moneyPool.status === 'archived' || moneyPool.status === 'closed'
                ? (moneyPool.status === 'closed'
                  ? (locale === 'fr' ? 'Cagnotte clôturée' : 'Money pool closed')
                  : t('poolArchived'))
                : t('contribute')
              }
            </button>

            {/* Share Button - Mobile */}
            <button
              type="button"
              onClick={handleShare}
              disabled={!moneyPool}
              className="w-full mt-3 bg-white border-2 border-magenta text-magenta py-3 px-6 rounded-2xl font-semibold hover:bg-magenta/5 transition-all flex items-center justify-center gap-2 font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShareIcon className="h-5 w-5" />
              {locale === 'fr' ? 'Partager' : 'Share'}
            </button>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Images Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-cloud overflow-hidden"
            >
              <MoneyPoolGallery
                images={moneyPool.images}
                videos={moneyPool.videos || []}
                alt={moneyPool.name}
                className="w-full h-64 sm:h-80 lg:h-96"
              />
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-night mb-4 font-inter flex items-center gap-2">
                <div className="w-1 h-8 bg-gradient-to-b from-magenta to-sunset rounded-full"></div>
                {t('description')}
              </h2>
              <p className="text-base text-ink-muted whitespace-pre-line leading-relaxed font-inter">
                {moneyPool.description}
              </p>
            </motion.div>

            {/* Contributors Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-night mb-6 flex items-center gap-3 flex-wrap font-inter">
                <div className="p-2 bg-gradient-to-br from-magenta/10 to-sunset/10 rounded-xl">
                  <ChatBubbleLeftIcon className="h-6 w-6 text-magenta" />
                </div>
                {t('contributorsAndMessages')}
                <span className="ml-auto px-3 py-1 bg-gradient-to-r from-magenta/10 to-sunset/10 text-magenta rounded-full text-sm font-semibold font-inter">
                  {contributors.length}
                </span>
              </h2>

              <div className="space-y-4">
                {contributors.length > 0 ? (
                  contributors.map((contributor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-cloud pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-night truncate font-inter">
                            {(() => {
                              if (contributor.anonymous) {
                                return t('anonymousContributed');
                              }
                              // Priorité au nom complet s'il est fourni par l'API
                              if (contributor.full_name && contributor.full_name.trim().length > 0) {
                                return `${contributor.full_name} ${t('contributed')}`;
                              }
                              // Si participant_id existe mais pas de full_name, afficher "Contributeur"
                              if (contributor.participant_id) {
                                return `${t('contributor')} ${t('contributed')}`;
                              }
                              // Fallback : si pas anonyme mais pas de nom, afficher "Contributeur"
                              return `${t('contributor')} ${t('contributed')}`;
                            })()}
                          </p>
                          <p className="text-sm text-ink-muted font-inter">
                            {formatCurrency(contributor.amount, moneyPool.currency)}
                          </p>
                        </div>
                        <span className="text-xs text-ink-muted whitespace-nowrap font-inter">
                          {new Date(contributor.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      {contributor.message && (
                        <p className="text-sm text-ink-muted mt-3 italic break-words bg-cloud/30 rounded-xl p-3 font-inter">
                          "{contributor.message}"
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 bg-cloud/30 rounded-full w-fit mx-auto mb-4">
                      <UsersIcon className="h-12 w-12 text-ink-muted" />
                    </div>
                    <p className="text-base text-ink-muted font-inter">
                      {t('noContributors')}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar (Desktop only) */}
          <div className="hidden lg:block space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sticky top-6"
            >
              {/* Progress */}
              <div className="mb-6">
                {/* Montant collecté - Mise en évidence */}
                <div className="bg-gradient-to-br from-magenta/10 via-sunset/10 to-coral/10 rounded-2xl p-6 mb-6 border border-magenta/20">
                  <div className="text-center">
                    <p className="text-sm font-medium text-ink-muted mb-2 font-inter">{t('amountRaised')}</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-magenta to-sunset bg-clip-text text-transparent mb-2 font-inter">
                      {formatCurrency(moneyPool.current_amount, moneyPool.currency)}
                    </p>
                    <p className="text-sm text-ink-muted font-inter">
                      {t('outOf')} {formatCurrency(moneyPool.settings.target_amount, moneyPool.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-night text-sm font-semibold font-inter">{t('progress')}</span>
                  <span className="text-2xl font-bold text-magenta font-inter">{progress}%</span>
                </div>

                <div className="w-full bg-cloud rounded-full h-3 overflow-hidden mb-3">
                  <motion.div
                    className="bg-gradient-to-r from-magenta via-sunset to-coral h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-cloud">
                <div className="text-center">
                  <div className="p-2 bg-gradient-to-br from-magenta/10 to-sunset/10 rounded-xl w-fit mx-auto mb-2">
                    <UsersIcon className="h-6 w-6 text-magenta" />
                  </div>
                  <p className="text-xl font-bold text-night font-inter">{moneyPool.current_participants_count}</p>
                  <p className="text-xs text-ink-muted font-inter">{t('participants')}</p>
                </div>
                <div className="text-center">
                  <div className="p-2 bg-cloud/50 rounded-xl w-fit mx-auto mb-2">
                    <UsersIcon className="h-6 w-6 text-ink-muted" />
                  </div>
                  <p className="text-xl font-bold text-night font-inter">
                    {moneyPool.max_participants || '∞'}
                  </p>
                  <p className="text-xs text-ink-muted font-inter">{t('maximum')}</p>
                </div>
              </div>

              {/* Single Additional Stat */}
              <div className="mb-6 pb-6 border-b border-cloud">
                <div className="text-center">
                  <div className="p-2 bg-cloud/50 rounded-xl w-fit mx-auto mb-2">
                    <ClockIcon className="h-6 w-6 text-ink-muted" />
                  </div>
                  <p className="text-xl font-bold text-night font-inter">
                    {moneyPool.end_date
                      ? new Date(moneyPool.end_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '∞'
                    }
                  </p>
                  <p className="text-xs text-ink-muted font-inter">{t('deadline')}</p>
                </div>
              </div>

              {/* Contribution Button */}
              <button
                onClick={() => setShowContributeModal(true)}
                disabled={moneyPool.status !== 'active'}
                className="w-full bg-gradient-to-r from-magenta via-sunset to-coral text-white py-4 px-6 rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-inter"
              >
                <HeartIconSolid className="h-5 w-5" />
                {moneyPool.status === 'archived' || moneyPool.status === 'closed'
                  ? (moneyPool.status === 'closed'
                    ? (locale === 'fr' ? 'Cagnotte clôturée' : 'Money pool closed')
                    : t('poolArchived'))
                  : t('contribute')
                }
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                disabled={!moneyPool}
                className="w-full bg-white border-2 border-magenta text-magenta py-3 px-6 rounded-2xl font-semibold hover:bg-magenta/5 transition-all flex items-center justify-center gap-2 font-inter mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShareIcon className="h-5 w-5" />
                {locale === 'fr' ? 'Partager' : 'Share'}
              </button>

              {/* Info */}
              <div className="mt-6 space-y-3 text-sm">
                {/* Status: Active, Closed or Archived */}
                <div className="flex items-center text-ink-muted font-inter">
                  <div className={`p-1.5 rounded-lg mr-2 ${moneyPool.status === 'active'
                    ? 'bg-gradient-to-br from-green-400/20 to-green-500/20'
                    : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20'
                    }`}>
                    <CheckBadgeIcon className={`h-4 w-4 ${moneyPool.status === 'active' ? 'text-green-500' : 'text-gray-500'
                      }`} />
                  </div>
                  <span>
                    {moneyPool.status === 'active'
                      ? t('active')
                      : moneyPool.status === 'closed'
                        ? (locale === 'fr' ? 'Clôturée' : 'Closed')
                        : t('archived')
                    }
                  </span>
                </div>

                {/* Verified Status - Always show */}
                <div className="flex items-center text-ink-muted font-inter">
                  <div className={`p-1.5 rounded-lg mr-2 ${moneyPool.verified === true
                    ? 'bg-green-500/20'
                    : 'bg-gray-300/20'
                    }`}>
                    <ShieldCheckIcon className={`h-4 w-4 ${moneyPool.verified === true ? 'text-green-500' : 'text-gray-400'
                      }`} />
                  </div>
                  <span>{moneyPool.verified === true ? t('verified') : t('notVerified')}</span>
                </div>

                {/* Anonymous Allowed */}
                <div className="flex items-center text-ink-muted font-inter">
                  <div className="p-1.5 bg-cloud/50 rounded-lg mr-2">
                    <EyeSlashIcon className="h-4 w-4 text-ink-muted" />
                  </div>
                  <span>{t('anonymousAllowed')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contribution Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
          >
            {/* En-tête avec indicateur d'étape */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {contributionStep === 1 ? t('contributeToPool') : t('paymentInfo.title')}
                </h2>
                <button
                  onClick={() => {
                    setShowContributeModal(false);
                    setContributionStep(1);
                    setPaymentEmail('');
                    setPaymentPhone('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Indicateur de progression */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`flex-1 h-2 rounded-full ${contributionStep >= 1 ? 'bg-gradient-to-r from-magenta to-sunset' : 'bg-gray-200'}`}></div>
                <div className={`flex-1 h-2 rounded-full ${contributionStep >= 2 ? 'bg-gradient-to-r from-magenta to-sunset' : 'bg-gray-200'}`}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span className={contributionStep === 1 ? 'font-semibold text-magenta' : ''}>
                  {t('paymentInfo.step1')}
                </span>
                <span className={contributionStep === 2 ? 'font-semibold text-magenta' : ''}>
                  {t('paymentInfo.step2')}
                </span>
              </div>
            </div>

            {contributionStep === 1 ? (
              /* ÉTAPE 1 : Formulaire de contribution */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('amount')} ({getCurrencySymbol(moneyPool.currency)})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={moneyPool.settings.min_contribution || 0}
                      max={moneyPool.settings.max_contribution || undefined}
                      value={contributionAmount || ''}
                      onChange={(e) => {
                        const newAmount = parseFloat(e.target.value) || 0;
                        setContributionAmount(newAmount);
                        // Recalculer le pourboire automatiquement
                        if (newAmount > 0) {
                          const calculatedTip = Math.round(newAmount * (cocotiTipPercentage / 100));
                          setCocotiTip(calculatedTip);
                        } else {
                          setCocotiTip(0);
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta text-lg font-semibold text-green-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder={
                        moneyPool.settings.min_contribution && moneyPool.settings.max_contribution
                          ? `${formatAmount(moneyPool.settings.min_contribution)} - ${formatAmount(moneyPool.settings.max_contribution)}`
                          : moneyPool.settings.min_contribution
                            ? `${formatAmount(moneyPool.settings.min_contribution)}+`
                            : '0'
                      }
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 font-semibold">
                      {getCurrencySymbol(moneyPool.currency)}
                    </div>
                  </div>

                  {/* Indicateur discret des frais de service Cocoti */}
                  {contributionAmount > 0 && cocotiTip > 0 && (
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <span>+ {formatCurrency(cocotiTip, moneyPool.currency)}</span>
                        <span className="text-gray-500">{t('cocotiServiceFees')}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowTipModify(!showTipModify)}
                        className="text-magenta hover:text-magenta/80 underline text-xs transition-colors"
                      >
                        {showTipModify ? t('hideDetails') : t('adjustSupport')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Section de modification du pourboire - très discrète */}
                {showTipModify && contributionAmount > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {t('tipExplanation')}
                    </p>

                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="number"
                          min={contributionAmount > 0 ? Math.round(contributionAmount * (cocotiTipMin / 100)) : 0}
                          value={cocotiTip || ''}
                          onChange={(e) => {
                            const newTip = parseFloat(e.target.value) || 0;
                            const minTip = contributionAmount > 0 ? Math.round(contributionAmount * (cocotiTipMin / 100)) : 0;
                            const validatedTip = Math.max(newTip, minTip);
                            setCocotiTip(validatedTip);
                            if (contributionAmount > 0) {
                              const percentage = Math.round((validatedTip / contributionAmount) * 100 * 10) / 10;
                              setCocotiTipPercentage(percentage);
                            }
                          }}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-magenta focus:border-magenta"
                        />
                      </div>

                      <input
                        type="range"
                        min={cocotiTipMin}
                        max={cocotiTipMax}
                        step="0.1"
                        value={cocotiTipPercentage}
                        onChange={(e) => {
                          const newPercentage = parseFloat(e.target.value);
                          setCocotiTipPercentage(newPercentage);
                          if (contributionAmount > 0) {
                            setCocotiTip(Math.round(contributionAmount * (newPercentage / 100)));
                          }
                        }}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #ff3a81 0%, #ff3a81 ${((cocotiTipPercentage - cocotiTipMin) / (cocotiTipMax - cocotiTipMin)) * 100}%, #e5e7eb ${((cocotiTipPercentage - cocotiTipMin) / (cocotiTipMax - cocotiTipMin)) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Le nom complet n'est plus demandé dans l'étape 1 */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('message')} ({t('optional')})
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta"
                    rows={3}
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                {/* Option anonyme - seulement si autorisée */}
                {moneyPool?.settings?.allow_anonymous !== false && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={anonymous}
                      onChange={(e) => {
                        setAnonymous(e.target.checked);
                        // La logique de sauvegarde/restauration est gérée par le useEffect
                      }}
                      className="mr-2 h-4 w-4 text-magenta focus:ring-magenta border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-700">
                      {t('contributeAnonymously')}
                    </label>
                  </div>
                )}

                {/* Message si anonyme désactivé */}
                {moneyPool?.settings?.allow_anonymous === false && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    {t('anonymousNotAllowed')}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    onClick={handleContribute}
                    disabled={contributionAmount <= 0 || isContributing}
                    className="w-full px-4 py-2 bg-gradient-to-r from-magenta to-sunset text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('continue')}
                  </button>
                </div>
              </div>
            ) : (
              /* ÉTAPE 2 : Informations de paiement */
              <div className="space-y-4">
                {/* Message d'erreur de paiement */}
                {paymentError.type && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800 mb-1">
                          {paymentError.type === 'cancelled'
                            ? (locale === 'fr' ? 'Paiement annulé' : 'Payment cancelled')
                            : (locale === 'fr' ? 'Paiement refusé' : 'Payment refused')
                          }
                        </h4>
                        <p className="text-sm text-red-700 mb-3">
                          {locale === 'fr'
                            ? 'Votre paiement n\'a pas pu être effectué. Vous pouvez réessayer avec les mêmes informations ou choisir une autre méthode de paiement.'
                            : 'Your payment could not be processed. You can try again with the same information or choose another payment method.'
                          }
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setPaymentError({ type: null });
                              // Réessayer avec les mêmes informations
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                          >
                            {locale === 'fr' ? 'Réessayer' : 'Retry'}
                          </button>
                          <button
                            onClick={() => {
                              setPaymentError({ type: null });
                              setPaymentMethod(''); // Réinitialiser la méthode de paiement
                            }}
                            className="px-4 py-2 bg-white border-2 border-red-600 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                          >
                            {locale === 'fr' ? 'Changer de méthode' : 'Change method'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nom complet - Obligatoire */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {locale === 'fr' ? 'Nom complet' : 'Full name'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentFullName}
                    onChange={(e) => setPaymentFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta"
                    placeholder={locale === 'fr' ? 'Prénom Nom' : 'First Name Last Name'}
                    required
                  />
                </div>

                {/* Email - Optionnel */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('paymentInfo.email')}
                    <span className="text-gray-400 ml-1 text-xs">({t('paymentInfo.emailOptional')})</span>
                  </label>
                  <input
                    type="email"
                    value={paymentEmail}
                    onChange={(e) => setPaymentEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta"
                    placeholder={t('paymentInfo.emailPlaceholder')}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('paymentInfo.emailHelp')}
                  </p>
                </div>

                {/* Sélecteur de méthode de paiement */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {locale === 'fr' ? 'Méthode de paiement' : 'Payment method'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex gap-3 w-full">
                    {/* Wave */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wave')}
                      className={`flex-1 p-2 border-2 rounded-lg transition-all flex items-center justify-center aspect-square ${paymentMethod === 'wave'
                        ? 'border-magenta bg-magenta/5'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      title="Wave"
                    >
                      <WaveIcon className="w-full h-full object-contain" />
                    </button>

                    {/* Orange Money */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('orange_money')}
                      className={`flex-1 p-2 border-2 rounded-lg transition-all flex items-center justify-center aspect-square ${paymentMethod === 'orange_money'
                        ? 'border-magenta bg-magenta/5'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      title="Orange Money"
                    >
                      <OrangeMoneyIcon className="w-full h-full object-contain" />
                    </button>

                    {/* Carte bancaire */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 p-2 border-2 rounded-lg transition-all flex items-center justify-center aspect-square ${paymentMethod === 'card'
                        ? 'border-magenta bg-magenta/5'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                      title={locale === 'fr' ? 'Carte bancaire' : 'Credit/Debit Card'}
                    >
                      <CreditCardIcon className="w-full h-full object-contain" />
                    </button>
                  </div>
                </div>

                {/* Téléphone avec indicatif - Affiché seulement si Wave ou Orange Money */}
                {(paymentMethod === 'wave' || paymentMethod === 'orange_money') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('paymentInfo.phoneNumber')}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-2 min-w-0">
                      {/* Sélecteur d'indicatif (sans nom de pays) - Optimisé pour mobile */}
                      <div className="relative flex-shrink-0 w-auto">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => {
                            const country = countries.find((c: any) => c.code === e.target.value);
                            if (country) {
                              setSelectedCountryCode(country.code);
                              setSelectedCallingCode(country.calling_code || '+221');
                            }
                          }}
                          className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta bg-white appearance-none pr-8 sm:pr-10 text-sm sm:text-base min-w-[90px] sm:min-w-[100px] max-w-[120px]"
                          required
                        >
                          {countries.map((country: any) => (
                            <option key={country.code} value={country.code}>
                              {country.flag_emoji || '🏳️'} {country.calling_code}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 sm:pr-2">
                          <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 rotate-90" />
                        </div>
                      </div>
                      {/* Champ numéro de téléphone - Prend le reste de l'espace */}
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => {
                          // Nettoyer le numéro (enlever les espaces, garder seulement les chiffres)
                          const cleaned = e.target.value.replace(/\s/g, '').replace(/[^\d+]/g, '');
                          setPaymentPhone(cleaned);
                        }}
                        className="flex-1 min-w-0 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta text-sm sm:text-base"
                        placeholder={locale === 'fr' ? '771234567' : '771234567'}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('paymentInfo.phoneHelp')}
                    </p>
                  </div>
                )}

                {/* Champs carte bancaire - Affichés seulement si méthode = card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700">
                      {locale === 'fr' ? 'Informations de la carte bancaire' : 'Card information'}
                    </h4>

                    {/* Numéro de carte */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {locale === 'fr' ? 'Numéro de carte' : 'Card number'}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          // Formater le numéro de carte (espaces tous les 4 chiffres)
                          const cleaned = e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '');
                          const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
                          setCardNumber(formatted);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    {/* Date d'expiration et CVC */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {locale === 'fr' ? 'Date d\'expiration' : 'Expiry date'}
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            // Formater MM/YY
                            const cleaned = e.target.value.replace(/\D/g, '');
                            let formatted = cleaned;
                            if (cleaned.length >= 2) {
                              formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
                            }
                            setCardExpiry(formatted);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          CVC
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={cardCVC}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardCVC(cleaned);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-magenta"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setContributionStep(1)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    {t('paymentInfo.back')}
                  </button>
                  <button
                    onClick={handleContribute}
                    disabled={
                      !paymentFullName.trim() ||
                      !paymentMethod ||
                      paymentProcessing ||
                      isContributing ||
                      (paymentMethod === 'wave' && !paymentPhone.trim()) ||
                      (paymentMethod === 'orange_money' && !paymentPhone.trim()) ||
                      (paymentMethod === 'card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()))
                    }
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-magenta to-sunset text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentProcessing || isContributing
                      ? t('paymentInfo.processing')
                      : `${t('paymentInfo.pay')} ${formatCurrency(contributionAmount + cocotiTip, moneyPool.currency)}`
                    }
                  </button>
                </div>

                {/* Sécurité */}
                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <ShieldCheckIcon className="h-4 w-4" />
                    {t('paymentInfo.securePayment')}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Share Menu with QR */}
      {showShareMenu && moneyPool && (
        <ShareMenuWithQR
          shareUrl={`${APP_CONFIG.WEB_APP_URL}/${locale}/money-pool/${moneyPoolId}`}
          title={moneyPool.name}
          description={moneyPool.description}
          locale={locale}
          onClose={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
