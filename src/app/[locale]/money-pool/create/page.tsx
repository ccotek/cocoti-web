'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  PhotoIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { getAuthToken, isAuthenticated } from '@/utils/tokenStorage';

type Step = 'info' | 'verification' | 'activation' | 'success';

interface MoneyPoolFormData {
  name: string;
  description: string;
  target_amount: string;
  min_contribution?: string;
  max_contribution?: string;
  currency: string;
  country: string;
  visibility: 'public' | 'community' | 'private';
  max_participants?: string;
  start_date?: string;
  end_date?: string;
  images: string[];
  videos: string[];
}

export default function CreateMoneyPoolPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as 'fr' | 'en';

  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [charterAccepted, setCharterAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [createdMoneyPoolId, setCreatedMoneyPoolId] = useState<string | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [activateImmediately, setActivateImmediately] = useState(false);

  const [formData, setFormData] = useState<MoneyPoolFormData>({
    name: '',
    description: '',
    target_amount: '',
    min_contribution: '',
    max_contribution: '',
    currency: 'XOF', // Will be auto-detected
    country: 'SN', // Will be auto-detected
    visibility: 'public',
    max_participants: '', // Unlimited by default
    start_date: new Date().toISOString().split('T')[0], // Today as default
    end_date: '',
    images: [],
    videos: []
  });

  // Auto-detect country and currency
  useEffect(() => {
    const detectCountryAndCurrency = async () => {
      try {
        // Try to get from user if authenticated
        // Use centralized token utility
        const token = getAuthToken();
        if (token) {
          // Try to get user info from token or API
          // For now, we'll detect from phone or IP
        }
        
        // Detect from phone number if provided (for OTP flow)
        if (phone) {
          const detectedCountry = detectCountryFromPhone(phone);
          if (detectedCountry) {
            const detectedCurrency = getCurrencyFromCountry(detectedCountry);
            setFormData(prev => ({
              ...prev,
              country: detectedCountry,
              currency: detectedCurrency
            }));
            return;
          }
        }
        
        // Fallback: Try to detect from IP (geolocation)
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country_code;
            if (countryCode) {
              const currency = getCurrencyFromCountry(countryCode);
              setFormData(prev => ({
                ...prev,
                country: countryCode,
                currency: currency
              }));
            }
          }
        } catch (ipError) {
          console.log('IP detection failed, using default');
        }
      } catch (error) {
        console.error('Error detecting country:', error);
      }
    };

    detectCountryAndCurrency();
  }, [phone]);

  // Helper function to detect country from phone number
  const detectCountryFromPhone = (phoneNumber: string): string | null => {
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    // Phone prefix mapping
    const phonePrefixes: Record<string, string> = {
      '+221': 'SN', // Senegal
      '+223': 'ML', // Mali
      '+225': 'CI', // Côte d'Ivoire
      '+226': 'BF', // Burkina Faso
      '+224': 'GN', // Guinea
      '+227': 'NE', // Niger
      '+228': 'TG', // Togo
      '+229': 'BJ', // Benin
      '+230': 'MU', // Mauritius
      '+231': 'LR', // Liberia
      '+232': 'SL', // Sierra Leone
      '+233': 'GH', // Ghana
      '+234': 'NG', // Nigeria
      '+235': 'TD', // Chad
      '+236': 'CF', // Central African Republic
      '+237': 'CM', // Cameroon
      '+238': 'CV', // Cape Verde
      '+239': 'ST', // Sao Tome and Principe
      '+240': 'GQ', // Equatorial Guinea
      '+241': 'GA', // Gabon
      '+242': 'CG', // Congo
      '+243': 'CD', // DR Congo
      '+244': 'AO', // Angola
      '+245': 'GW', // Guinea-Bissau
      '+246': 'IO', // British Indian Ocean Territory
      '+247': 'AC', // Ascension Island
      '+248': 'SC', // Seychelles
      '+249': 'SD', // Sudan
      '+250': 'RW', // Rwanda
      '+251': 'ET', // Ethiopia
      '+252': 'SO', // Somalia
      '+253': 'DJ', // Djibouti
      '+254': 'KE', // Kenya
      '+255': 'TZ', // Tanzania
      '+256': 'UG', // Uganda
      '+257': 'BI', // Burundi
      '+258': 'MZ', // Mozambique
      '+260': 'ZM', // Zambia
      '+261': 'MG', // Madagascar
      '+262': 'RE', // Réunion
      '+263': 'ZW', // Zimbabwe
      '+264': 'NA', // Namibia
      '+265': 'MW', // Malawi
      '+266': 'LS', // Lesotho
      '+267': 'BW', // Botswana
      '+268': 'SZ', // Swaziland
      '+269': 'KM', // Comoros
      '+290': 'SH', // Saint Helena
      '+291': 'ER', // Eritrea
      '+297': 'AW', // Aruba
      '+298': 'FO', // Faroe Islands
      '+299': 'GL', // Greenland
      '+33': 'FR', // France
      '+1': 'US', // USA/Canada (default)
    };
    
    for (const [prefix, country] of Object.entries(phonePrefixes)) {
      if (cleanPhone.startsWith(prefix)) {
        return country;
      }
    }
    
    return null;
  };

  // Helper function to get currency from country
  const getCurrencyFromCountry = (countryCode: string): string => {
    const countryCurrencyMap: Record<string, string> = {
      'SN': 'XOF', // Senegal
      'ML': 'XOF', // Mali
      'CI': 'XOF', // Côte d'Ivoire
      'BF': 'XOF', // Burkina Faso
      'NE': 'XOF', // Niger
      'TG': 'XOF', // Togo
      'BJ': 'XOF', // Benin
      'GN': 'GNF', // Guinea
      'MR': 'MRU', // Mauritania
      'FR': 'EUR', // France
      'BE': 'EUR', // Belgium
      'IT': 'EUR', // Italy
      'ES': 'EUR', // Spain
      'DE': 'EUR', // Germany
      'NL': 'EUR', // Netherlands
      'PT': 'EUR', // Portugal
      'AT': 'EUR', // Austria
      'GR': 'EUR', // Greece
      'IE': 'EUR', // Ireland
      'FI': 'EUR', // Finland
      'LU': 'EUR', // Luxembourg
      'US': 'USD', // United States
      'CA': 'CAD', // Canada
      'GB': 'GBP', // United Kingdom
      'NG': 'NGN', // Nigeria
      'GH': 'GHS', // Ghana
      'KE': 'KES', // Kenya
      'ZA': 'ZAR', // South Africa
      'EG': 'EGP', // Egypt
      'MA': 'MAD', // Morocco
      'TN': 'TND', // Tunisia
      'DZ': 'DZD', // Algeria
    };
    
    return countryCurrencyMap[countryCode] || 'XOF'; // Default to XOF
  };

  const API_URL = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return baseUrl.endsWith('/api/v1') ? baseUrl.replace('/api/v1', '') : baseUrl;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleIllustrationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate all files first
    const imageFiles: File[] = [];
    const videoFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Determine file type
      if (file.type.startsWith('image/')) {
        // Validate image
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
          setError(locale === 'fr' 
            ? `Format d'image non supporté: ${file.name}. Formats acceptés: JPG, PNG, WEBP` 
            : `Unsupported image format: ${file.name}. Accepted: JPG, PNG, WEBP`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError(locale === 'fr' 
            ? `L'image ${file.name} est trop grande (max 5MB)` 
            : `Image ${file.name} is too large (max 5MB)`);
          return;
        }
        imageFiles.push(file);
      } else if (file.type.startsWith('video/')) {
        // Validate video
        if (!['video/mp4', 'video/webm'].includes(file.type)) {
          setError(locale === 'fr' 
            ? `Format de vidéo non supporté: ${file.name}. Formats acceptés: MP4, WEBM` 
            : `Unsupported video format: ${file.name}. Accepted: MP4, WEBM`);
          return;
        }
        if (file.size > 50 * 1024 * 1024) {
          setError(locale === 'fr' 
            ? `La vidéo ${file.name} est trop grande (max 50MB)` 
            : `Video ${file.name} is too large (max 50MB)`);
          return;
        }
        videoFiles.push(file);
      } else {
        setError(locale === 'fr' 
          ? `Type de fichier non supporté: ${file.name}. Utilisez des images ou des vidéos` 
          : `Unsupported file type: ${file.name}. Use images or videos`);
        return;
      }
    }

    // Check limits
    const currentImageCount = formData.images.filter(img => img).length;
    const currentVideoCount = formData.videos.filter(vid => vid).length;
    
    if (currentImageCount + imageFiles.length > 3) {
      setError(locale === 'fr' 
        ? `Trop d'images. Maximum 3 images autorisées (actuellement: ${currentImageCount}, tentatives: ${imageFiles.length})` 
        : `Too many images. Maximum 3 images allowed (current: ${currentImageCount}, attempting: ${imageFiles.length})`);
      return;
    }
    
    if (currentVideoCount + videoFiles.length > 2) {
      setError(locale === 'fr' 
        ? `Trop de vidéos. Maximum 2 vidéos autorisées (actuellement: ${currentVideoCount}, tentatives: ${videoFiles.length})` 
        : `Too many videos. Maximum 2 videos allowed (current: ${currentVideoCount}, attempting: ${videoFiles.length})`);
      return;
    }

    // Upload files
    setIsLoading(true);
    setError('');

    try {
        // Use centralized token utility
        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

      // Upload images
      for (const file of imageFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const response = await fetch(`${API_URL}/api/v1/money-pools/upload-illustration?file_type=image`, {
          method: 'POST',
          headers,
          body: uploadFormData
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.detail || data.message || `Failed to upload ${file.name}`);
        }
        
        // Add to images array
        const newImages = [...formData.images];
        const emptyIndex = newImages.findIndex(img => !img);
        if (emptyIndex !== -1) {
          newImages[emptyIndex] = data.url;
        } else {
          newImages.push(data.url);
        }
        setFormData(prev => ({ ...prev, images: newImages.filter(img => img || newImages.indexOf(img) < 3) }));
      }

      // Upload videos
      for (const file of videoFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const response = await fetch(`${API_URL}/api/v1/money-pools/upload-illustration?file_type=video`, {
          method: 'POST',
          headers,
          body: uploadFormData
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.detail || data.message || `Failed to upload ${file.name}`);
        }
        
        // Add to videos array
        const newVideos = [...formData.videos];
        const emptyIndex = newVideos.findIndex(vid => !vid);
        if (emptyIndex !== -1) {
          newVideos[emptyIndex] = data.url;
        } else {
          newVideos.push(data.url);
        }
        setFormData(prev => ({ ...prev, videos: newVideos.filter(vid => vid || newVideos.indexOf(vid) < 2) }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setIsLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleIllustrationRemove = (type: 'image' | 'video', index: number) => {
    if (type === 'image') {
      const newImages = [...formData.images];
      newImages[index] = '';
      setFormData(prev => ({ ...prev, images: newImages.filter(img => img || newImages.indexOf(img) < 3) }));
    } else {
      const newVideos = [...formData.videos];
      newVideos[index] = '';
      setFormData(prev => ({ ...prev, videos: newVideos.filter(vid => vid || newVideos.indexOf(vid) < 2) }));
    }
  };

  const sendOTP = async (): Promise<boolean> => {
    if (!phone.trim()) {
      setError(locale === 'fr' ? 'Veuillez saisir votre numéro de téléphone' : 'Please enter your phone number');
      return false;
    }

    setIsSendingOtp(true);
    setError('');

    try {
      // Send OTP request
      const otpEndpoint = `${API_URL}/api/v1/auth/otp/send`;
      const response = await fetch(otpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          purpose: 'registration'
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.detail || 'Failed to send OTP');
      }

      // OTP endpoint returns otp_id, we'll use it as session_id
      setOtpSessionId(data.otp_id || data.session_id || data.sessionId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };


  const validateForm = (): boolean => {
    // Validation
    if (!formData.name.trim()) {
      setError(locale === 'fr' ? 'Le nom de la cagnotte est requis' : 'Money pool name is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError(locale === 'fr' ? 'La description est requise' : 'Description is required');
      return false;
    }
    if (formData.description.trim().length < 500) {
      setError(locale === 'fr' ? 'La description doit contenir au moins 500 caractères' : 'Description must contain at least 500 characters');
      return false;
    }
    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      setError(locale === 'fr' ? 'Le montant cible doit être supérieur à 0' : 'Target amount must be greater than 0');
      return false;
    }
    return true;
  };

  const handleInfoStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Check charter acceptance
    if (!charterAccepted) {
      setError(locale === 'fr' ? 'Vous devez accepter la charte pour continuer' : 'You must accept the charter to continue');
      return;
    }

    // Check if user is already authenticated
    // Use centralized token utility
    const token = getAuthToken();
    
    console.log('[CREATE MONEY POOL] Token check:', {
      hasToken: !!token,
    });
    
    if (token) {
      // User is already authenticated, create money pool directly
      console.log('[CREATE MONEY POOL] User authenticated, creating directly...');
      await submitForm(token);
    } else {
      // User not authenticated, move to verification step
      console.log('[CREATE MONEY POOL] User not authenticated, moving to verification step...');
      setCurrentStep('verification');
    }
  };

  const handleOTPVerification = async () => {
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError(locale === 'fr' ? 'Veuillez saisir un code OTP valide (6 chiffres)' : 'Please enter a valid OTP code (6 digits)');
      return;
    }

    // Verify OTP with backend
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          otp_session_id: otpSessionId,
          otp_code: otpCode
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.detail || 'Invalid OTP code');
      }

      // OTP verified - check if user exists
      if (data.user_exists) {
        // User exists, proceed with creation
        setOtpVerified(true);
        setNeedsRegistration(false);
        // Create money pool with OTP credentials
        await submitForm(undefined);
      } else {
        // User doesn't exist, need registration info
        setOtpVerified(true);
        setNeedsRegistration(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify OTP');
    }
  };

  const handleVerificationStep = async () => {
    setError('');

    // Check if user needs OTP authentication
    // Use centralized token utility
    const token = getAuthToken();
    
    if (token) {
      // User is already authenticated, proceed directly with creation (no phone/OTP needed)
      console.log('[CREATE MONEY POOL] User authenticated in verification step, creating directly...');
      await submitForm(token);
      return;
    }
    
    // User not authenticated - need OTP flow
    if (!phone.trim()) {
      setError(locale === 'fr' ? 'Veuillez saisir votre numéro de téléphone' : 'Please enter your phone number');
      return;
    }
    
    // If no OTP session yet, send OTP
    if (!otpSessionId) {
      const success = await sendOTP();
      if (!success) {
        return;
      }
      // OTP sent, wait for user to enter code
      return;
    }
    
    // OTP session exists - check if verified
    if (!otpVerified) {
      // Need to verify OTP first
      await handleOTPVerification();
      return;
    }
    
    // OTP verified - check if needs registration
    if (needsRegistration) {
      // Need full name for registration
      if (!fullName.trim()) {
        setError(locale === 'fr' ? 'Veuillez saisir votre nom complet pour créer votre compte' : 'Please enter your full name to create your account');
        return;
      }
    }
    
    // Ready to create money pool
    await submitForm(undefined);
  };

  const handleActivation = async () => {
    if (!createdMoneyPoolId) return;
    
    setIsLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Si on veut activer, publier la cagnotte
      if (activateImmediately) {
        const response = await fetch(`${API_URL}/api/v1/money-pools/${createdMoneyPoolId}/publish`, {
          method: 'PATCH',
          headers
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || data.message || 'Failed to activate money pool');
        }
      }

      // Passer à l'étape success
      setCurrentStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = async (token?: string) => {
    setIsLoading(true);
    setError('');

    try {
      let requestBody: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
        settings: {
          target_amount: parseFloat(formData.target_amount),
          min_contribution: formData.min_contribution && parseFloat(formData.min_contribution) > 0 
            ? parseFloat(formData.min_contribution) 
            : undefined,
          max_contribution: formData.max_contribution && parseFloat(formData.max_contribution) > 0 
            ? parseFloat(formData.max_contribution) 
            : undefined,
          allow_recurring_contributions: true,
          auto_approve_contributors: true,
          cross_country: false,
          require_kyc_for_contributors: false
        },
        currency: formData.currency,
        country: formData.country,
        max_participants: formData.max_participants && parseInt(formData.max_participants) > 0 
          ? parseInt(formData.max_participants) 
          : undefined, // Unlimited by default
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        images: formData.images.filter(img => img.trim()),
        videos: formData.videos.filter(vid => vid.trim())
      };

      // If no token, add OTP fields (should have been validated before)
      if (!token) {
        if (!otpSessionId || !otpCode || otpCode.length !== 6) {
          throw new Error(locale === 'fr' ? 'Code OTP requis' : 'OTP code required');
        }
        requestBody.phone = phone.trim();
        requestBody.otp_session_id = otpSessionId;
        requestBody.otp_code = otpCode;
        requestBody.full_name = fullName.trim();
      }

      // Set start_date to today (publication date) if not set
      if (!requestBody.start_date) {
        requestBody.start_date = new Date().toISOString().split('T')[0];
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/api/v1/money-pools/public/create`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to create money pool');
      }

      setCreatedMoneyPoolId(data.id);
      // Toujours passer à l'étape d'activation pour demander si on veut activer
      setCurrentStep('activation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };



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
              <span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
            </Link>
            <span className="text-cloud">/</span>
            <Link 
              href={`/${locale}/money-pools`}
              className="text-ink-muted hover:text-magenta transition-colors font-inter"
            >
              {locale === 'fr' ? 'Cagnottes' : 'Money Pools'}
            </Link>
            <span className="text-cloud">/</span>
            <span className="text-night font-semibold font-inter">
              {locale === 'fr' ? 'Créer' : 'Create'}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-magenta/5 via-sunset/5 to-coral/5 border-b border-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-night font-inter mb-4">
              {locale === 'fr' ? 'Créer une cagnotte' : 'Create a Money Pool'}
            </h1>
            <p className="text-lg text-ink-muted font-inter">
              {locale === 'fr' 
                ? 'Lancez votre projet solidaire en quelques minutes' 
                : 'Launch your solidarity project in minutes'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Information & Charter */}
        {currentStep === 'info' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sm:p-8"
          >
            <form onSubmit={handleInfoStep} className="space-y-6">
              {/* Row 1: Nom - Montant Cible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Nom de la cagnotte *' : 'Money Pool Name *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                    placeholder={locale === 'fr' ? 'Ex: Aide pour mariage de Marie' : 'Ex: Help for Marie\'s wedding'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Montant cible *' : 'Target Amount *'}
                  </label>
                  <input
                    type="number"
                    name="target_amount"
                    value={formData.target_amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                    placeholder={locale === 'fr' ? '100000' : '100000'}
                  />
                </div>
              </div>

              {/* Row 2: Description (full width) */}
              <div>
                <label className="block text-sm font-semibold text-night mb-2 font-inter">
                  {locale === 'fr' ? 'Description *' : 'Description *'}
                  <span className={`text-xs ml-2 font-normal ${formData.description.length < 500 ? 'text-red-500' : 'text-ink-muted'}`}>
                    ({formData.description.length}/500 minimum)
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  minLength={500}
                  className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                  placeholder={locale === 'fr' ? 'Décrivez votre projet en détail (minimum 500 caractères)...' : 'Describe your project in detail (minimum 500 characters)...'}
                />
                {formData.description.length > 0 && formData.description.length < 500 && (
                  <p className="mt-1 text-xs text-red-500 font-inter">
                    {locale === 'fr' 
                      ? `${500 - formData.description.length} caractères manquants (minimum 500 requis)` 
                      : `${500 - formData.description.length} characters missing (minimum 500 required)`}
                  </p>
                )}
              </div>

              {/* Row 3: Visibilité - Date de fin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Visibilité *' : 'Visibility *'}
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                  >
                    <option value="public">{locale === 'fr' ? 'Publique' : 'Public'}</option>
                    <option value="community">{locale === 'fr' ? 'Communauté' : 'Community'}</option>
                    <option value="private">{locale === 'fr' ? 'Privée' : 'Private'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Date de fin (optionnel)' : 'End Date (optional)'}
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                  />
                </div>
              </div>

              {/* Country and Currency are auto-detected - hidden fields */}
              <input type="hidden" name="country" value={formData.country} />
              <input type="hidden" name="currency" value={formData.currency} />

              {/* Advanced Settings - Collapsible */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-magenta hover:text-sunset transition-colors font-inter flex items-center gap-2 py-3">
                  <svg className="h-5 w-5 transform transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {locale === 'fr' ? 'Paramètres supplémentaires' : 'Additional Settings'}
                </summary>
                <div className="mt-4 space-y-4 pl-7 border-l-2 border-cloud">
                  {/* Start Date and Max Participants - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Date de début' : 'Start Date'}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({locale === 'fr' ? 'Par défaut: date de publication' : 'Default: publication date'})
                        </span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                      />
                    </div>

                    {/* Max Participants */}
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Nombre maximum de participants' : 'Max Participants'}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({locale === 'fr' ? 'Par défaut: illimité' : 'Default: unlimited'})
                        </span>
                      </label>
                      <input
                        type="number"
                        name="max_participants"
                        value={formData.max_participants}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                        placeholder={locale === 'fr' ? 'Illimité si vide' : 'Unlimited if empty'}
                      />
                    </div>
                  </div>

                  {/* Min/Max Contributions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Contribution minimale' : 'Min Contribution'}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({locale === 'fr' ? 'Par défaut: aucune' : 'Default: none'})
                        </span>
                      </label>
                      <input
                        type="number"
                        name="min_contribution"
                        value={formData.min_contribution}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                        placeholder={locale === 'fr' ? 'Aucune limite si vide' : 'No limit if empty'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Contribution maximale' : 'Max Contribution'}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({locale === 'fr' ? 'Par défaut: aucune' : 'Default: none'})
                        </span>
                      </label>
                      <input
                        type="number"
                        name="max_contribution"
                        value={formData.max_contribution}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                        placeholder={locale === 'fr' ? 'Aucune limite si vide' : 'No limit if empty'}
                      />
                    </div>
                  </div>
                </div>
              </details>

              {/* Illustrations */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {locale === 'fr' ? 'Illustrations (max 5 au total : 3 images et 2 vidéos)' : 'Illustrations (max 5 total: 3 images and 2 videos)'}
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/webm"
                    multiple
                    onChange={handleIllustrationUpload}
                    className="hidden"
                    id="illustration-upload"
                  />
                  <label
                    htmlFor="illustration-upload"
                    className="block w-full px-4 py-6 border-2 border-dashed border-cloud rounded-2xl hover:border-magenta transition-all cursor-pointer font-inter flex flex-col items-center justify-center gap-3 text-ink-muted hover:text-magenta"
                  >
                    <PhotoIcon className="h-8 w-8" />
                    <span className="font-semibold">
                      {locale === 'fr' ? 'Cliquez pour ajouter des illustrations' : 'Click to add illustrations'}
                    </span>
                    <span className="text-xs text-center">
                      {locale === 'fr' 
                        ? 'Images (JPG, PNG, WEBP - max 5MB) ou Vidéos (MP4, WEBM - max 50MB)' 
                        : 'Images (JPG, PNG, WEBP - max 5MB) or Videos (MP4, WEBM - max 50MB)'}
                    </span>
                  </label>

                  {/* Display uploaded files */}
                  {(formData.images.filter(img => img).length > 0 || formData.videos.filter(vid => vid).length > 0) && (
                    <div className="mt-4 space-y-2">
                      {/* Images */}
                      {formData.images.map((url, index) => {
                        if (!url) return null;
                        return (
                          <div key={`img-${index}`} className="flex items-center gap-3 p-3 bg-white border-2 border-cloud rounded-xl">
                            <PhotoIcon className="h-5 w-5 text-magenta flex-shrink-0" />
                            <span className="flex-1 text-sm text-night font-inter truncate">{url}</span>
                            <button
                              type="button"
                              onClick={() => handleIllustrationRemove('image', index)}
                              className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-inter text-sm"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                      
                      {/* Videos */}
                      {formData.videos.map((url, index) => {
                        if (!url) return null;
                        return (
                          <div key={`vid-${index}`} className="flex items-center gap-3 p-3 bg-white border-2 border-cloud rounded-xl">
                            <svg className="h-5 w-5 text-sunset flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="flex-1 text-sm text-night font-inter truncate">{url}</span>
                            <button
                              type="button"
                              onClick={() => handleIllustrationRemove('video', index)}
                              className="px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-inter text-sm"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Charter Acceptance */}
              <div className="bg-gradient-to-br from-magenta/5 to-sunset/5 rounded-2xl p-6 border-2 border-cloud">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="charter-accept"
                    checked={charterAccepted}
                    onChange={(e) => setCharterAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 text-magenta border-cloud rounded focus:ring-magenta"
                    required
                  />
                  <label htmlFor="charter-accept" className="text-sm text-night font-inter cursor-pointer">
                    {locale === 'fr' 
                      ? 'J\'accepte la charte de bonne conduite et les conditions d\'utilisation de Cocoti. Je m\'engage à utiliser la plateforme de manière responsable et respectueuse.'
                      : 'I accept Cocoti\'s code of conduct and terms of use. I commit to using the platform responsibly and respectfully.'}
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-600 font-inter">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Link
                  href={`/${locale}/money-pools`}
                  className="flex-1 px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold hover:border-magenta hover:bg-magenta/5 transition-all text-center font-inter"
                >
                  {locale === 'fr' ? 'Annuler' : 'Cancel'}
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !charterAccepted}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  {locale === 'fr' ? 'Continuer' : 'Continue'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Step 2: Verification */}
        {currentStep === 'verification' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sm:p-8"
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-night mb-2 font-inter">
                  {locale === 'fr' ? 'Vérification de l\'identité' : 'Identity Verification'}
                </h2>
                <p className="text-ink-muted font-inter">
                  {locale === 'fr' 
                    ? 'Pour créer votre cagnotte, nous devons vérifier votre identité.' 
                    : 'To create your money pool, we need to verify your identity.'}
                </p>
              </div>

              {/* Authentication fields (if not logged in) */}
              {!isAuthenticated() && (
                <div className="space-y-4">
                  {/* Step 1: Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-night mb-2 font-inter">
                      {locale === 'fr' ? 'Numéro de téléphone *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={!!otpSessionId}
                      className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="+221771234567"
                    />
                    {!otpSessionId && (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={isSendingOtp || !phone.trim()}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-magenta to-sunset text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                      >
                        {isSendingOtp 
                          ? (locale === 'fr' ? 'Envoi...' : 'Sending...')
                          : (locale === 'fr' ? 'Envoyer le code OTP' : 'Send OTP Code')
                        }
                      </button>
                    )}
                  </div>

                  {/* Step 2: OTP Code */}
                  {otpSessionId && !otpVerified && (
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Code OTP *' : 'OTP Code *'}
                      </label>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        maxLength={6}
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter text-center text-2xl tracking-widest"
                        placeholder="000000"
                        autoFocus
                      />
                      <p className="mt-2 text-sm text-ink-muted font-inter">
                        {locale === 'fr' ? 'Entrez le code à 6 chiffres reçu par SMS' : 'Enter the 6-digit code received by SMS'}
                      </p>
                      <button
                        type="button"
                        onClick={handleOTPVerification}
                        disabled={otpCode.length !== 6 || isLoading}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-magenta to-sunset text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                      >
                        {isLoading 
                          ? (locale === 'fr' ? 'Vérification...' : 'Verifying...')
                          : (locale === 'fr' ? 'Vérifier le code' : 'Verify Code')
                        }
                      </button>
                    </div>
                  )}

                  {/* Step 3: Full Name (only if user needs registration) */}
                  {otpVerified && needsRegistration && (
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {locale === 'fr' ? 'Nom complet *' : 'Full Name *'}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({locale === 'fr' ? 'Pour créer votre compte' : 'To create your account'})
                        </span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                        placeholder={locale === 'fr' ? 'Jean Dupont' : 'John Doe'}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Already authenticated */}
              {isAuthenticated() && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <p className="text-green-800 font-inter">
                      {locale === 'fr' 
                        ? 'Vous êtes déjà connecté. Votre identité est vérifiée.' 
                        : 'You are already logged in. Your identity is verified.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-600 font-inter">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('info');
                    setError('');
                    setOtpCode('');
                    setOtpSessionId(null);
                    setOtpVerified(false);
                    setNeedsRegistration(false);
                    setFullName('');
                    setPhone('');
                  }}
                  className="flex-1 px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold hover:border-magenta hover:bg-magenta/5 transition-all font-inter"
                >
                  {locale === 'fr' ? 'Retour' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleVerificationStep}
                      disabled={
                        isLoading || 
                        isSendingOtp || 
                        (!isAuthenticated() && (!otpVerified || (needsRegistration && !fullName.trim())))
                      }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  {isLoading || isSendingOtp
                    ? (locale === 'fr' ? 'Création...' : 'Creating...')
                    : (locale === 'fr' ? 'Créer la cagnotte' : 'Create Money Pool')
                  }
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Activation Step */}
        {currentStep === 'activation' && createdMoneyPoolId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sm:p-8"
          >
            <div className="mb-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-magenta to-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-night mb-2 font-inter">
                {locale === 'fr' ? 'Cagnotte créée !' : 'Money Pool Created!'}
              </h2>
              <p className="text-ink-muted font-inter">
                {locale === 'fr' 
                  ? 'Votre cagnotte a été créée en mode brouillon. Souhaitez-vous l\'activer maintenant ?' 
                  : 'Your money pool has been created as a draft. Would you like to activate it now?'}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 p-4 border-2 border-cloud rounded-2xl cursor-pointer hover:border-magenta transition-colors">
                <input
                  type="radio"
                  name="activation"
                  checked={activateImmediately}
                  onChange={() => setActivateImmediately(true)}
                  className="mt-1 w-5 h-5 text-magenta focus:ring-magenta"
                />
                <div className="flex-1">
                  <div className="font-semibold text-night font-inter">
                    {locale === 'fr' ? 'Activer maintenant' : 'Activate Now'}
                  </div>
                  <div className="text-sm text-ink-muted font-inter">
                    {locale === 'fr' 
                      ? 'Votre cagnotte sera visible et pourra recevoir des contributions immédiatement.' 
                      : 'Your money pool will be visible and can receive contributions immediately.'}
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-cloud rounded-2xl cursor-pointer hover:border-magenta transition-colors">
                <input
                  type="radio"
                  name="activation"
                  checked={!activateImmediately}
                  onChange={() => setActivateImmediately(false)}
                  className="mt-1 w-5 h-5 text-magenta focus:ring-magenta"
                />
                <div className="flex-1">
                  <div className="font-semibold text-night font-inter">
                    {locale === 'fr' ? 'Garder en brouillon' : 'Keep as Draft'}
                  </div>
                  <div className="text-sm text-ink-muted font-inter">
                    {locale === 'fr' 
                      ? 'Vous pourrez activer votre cagnotte plus tard depuis votre tableau de bord.' 
                      : 'You can activate your money pool later from your dashboard.'}
                  </div>
                </div>
              </label>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-inter">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleActivation}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
              >
                {isLoading
                  ? (locale === 'fr' ? 'Traitement...' : 'Processing...')
                  : (locale === 'fr' ? 'Continuer' : 'Continue')
                }
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'success' && createdMoneyPoolId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-cloud p-6 sm:p-8 text-center"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-night mb-2 font-inter">
                {locale === 'fr' ? 'Cagnotte créée avec succès !' : 'Money Pool Created Successfully!'}
              </h2>
              <p className="text-lg text-ink-muted font-inter">
                {locale === 'fr' 
                  ? 'Votre cagnotte a été créée et est maintenant en ligne.' 
                  : 'Your money pool has been created and is now live.'}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href={`/${locale}/money-pools`}
                className="px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold hover:border-magenta hover:bg-magenta/5 transition-all font-inter"
              >
                {locale === 'fr' ? 'Voir toutes les cagnottes' : 'View All Money Pools'}
              </Link>
              <Link
                href={`/${locale}/money-pool/${createdMoneyPoolId}`}
                className="px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all font-inter"
              >
                {locale === 'fr' ? 'Voir ma cagnotte' : 'View My Money Pool'}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

