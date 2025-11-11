'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HeartIcon,
  HomeIcon,
  ChevronRightIcon,
  PlusIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import MoneyPoolGallery from '@/components/MoneyPoolGallery';
import Link from 'next/link';

interface PublicMoneyPool {
  id: string;
  name: string;
  description: string;
  images: string[];
  videos?: string[];
  settings: {
    target_amount: number;
    min_contribution?: number;
    max_contribution?: number;
  };
  currency: string;
  current_amount: number;
  current_participants_count: number;
  country: string;
  start_date?: string;
  end_date?: string;
  verified?: boolean;
  status?: string; // 'active', 'draft', 'archived', 'closed', 'cancelled', 'fulfilled'
}

const formatCurrency = (amount: number, currency: string): string => {
  if (currency === 'XOF') return `${amount.toLocaleString('fr-FR')} FCFA`;
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
};

export default function MoneyPoolsListPage() {
  const params = useParams();
  const locale = params.locale as 'fr' | 'en';
  
  const [moneyPools, setMoneyPools] = useState<PublicMoneyPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 12;
  // Increase limit to fetch more pools so we can separate active/archived properly
  const fetchLimit = 100; // Fetch more to ensure we get both active and archived

  const API_URL = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return baseUrl.endsWith('/api/v1') ? baseUrl.replace('/api/v1', '') : baseUrl;
  }, []);

  useEffect(() => {
    const fetchMoneyPools = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build URL - fetch more to ensure we get both active and archived
        const params = new URLSearchParams({
          limit: fetchLimit.toString(),
          page: '1' // Always fetch from page 1, we'll paginate client-side
        });
        
        const url = `${API_URL}/api/v1/money-pools/public?${params.toString()}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch money pools: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle both array format (legacy) and object format (new with pagination)
        let pools: PublicMoneyPool[];
        if (Array.isArray(data)) {
          pools = data;
          setTotal(data.length < limit ? (page - 1) * limit + data.length : page * limit + 1);
        } else {
          pools = data.data || data.results || [];
          setTotal(data.total || pools.length);
        }
        
        // Map and validate pools data from API
        const mappedPools: PublicMoneyPool[] = pools.map((pool: any) => {
          const status = pool.status || 'active';
          return {
            id: pool.id || pool._id,
            name: pool.name || '',
            description: pool.description || '',
            images: pool.images || [],
            videos: pool.videos || [],
            settings: {
              target_amount: pool.settings?.target_amount || pool.target_amount || 0,
              min_contribution: pool.settings?.min_contribution || pool.min_contribution,
              max_contribution: pool.settings?.max_contribution || pool.max_contribution
            },
            currency: pool.currency || 'XOF',
            current_amount: pool.current_amount || 0,
            current_participants_count: pool.current_participants_count || 0, // Use actual count from API
            country: pool.country || 'SN',
            start_date: pool.start_date,
            end_date: pool.end_date,
            verified: pool.verified || false,
            status: status
          };
        }).filter(pool => pool.id && pool.name); // Filter out invalid pools
        
        setMoneyPools(mappedPools);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching money pools:', err);
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      }
    };

    fetchMoneyPools();
  }, [API_URL, fetchLimit]); // Remove page dependency, fetch all then paginate client-side

  // Filter pools by search
  // Separate active and archived pools for display
  // Then paginate each group separately
  const { activePools, archivedPools, paginatedActivePools, paginatedArchivedPools } = useMemo(() => {
    let filtered = moneyPools;
    
    // Apply search filter if needed
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pool => 
        pool.name.toLowerCase().includes(query) ||
        pool.description.toLowerCase().includes(query)
      );
    }
    
    // Separate by status (normalize to lowercase for comparison)
    // Active pools only
    const active = filtered.filter(pool => {
      const status = (pool.status || 'active').toLowerCase();
      return status === 'active';
    });
    // Archived and closed pools (treat closed as archived for public display)
    const archived = filtered.filter(pool => {
      const status = (pool.status || '').toLowerCase();
      return status === 'archived' || status === 'closed';
    });
    
    
    // Paginate active pools (always show first page of active)
    const activeStart = 0;
    const activeEnd = activeStart + limit;
    const paginatedActive = active.slice(activeStart, activeEnd);
    
    // Paginate archived pools (always show first page of archived)
    const archivedStart = 0;
    const archivedEnd = archivedStart + limit;
    const paginatedArchived = archived.slice(archivedStart, archivedEnd);
    
    return { 
      activePools: active, 
      archivedPools: archived,
      paginatedActivePools: paginatedActive,
      paginatedArchivedPools: paginatedArchived
    };
  }, [moneyPools, searchQuery, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-sand">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link 
              href={`/${locale}`}
              className="text-ink-muted hover:text-magenta transition-colors flex items-center gap-1 font-inter"
            >
              <HomeIcon className="h-4 w-4" />
              <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
            </Link>
            <ChevronRightIcon className="h-4 w-4 text-cloud" />
            <span className="text-night font-semibold font-inter">
              {locale === 'fr' ? 'Cagnottes' : 'Money Pools'}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-magenta/5 via-sunset/5 to-coral/5 border-b border-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-night font-inter">
                  {locale === 'fr' ? 'Toutes les cagnottes' : 'All Money Pools'}
                </h1>
                <p className="mt-2 text-lg text-ink-muted font-inter">
                  {locale === 'fr' 
                    ? 'Découvrez et soutenez les projets solidaires de la communauté' 
                    : 'Discover and support community solidarity projects'}
                </p>
              </div>
              <Link
                href={`/${locale}/money-pool/create`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all font-inter whitespace-nowrap"
              >
                <PlusIcon className="h-5 w-5" />
                {locale === 'fr' ? 'Créer une cagnotte' : 'Create Money Pool'}
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-muted" />
                <input
                  type="text"
                  placeholder={locale === 'fr' ? 'Rechercher une cagnotte...' : 'Search for a money pool...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all shadow-sm hover:shadow-md font-inter"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">
              {locale === 'fr' ? 'Chargement...' : 'Loading...'}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && paginatedActivePools.length === 0 && archivedPools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery 
                ? (locale === 'fr' ? 'Aucune cagnotte trouvée pour votre recherche.' : 'No money pools found for your search.')
                : (locale === 'fr' ? 'Aucune cagnotte publique disponible.' : 'No public money pools available.')
              }
            </p>
          </div>
        )}

        {!loading && !error && (paginatedActivePools.length > 0 || archivedPools.length > 0) && (
          <>
            {/* Active Pools Section */}
            {paginatedActivePools.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-night mb-6 font-inter">
                  {locale === 'fr' ? 'Cagnottes actives' : 'Active Money Pools'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {activePools.map((pool, index) => {
                    const progress = pool.settings.target_amount > 0
                      ? Math.round((pool.current_amount / pool.settings.target_amount) * 100)
                      : 0;
                    
                    return (
                      <motion.div
                        key={pool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        whileHover={{ y: -4 }}
                      >
                        <Link href={`/${locale}/money-pool/${pool.id}`}>
                          <div className="bg-white rounded-3xl shadow-sm border border-cloud hover:shadow-glow transition-all cursor-pointer h-full flex flex-col group relative">
                            {/* Badge vérifié - Coin supérieur droit de la carte */}
                            {pool.verified && (
                              <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2 shadow-lg z-30 border-2 border-white" title={locale === 'fr' ? 'Cagnotte vérifiée' : 'Verified money pool'}>
                                <ShieldCheckIcon className="h-5 w-5 text-white" />
                              </div>
                            )}
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-magenta/10 to-sunset/10">
                              <MoneyPoolGallery
                                images={pool.images || []}
                                videos={pool.videos || []}
                                alt={pool.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {/* Badge type */}
                              <div className="absolute top-4 left-4">
                                <span className="bg-white/95 backdrop-blur-sm text-magenta px-3 py-1 rounded-full text-xs font-semibold font-inter shadow-sm">
                                  {locale === 'fr' ? 'Cagnotte' : 'Money Pool'}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-night mb-2 line-clamp-2 font-inter group-hover:text-magenta transition-colors">
                                {pool.name}
                              </h3>
                              <p className="text-sm text-ink-muted mb-4 line-clamp-3 flex-1 font-inter">
                                {pool.description.length > 150 
                                  ? `${pool.description.substring(0, 150)}...` 
                                  : pool.description}
                              </p>

                              {/* Progress */}
                              <div className="mb-4">
                                <div className="flex justify-between text-xs text-night mb-2 font-semibold font-inter">
                                  <span>{locale === 'fr' ? 'Collecté' : 'Raised'}</span>
                                  <span className="text-magenta">{progress}%</span>
                                </div>
                                <div className="w-full bg-cloud rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    className="bg-gradient-to-r from-magenta via-sunset to-coral h-3 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-ink-muted mt-2 font-inter">
                                  <span className="font-semibold">{formatCurrency(pool.current_amount, pool.currency)}</span>
                                  <span>{formatCurrency(pool.settings.target_amount, pool.currency)}</span>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center justify-between text-sm pt-4 border-t border-cloud">
                                <div className="flex items-center gap-2 text-ink-muted font-inter">
                                  <HeartIcon className="h-4 w-4 text-magenta" />
                                  <span>
                                    {pool.current_participants_count} {locale === 'fr' ? 'contributeurs' : 'contributors'}
                                  </span>
                                </div>
                                <span className="text-magenta font-semibold flex items-center gap-1 group-hover:gap-2 transition-all font-inter">
                                  {locale === 'fr' ? 'Voir' : 'View'}
                                  <ChevronRightIcon className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Separator between Active and Archived */}
            {paginatedActivePools.length > 0 && archivedPools.length > 0 && (
              <div className="my-12 flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cloud to-transparent"></div>
                <div className="px-4 py-2 bg-cloud/50 rounded-full">
                  <span className="text-sm font-semibold text-ink-muted font-inter">
                    {locale === 'fr' ? 'Historique' : 'History'}
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cloud to-transparent"></div>
              </div>
            )}

            {/* Archived Pools Section */}
            {archivedPools.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-night mb-6 font-inter opacity-75">
                  {locale === 'fr' ? 'Cagnottes archivées' : 'Archived Money Pools'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {paginatedArchivedPools.map((pool, index) => {
                    const progress = pool.settings.target_amount > 0
                      ? Math.round((pool.current_amount / pool.settings.target_amount) * 100)
                      : 0;

                    return (
                      <motion.div
                        key={pool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                      >
                        <Link href={`/${locale}/money-pool/${pool.id}`}>
                          <div className="bg-white rounded-3xl shadow-sm border border-cloud opacity-75 h-full flex flex-col group cursor-pointer hover:opacity-90 transition-opacity relative">
                            {/* Badge vérifié - Coin supérieur droit de la carte */}
                            {pool.verified && (
                              <div className="absolute top-3 right-3 bg-green-500 rounded-full p-2 shadow-lg z-30 border-2 border-white" title={locale === 'fr' ? 'Cagnotte vérifiée' : 'Verified money pool'}>
                                <ShieldCheckIcon className="h-5 w-5 text-white" />
                              </div>
                            )}
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-magenta/10 to-sunset/10">
                              <MoneyPoolGallery
                                images={pool.images || []}
                                videos={pool.videos || []}
                                alt={pool.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Badge statut */}
                              <div className="absolute top-4 left-4">
                                <span className="bg-gray-500/95 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold font-inter shadow-sm">
                                  {pool.status?.toLowerCase() === 'closed' 
                                    ? (locale === 'fr' ? 'Clôturée' : 'Closed')
                                    : (locale === 'fr' ? 'Archivée' : 'Archived')}
                                </span>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                              <h3 className="text-xl font-bold text-night mb-2 line-clamp-2 font-inter group-hover:text-magenta transition-colors">
                                {pool.name}
                              </h3>
                              <p className="text-sm text-ink-muted mb-4 line-clamp-3 flex-1 font-inter">
                                {pool.description.length > 150 
                                  ? `${pool.description.substring(0, 150)}...` 
                                  : pool.description}
                              </p>

                              {/* Progress */}
                              <div className="mb-4">
                                <div className="flex justify-between text-xs text-night mb-2 font-semibold font-inter">
                                  <span>{locale === 'fr' ? 'Collecté' : 'Raised'}</span>
                                  <span className="text-magenta">{progress}%</span>
                                </div>
                                <div className="w-full bg-cloud rounded-full h-3 overflow-hidden">
                                  <motion.div
                                    className="bg-gradient-to-r from-magenta via-sunset to-coral h-3 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-ink-muted mt-2 font-inter">
                                  <span className="font-semibold">{formatCurrency(pool.current_amount, pool.currency)}</span>
                                  <span>{formatCurrency(pool.settings.target_amount, pool.currency)}</span>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center justify-between text-sm pt-4 border-t border-cloud">
                                <div className="flex items-center gap-2 text-ink-muted font-inter">
                                  <HeartIcon className="h-4 w-4 text-magenta" />
                                  <span>
                                    {pool.current_participants_count} {locale === 'fr' ? 'contributeurs' : 'contributors'}
                                  </span>
                                </div>
                                <span className="text-gray-400 font-semibold flex items-center gap-1 font-inter">
                                  {pool.status?.toLowerCase() === 'closed' 
                                    ? (locale === 'fr' ? 'Clôturée' : 'Closed')
                                    : (locale === 'fr' ? 'Archivée' : 'Archived')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pagination */}
            {!searchQuery && totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-3 mt-12"
              >
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 bg-white border-2 border-cloud rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-magenta hover:bg-magenta/5 transition-all flex items-center gap-2 font-semibold font-inter text-night"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  {locale === 'fr' ? 'Précédent' : 'Previous'}
                </button>
                
                <span className="px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold font-inter">
                  {locale === 'fr' ? 'Page' : 'Page'} {page} {locale === 'fr' ? 'sur' : 'of'} {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages || moneyPools.length < limit}
                  className="px-6 py-3 bg-gradient-to-r from-magenta to-sunset text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all flex items-center gap-2 font-semibold font-inter"
                >
                  {locale === 'fr' ? 'Suivant' : 'Next'}
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

