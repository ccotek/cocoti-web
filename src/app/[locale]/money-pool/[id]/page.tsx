'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import MoneyPoolGallery from '@/components/MoneyPoolGallery';
import Link from 'next/link';

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
  user_id: string | null;
  full_name?: string | null;
  amount: number;
  message?: string;
  anonymous: boolean;
  created_at: string;
}

// Helper function to display currency with amount
const formatCurrency = (amount: number, currency: string): string => {
  const formattedAmount = amount.toLocaleString('fr-FR');
  if (currency === 'XOF') return `${formattedAmount} FCFA`;
  return `${formattedAmount} ${currency}`;
};

// Helper function to display currency symbol/name only
const getCurrencySymbol = (currency: string): string => {
  if (currency === 'XOF') return 'FCFA';
  return currency;
};

export default function MoneyPoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const moneyPoolId = params.id as string;
  const locale = params.locale as string;
  
  // API URL configuration (same as money-pools list page)
  const API_URL = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return baseUrl.endsWith('/api/v1') ? baseUrl.replace('/api/v1', '') : baseUrl;
  }, []);
  
  // Helper function for translations using JSON files
  const t = (key: string): string => {
    // Import translations from JSON files
    const frTranslations = {
      active: 'Cagnotte active',
      archived: 'Cagnotte archivée',
      verified: 'Cagnotte vérifiée',
      notVerified: 'Non vérifiée',
      anonymousAllowed: 'Anonyme autorisé',
      contribute: 'Contribuer maintenant',
      view: 'Voir',
      raised: 'Collecté',
      outOf: 'sur un objectif de',
      progress: 'Progression',
      participants: 'Participants',
      maximum: 'Maximum',
      contributors: 'Contributeurs',
      description: 'Description',
      contributorsAndMessages: 'Contributeurs et messages',
      anonymousContributed: 'Anonyme a participé',
      contributed: 'a participé',
      youContributed: 'Vous avez participé',
      contributor: 'Contributeur a participé',
      finished: 'Terminée',
      completed: 'Complétée',
      closed: 'Fermée',
      verifiedPool: 'Cagnotte vérifiée',
      notFound: 'Cagnotte introuvable',
      notFoundDescription: 'Cette cagnotte n\'existe pas ou a été supprimée.',
      notFoundTitle: 'Cagnotte introuvable',
      backToHome: 'Retour à l\'accueil',
      loading: 'Chargement...',
      home: 'Accueil',
      moneyPools: 'Cagnottes',
      details: 'Détails',
      amountRaised: 'Montant collecté',
      deadline: 'Échéance',
      contributeToPool: 'Contribuer à cette cagnotte',
      amount: 'Montant',
      limits: 'Limites: ',
      fullName: 'Nom complet',
      fullNamePlaceholder: 'Votre nom complet',
      message: 'Message',
      optional: 'optionnel',
      messagePlaceholder: 'Ajoutez un message de soutien...',
      contributeAnonymously: 'Contribuer anonymement',
      cancel: 'Annuler',
      processing: 'En cours...',
      noContributors: 'Aucun contributeur pour le moment',
      enterValidAmount: 'Veuillez saisir un montant valide',
      enterFullName: 'Veuillez saisir votre nom complet',
      minAmount: 'Le montant minimum est',
      maxAmount: 'Le montant maximum est',
      thankYou: 'Merci pour votre contribution!',
      contributionError: 'Erreur lors de la contribution:',
      errorContributing: 'Error contributing:'
    };
    
    const enTranslations = {
      active: 'Active pool',
      archived: 'Archived pool',
      verified: 'Verified pool',
      notVerified: 'Not verified',
      anonymousAllowed: 'Anonymous allowed',
      contribute: 'Contribute Now',
      view: 'View',
      raised: 'Raised',
      outOf: 'out of target',
      progress: 'Progress',
      participants: 'Participants',
      maximum: 'Maximum',
      contributors: 'Contributors',
      description: 'Description',
      contributorsAndMessages: 'Contributors & Messages',
      anonymousContributed: 'Anonymous contributed',
      contributed: 'contributed',
      youContributed: 'You contributed',
      contributor: 'Contributor',
      finished: 'Finished',
      completed: 'Completed',
      closed: 'Closed',
      verifiedPool: 'Verified pool',
      notFound: 'Money pool not found',
      notFoundDescription: 'This money pool does not exist or has been removed.',
      notFoundTitle: 'Money Pool Not Found',
      backToHome: 'Back to Home',
      loading: 'Loading...',
      home: 'Home',
      moneyPools: 'Money Pools',
      details: 'Details',
      amountRaised: 'Amount Raised',
      deadline: 'Deadline',
      contributeToPool: 'Contribute to this pool',
      amount: 'Amount',
      limits: 'Limits: ',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Your full name',
      message: 'Message',
      optional: 'optional',
      messagePlaceholder: 'Add a support message...',
      contributeAnonymously: 'Contribute anonymously',
      cancel: 'Cancel',
      processing: 'Processing...',
      noContributors: 'No contributors yet',
      enterValidAmount: 'Please enter a valid amount',
      enterFullName: 'Please enter your full name',
      minAmount: 'Minimum amount is',
      maxAmount: 'Maximum amount is',
      thankYou: 'Thank you for your contribution!',
      contributionError: 'Error contributing:',
      errorContributing: 'Error contributing:'
    };
    
    const translations = locale === 'fr' ? frTranslations : enTranslations;
    return translations[key as keyof typeof translations] || key;
  };
  
  const [moneyPool, setMoneyPool] = useState<MoneyPool | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Vérifier si l'utilisateur est connecté
  const [userFullName, setUserFullName] = useState<string | null>(null); // Nom complet de l'utilisateur connecté
  const savedFullNameRef = useRef<string>(''); // Sauvegarder le nom saisi avant de cocher anonyme (ref pour éviter les re-renders)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPaymentStep, setShowPaymentStep] = useState(false); // Afficher l'étape de sélection du moyen de paiement
  const [paymentProviders, setPaymentProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(false);

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
                errorMessage = locale === 'fr' 
                  ? 'Cette cagnotte n\'existe pas ou a été supprimée.' 
                  : 'This money pool does not exist or has been removed.';
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

  // Préremplir le nom quand le modal s'ouvre (si vide)
  useEffect(() => {
    if (showContributeModal && !fullName.trim()) {
      // Priorité à la valeur sauvegardée, sinon utiliser userFullName
      if (savedFullNameRef.current.trim()) {
        setFullName(savedFullNameRef.current);
      } else if (userFullName) {
        setFullName(userFullName);
      }
    }
  }, [showContributeModal, userFullName]);

  const handleContribute = async () => {
    if (!moneyPool) {
      setNotification({
        type: 'error',
        message: t('notFound')
      });
      return;
    }

    // Vérifier que la cagnotte n'est pas archivée
    if (moneyPool.status === 'archived') {
      setNotification({
        type: 'error',
        message: locale === 'fr' 
          ? 'Cette cagnotte est archivée. Les fonds ont été récupérés.' 
          : 'This money pool is archived. Funds have been collected.'
      });
      setShowContributeModal(false);
      return;
    }

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
        message: `${t('minAmount')} ${moneyPool.settings.min_contribution.toLocaleString('fr-FR')} ${getCurrencySymbol(moneyPool.currency)}`
      });
      return;
    }

    if (moneyPool.settings.max_contribution && contributionAmount > moneyPool.settings.max_contribution) {
      setNotification({
        type: 'error',
        message: `${t('maxAmount')} ${moneyPool.settings.max_contribution.toLocaleString('fr-FR')} ${getCurrencySymbol(moneyPool.currency)}`
      });
      return;
    }

    // Validation : le nom complet est toujours obligatoire (même si anonyme)
    if (!fullName.trim()) {
      setNotification({
        type: 'error',
        message: locale === 'fr' ? 'Le nom complet est obligatoire' : 'Full name is required'
      });
      return;
    }

    // Passer à l'étape de sélection du moyen de paiement
    setShowPaymentStep(true);
  };

  // Charger les providers de paiement
  useEffect(() => {
    const fetchPaymentProviders = async () => {
      if (!showPaymentStep || !moneyPool) return;
      
      try {
        setLoadingProviders(true);
        const countryCode = moneyPool.country || undefined;
        const currency = moneyPool.currency || undefined;
        
        const params = new URLSearchParams();
        if (countryCode) params.append('country_code', countryCode);
        if (currency) params.append('currency', currency);
        
        const response = await fetch(`${API_URL}/api/v1/money-pools/payment-methods/public?${params.toString()}`);
        if (response.ok) {
          const providers = await response.json();
          setPaymentProviders(providers);
        } else {
          console.error('Failed to fetch payment providers');
          setPaymentProviders([]);
        }
      } catch (error) {
        console.error('Error fetching payment providers:', error);
        setPaymentProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchPaymentProviders();
  }, [showPaymentStep, moneyPool, API_URL]);

  const handlePaymentMethodSelected = async () => {
    if (!selectedProvider) {
      setNotification({
        type: 'error',
        message: locale === 'fr' ? 'Veuillez sélectionner un moyen de paiement' : 'Please select a payment method'
      });
      return;
    }

    // Continuer avec la contribution
    await processContribution();
  };

  const processContribution = async () => {
    if (!moneyPool) return;

    try {
      setIsContributing(true);
      
      const requestBody: any = {
        amount: contributionAmount,
        currency: moneyPool?.currency || 'XOF',
        message: message.trim() || undefined,
        anonymous: anonymous,
        full_name: fullName.trim(), // Toujours envoyer le nom complet (même si anonyme)
        payment_provider_id: selectedProvider // Ajouter le provider sélectionné
      };
      
      // Get auth token if user is logged in
      const { getAuthToken } = await import('@/utils/tokenStorage');
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
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
      
      // Reload contributions from API
      try {
        const contribResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}/contributions?limit=20&page=1`);
        if (contribResponse.ok) {
          const contribData = await contribResponse.json();
          setContributors(contribData.contributions || []);
        }
      } catch (contribErr) {
        console.error('Error reloading contributions:', contribErr);
      }
      
      // Reload money pool data to get updated amount
      const poolResponse = await fetch(`${API_URL}/api/v1/money-pools/${moneyPoolId}`);
      if (poolResponse.ok) {
        const poolData = await poolResponse.json();
        setMoneyPool(poolData);
      }
      
      // Reset form
      setContributionAmount(0);
      setMessage('');
      setAnonymous(false);
      setFullName('');
      savedFullNameRef.current = ''; // Réinitialiser la valeur sauvegardée
      setShowPaymentStep(false);
      setSelectedProvider(null);
      setShowContributeModal(false);
      
      // Show success message
      setNotification({
        type: 'success',
        message: t('thankYou')
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
      
    } catch (err) {
      console.error('Error contributing:', err);
      setNotification({
        type: 'error',
        message: `${t('contributionError')} ${err instanceof Error ? err.message : 'Unknown error'}`
      });
    } finally {
      setIsContributing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !moneyPool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
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
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
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
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 max-w-md ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          } px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}
        >
          {notification.type === 'success' ? (
            <CheckCircleIcon className="h-6 w-6" />
          ) : (
            <ExclamationCircleIcon className="h-6 w-6" />
          )}
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-white hover:text-gray-200"
          >
            ✕
          </button>
        </motion.div>
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
            <Link 
              href={`/${locale}/money-pools`}
              className="text-ink-muted hover:text-magenta transition-colors font-inter"
            >
              {t('moneyPools')}
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
              {moneyPool.status === 'archived' 
                ? (locale === 'fr' ? 'Cagnotte archivée' : 'Pool archived')
                : t('contribute')
              }
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
                              // Priorité au nom complet s'il est fourni par l'API ou la saisie
                              if (contributor.full_name && contributor.full_name.trim().length > 0) {
                                return `${contributor.full_name} ${t('contributed')}`;
                              }
                              // Affichage spécifique pour l'utilisateur courant
                              if (contributor.user_id === 'current_user') {
                                return t('youContributed');
                              }
                              // Fallback générique si aucun nom exploitable
                              return t('contributor');
                            })()}
                          </p>
                          <p className="text-sm text-ink-muted font-inter">
                            {formatCurrency(contributor.amount, moneyPool.currency)}
                          </p>
                        </div>
                        <span className="text-xs text-ink-muted whitespace-nowrap font-inter">
                          {new Date(contributor.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
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
                      ? new Date(moneyPool.end_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')
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
                {moneyPool.status === 'archived' 
                  ? (locale === 'fr' ? 'Cagnotte archivée' : 'Pool archived')
                  : t('contribute')
                }
              </button>

              {/* Info */}
              <div className="mt-6 space-y-3 text-sm">
                {/* Status: Active or Archived */}
                <div className="flex items-center text-ink-muted font-inter">
                  <div className={`p-1.5 rounded-lg mr-2 ${
                    moneyPool.status === 'active' 
                      ? 'bg-gradient-to-br from-green-400/20 to-green-500/20' 
                      : 'bg-gradient-to-br from-gray-400/20 to-gray-500/20'
                  }`}>
                    <CheckBadgeIcon className={`h-4 w-4 ${
                      moneyPool.status === 'active' ? 'text-green-500' : 'text-gray-500'
                    }`} />
                  </div>
                  <span>{moneyPool.status === 'active' ? t('active') : t('archived')}</span>
                </div>
                
                {/* Verified Status - Always show */}
                <div className="flex items-center text-ink-muted font-inter">
                  <div className={`p-1.5 rounded-lg mr-2 ${
                    moneyPool.verified === true 
                      ? 'bg-green-500/20' 
                      : 'bg-gray-300/20'
                  }`}>
                    <ShieldCheckIcon className={`h-4 w-4 ${
                      moneyPool.verified === true ? 'text-green-500' : 'text-gray-400'
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
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('contributeToPool')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('amount')} ({getCurrencySymbol(moneyPool.currency)})
                </label>
                <input
                  type="number"
                  min={moneyPool.settings.min_contribution || 0}
                  max={moneyPool.settings.max_contribution || undefined}
                  value={contributionAmount || ''}
                  onChange={(e) => setContributionAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={
                    moneyPool.settings.min_contribution && moneyPool.settings.max_contribution
                      ? `${moneyPool.settings.min_contribution.toLocaleString('fr-FR')} - ${moneyPool.settings.max_contribution.toLocaleString('fr-FR')} ${getCurrencySymbol(moneyPool.currency)}`
                      : moneyPool.settings.min_contribution
                      ? `${moneyPool.settings.min_contribution.toLocaleString('fr-FR')}+ ${getCurrencySymbol(moneyPool.currency)}`
                      : '0'
                  }
                />
                {(moneyPool.settings.min_contribution || moneyPool.settings.max_contribution) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('limits')}
                    {moneyPool.settings.min_contribution && (
                      <span>Min: {moneyPool.settings.min_contribution.toLocaleString('fr-FR')} {getCurrencySymbol(moneyPool.currency)}</span>
                    )}
                    {moneyPool.settings.min_contribution && moneyPool.settings.max_contribution && ' • '}
                    {moneyPool.settings.max_contribution && (
                      <span>Max: {moneyPool.settings.max_contribution.toLocaleString('fr-FR')} {getCurrencySymbol(moneyPool.currency)}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Nom complet - toujours affiché et obligatoire */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('fullName')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={t('fullNamePlaceholder')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('message')} ({t('optional')})
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    {t('contributeAnonymously')}
                  </label>
                </div>
              )}
              
              {/* Message si anonyme désactivé */}
              {moneyPool?.settings?.allow_anonymous === false && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  {locale === 'fr' 
                    ? 'Les contributions anonymes ne sont pas autorisées pour cette cagnotte.' 
                    : 'Anonymous contributions are not allowed for this money pool.'}
                </div>
              )}

              {!showPaymentStep ? (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setShowContributeModal(false);
                      setMessage('');
                      setContributionAmount(0);
                      setAnonymous(false);
                      setFullName('');
                      // Réinitialiser la valeur sauvegardée pour la prochaine ouverture
                      savedFullNameRef.current = '';
                      setShowPaymentStep(false);
                      setSelectedProvider(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleContribute}
                    disabled={contributionAmount <= 0 || isContributing || !fullName.trim()}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {locale === 'fr' ? 'Continuer' : 'Continue'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {locale === 'fr' ? 'Sélectionnez un moyen de paiement' : 'Select a payment method'}
                  </h3>
                  
                  {loadingProviders ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="mt-2 text-gray-600">
                        {locale === 'fr' ? 'Chargement des moyens de paiement...' : 'Loading payment methods...'}
                      </p>
                    </div>
                  ) : paymentProviders.length === 0 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                      {locale === 'fr' 
                        ? 'Aucun moyen de paiement disponible pour cette cagnotte.' 
                        : 'No payment method available for this money pool.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {paymentProviders.map((method: any) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedProvider(method.id)}
                          className={`p-6 border-2 rounded-lg text-center transition-all flex flex-col items-center justify-center ${
                            selectedProvider === method.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            {/* Icon - use emoji as primary, image as fallback */}
                            <div className="w-16 h-16 flex items-center justify-center text-5xl">
                              {method.id === 'mobile_money' ? '📱' : '💳'}
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-gray-800 text-lg">
                                {locale === 'fr' ? (method.name_fr || method.name) : (method.name_en || method.name)}
                              </p>
                              {method.providers && method.providers.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {method.providers.map((p: any) => p.name).join(', ')}
                                </p>
                              )}
                            </div>
                            {selectedProvider === method.id && (
                              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center mt-2">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowPaymentStep(false);
                        setSelectedProvider(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {locale === 'fr' ? 'Retour' : 'Back'}
                    </button>
                    <button
                      onClick={handlePaymentMethodSelected}
                      disabled={!selectedProvider || isContributing}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isContributing 
                        ? (locale === 'fr' ? 'Traitement...' : 'Processing...')
                        : (locale === 'fr' ? 'Payer' : 'Pay')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
