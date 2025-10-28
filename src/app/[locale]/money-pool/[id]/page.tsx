'use client';

import { useState, useEffect } from 'react';
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
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';

interface MoneyPool {
  id: string;
  name: string;
  description: string;
  images: string[];
  status: string;
  visibility: string;
  settings: {
    target_amount: number;
    min_contribution?: number;
    max_contribution?: number;
    allow_recurring_contributions: boolean;
    auto_approve_contributors: boolean;
    cross_country: boolean;
    require_kyc_for_contributors: boolean;
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
  user_id: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  created_at: string;
}

// Helper function to display currency
const formatCurrency = (currency: string): string => {
  if (currency === 'XOF') return 'FCFA';
  return currency;
};

export default function MoneyPoolDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const moneyPoolId = params.id as string;
  const locale = params.locale as string;
  
  const [moneyPool, setMoneyPool] = useState<MoneyPool | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState<number>(0);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

      useEffect(() => {
        const fetchMoneyPool = async () => {
          try {
            setLoading(true);
            console.log('Fetching money pool with ID:', moneyPoolId);
            
            // Fetch money pool details
            const response = await fetch(`http://localhost:8000/api/v1/money-pools/${moneyPoolId}`);
            console.log('Fetch response status:', response.status);
            
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              console.error('Error response:', errorData);
              throw new Error(errorData.detail || `HTTP ${response.status}: Failed to fetch money pool`);
            }
        
        const data = await response.json();
        setMoneyPool(data);
        
        // Fetch contributions
        try {
          const contribResponse = await fetch(`http://localhost:8000/api/v1/money-pools/${moneyPoolId}/contributions?limit=20&page=1`);
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
  }, [moneyPoolId]);

  const handleContribute = async () => {
    if (contributionAmount <= 0) {
      setNotification({
        type: 'error',
        message: locale === 'fr' ? 'Veuillez saisir un montant valide' : 'Please enter a valid amount'
      });
      return;
    }

    // Validate amount against min/max
    if (moneyPool.settings.min_contribution && contributionAmount < moneyPool.settings.min_contribution) {
      setNotification({
        type: 'error',
        message: locale === 'fr' 
          ? `Le montant minimum est ${moneyPool.settings.min_contribution} ${formatCurrency(moneyPool.currency)}`
          : `Minimum amount is ${moneyPool.settings.min_contribution} ${formatCurrency(moneyPool.currency)}`
      });
      return;
    }

    if (moneyPool.settings.max_contribution && contributionAmount > moneyPool.settings.max_contribution) {
      setNotification({
        type: 'error',
        message: locale === 'fr' 
          ? `Le montant maximum est ${moneyPool.settings.max_contribution} ${formatCurrency(moneyPool.currency)}`
          : `Maximum amount is ${moneyPool.settings.max_contribution} ${formatCurrency(moneyPool.currency)}`
      });
      return;
    }

    try {
      setIsContributing(true);
      const response = await fetch(`http://localhost:8000/api/v1/money-pools/${moneyPoolId}/participate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: contributionAmount,
          currency: moneyPool?.currency || 'XOF',
          message: message.trim() || undefined,
          anonymous: anonymous
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to contribute');
      }
      
      // Reload contributions from API
      try {
        const contribResponse = await fetch(`http://localhost:8000/api/v1/money-pools/${moneyPoolId}/contributions?limit=20&page=1`);
        if (contribResponse.ok) {
          const contribData = await contribResponse.json();
          setContributors(contribData.contributions || []);
        }
      } catch (contribErr) {
        console.error('Error reloading contributions:', contribErr);
      }
      
      // Reload money pool data to get updated amount
      const poolResponse = await fetch(`http://localhost:8000/api/v1/money-pools/${moneyPoolId}`);
      if (poolResponse.ok) {
        const poolData = await poolResponse.json();
        setMoneyPool(poolData);
      }
      
      // Reset form
      setContributionAmount(0);
      setMessage('');
      setAnonymous(false);
      setShowContributeModal(false);
      
      // Show success message
      setNotification({
        type: 'success',
        message: locale === 'fr' ? 'Merci pour votre contribution!' : 'Thank you for your contribution!'
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
      
    } catch (err) {
      console.error('Error contributing:', err);
      setNotification({
        type: 'error',
        message: locale === 'fr' 
          ? `Erreur lors de la contribution: ${err instanceof Error ? err.message : 'Unknown error'}`
          : `Error contributing: ${err instanceof Error ? err.message : 'Unknown error'}`
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
            {locale === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (error || !moneyPool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {locale === 'fr' ? 'Erreur lors du chargement de la cagnotte' : 'Error loading money pool'}
          </p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {locale === 'fr' ? 'Retour' : 'Back'}
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header with Back Button */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={() => router.push(`/${locale}`)}
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {locale === 'fr' ? 'Retour' : 'Back'}
          </button>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{moneyPool.name}</h1>
        </div>

        {/* Stats Section - Mobile First (visible on mobile, hidden on desktop - will be in sidebar on desktop) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm font-medium">{locale === 'fr' ? 'Collecté' : 'Raised'}</span>
                <span className="text-xl font-bold text-orange-600">{progress}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <motion.div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{moneyPool.current_amount.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}</span>
                <span>{moneyPool.settings.target_amount.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center border-r border-gray-200 last:border-r-0">
                <UsersIcon className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{moneyPool.current_participants_count}</p>
                <p className="text-xs text-gray-600">{locale === 'fr' ? 'Participants' : 'Participants'}</p>
              </div>
              <div className="text-center border-r border-gray-200 last:border-r-0">
                <UsersIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{moneyPool.max_participants || '∞'}</p>
                <p className="text-xs text-gray-600">{locale === 'fr' ? 'Maximum' : 'Maximum'}</p>
              </div>
              <div className="text-center">
                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{contributors.length}</p>
                <p className="text-xs text-gray-600">{locale === 'fr' ? 'Contributeurs' : 'Contributors'}</p>
              </div>
            </div>

            {/* Contribution Button - Mobile */}
            <button
              onClick={() => setShowContributeModal(true)}
              disabled={moneyPool.status !== 'active'}
              className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <HeartIconSolid className="h-5 w-5" />
              {locale === 'fr' ? 'Contribuer' : 'Contribute'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2">
                {moneyPool.images && moneyPool.images.length > 0 ? (
                  moneyPool.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${moneyPool.name} - ${index + 1}`}
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg"
                    />
                  ))
                ) : (
                  <div className="col-span-3 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <PhotoIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{locale === 'fr' ? 'Description' : 'Description'}</h2>
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line leading-relaxed">
                {moneyPool.description}
              </p>
            </div>

            {/* Contributors Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 flex-wrap">
                <ChatBubbleLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                {locale === 'fr' ? 'Contributeurs et messages' : 'Contributors & Messages'}
                <span className="ml-auto text-sm font-normal text-gray-500">
                  ({contributors.length})
                </span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {contributors.length > 0 ? (
                  contributors.map((contributor, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {contributor.anonymous 
                              ? (locale === 'fr' ? 'Anonyme' : 'Anonymous')
                              : (contributor.user_id === 'current_user' 
                                  ? (locale === 'fr' ? 'Vous' : 'You')
                                  : contributor.user_id)
                            }
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {contributor.amount.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(contributor.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                        </span>
                      </div>
                      {contributor.message && (
                        <p className="text-xs sm:text-sm text-gray-700 mt-2 italic break-words">"{contributor.message}"</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <UsersIcon className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm sm:text-base text-gray-500">
                      {locale === 'fr' ? 'Aucun contributeur pour le moment' : 'No contributors yet'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar (Desktop only) */}
          <div className="hidden lg:block space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600 text-sm font-medium">{locale === 'fr' ? 'Collecté' : 'Raised'}</span>
                  <span className="text-2xl font-bold text-orange-600">{progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                  <motion.div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{moneyPool.current_amount.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}</span>
                  <span>{moneyPool.settings.target_amount.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="text-center">
                  <UsersIcon className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{moneyPool.current_participants_count}</p>
                  <p className="text-xs text-gray-600">{locale === 'fr' ? 'Participants' : 'Participants'}</p>
                </div>
                <div className="text-center">
                  <UsersIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">
                    {moneyPool.max_participants || '∞'}
                  </p>
                  <p className="text-xs text-gray-600">{locale === 'fr' ? 'Maximum' : 'Maximum'}</p>
                </div>
              </div>

              {/* Single Additional Stat */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-center">
                  <ClockIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">
                    {moneyPool.end_date 
                      ? new Date(moneyPool.end_date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')
                      : '∞'
                    }
                  </p>
                  <p className="text-xs text-gray-600">{locale === 'fr' ? 'Échéance' : 'Deadline'}</p>
                </div>
              </div>

              {/* Contribution Button */}
              <button
                onClick={() => setShowContributeModal(true)}
                disabled={moneyPool.status !== 'active'}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <HeartIconSolid className="h-5 w-5" />
                {locale === 'fr' ? 'Soutenir cette cagnotte' : 'Support this pool'}
              </button>

              {/* Info */}
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <CheckBadgeIcon className="h-4 w-4 mr-2 text-green-500" />
                  <span>{locale === 'fr' ? 'Cagnotte active' : 'Active pool'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <EyeSlashIcon className="h-4 w-4 mr-2" />
                  <span>{locale === 'fr' ? 'Anonyme autorisé' : 'Anonymous allowed'}</span>
                </div>
              </div>
            </div>
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
              {locale === 'fr' ? 'Contribuer à cette cagnotte' : 'Contribute to this pool'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {locale === 'fr' ? 'Montant' : 'Amount'} ({formatCurrency(moneyPool.currency)})
                </label>
                <input
                  type="number"
                  min={moneyPool.settings.min_contribution || 0}
                  max={moneyPool.settings.max_contribution || undefined}
                  value={contributionAmount || ''}
                  onChange={(e) => setContributionAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={moneyPool.settings.min_contribution 
                    ? `${moneyPool.settings.min_contribution}${moneyPool.settings.max_contribution ? ` - ${moneyPool.settings.max_contribution}` : '+'} ${formatCurrency(moneyPool.currency)}`
                    : '0'
                  }
                />
                {(moneyPool.settings.min_contribution || moneyPool.settings.max_contribution) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {locale === 'fr' ? 'Limite: ' : 'Limit: '}
                    {moneyPool.settings.min_contribution && (
                      <span>Min: {moneyPool.settings.min_contribution.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}</span>
                    )}
                    {moneyPool.settings.min_contribution && moneyPool.settings.max_contribution && ' • '}
                    {moneyPool.settings.max_contribution && (
                      <span>Max: {moneyPool.settings.max_contribution.toLocaleString('fr-FR')} {formatCurrency(moneyPool.currency)}</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {locale === 'fr' ? 'Message' : 'Message'} ({locale === 'fr' ? 'optionnel' : 'optional'})
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder={locale === 'fr' ? 'Ajoutez un message de soutien...' : 'Add a support message...'}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  {locale === 'fr' ? 'Contribuer anonymement' : 'Contribute anonymously'}
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowContributeModal(false);
                    setMessage('');
                    setContributionAmount(0);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {locale === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={handleContribute}
                  disabled={contributionAmount <= 0 || isContributing}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isContributing 
                    ? (locale === 'fr' ? 'En cours...' : 'Processing...') 
                    : (locale === 'fr' ? 'Contribuer' : 'Contribute')
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
