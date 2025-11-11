'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
import { getAuthToken, isAuthenticated, clearAuthToken, setAuthToken } from '@/utils/tokenStorage';
import { APP_CONFIG } from '@/config/app';
import CustomConfirmationModal from '@/components/CustomConfirmationModal';

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

  // Helper function for translations
  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      fr: require('@/i18n/messages/fr.json').moneyPool.create || {},
      en: require('@/i18n/messages/en.json').moneyPool.create || {}
    };
    const keys = key.split('.');
    let value: any = translations[locale];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [charterAccepted, setCharterAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Phone number without country code
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(''); // Selected country code (e.g., 'SN')
  const [selectedCallingCode, setSelectedCallingCode] = useState<string>(''); // Selected calling code (e.g., '+221')
  const [countries, setCountries] = useState<Array<{
    code: string;
    name: string;
    name_fr: string;
    name_en: string;
    calling_code: string;
    calling_codes: string[];
    flag_emoji: string; 
    currency_codes: string[];
  }>>([]);
  const [fullName, setFullName] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [createdMoneyPoolId, setCreatedMoneyPoolId] = useState<string | null>(null);
  const [createdMoneyPoolVisibility, setCreatedMoneyPoolVisibility] = useState<'public' | 'community' | 'private'>('public');
  const [createdMoneyPoolStatus, setCreatedMoneyPoolStatus] = useState<'draft' | 'active'>('draft');
  const [otpVerified, setOtpVerified] = useState(false);
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [activateImmediately, setActivateImmediately] = useState(false);
  const [receivedToken, setReceivedToken] = useState<string | null>(null); // Token received from OTP authentication
  const [allowAnonymous, setAllowAnonymous] = useState(true); // Allow anonymous contributions by default
  const [showPublishWarning, setShowPublishWarning] = useState(false);

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
        
        // Fallback: Use default country (Senegal) if no phone number
        if (!formData.country) {
          setFormData(prev => ({
            ...prev,
            country: 'SN',
            currency: 'XOF'
          }));
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

  // Fetch active countries with calling codes
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/geography/countries/public?language=${locale}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.countries) {
            setCountries(data.countries);
            // Set default country (Senegal) if available
            const defaultCountry = data.countries.find((c: any) => c.code === 'SN');
            if (defaultCountry) {
              setSelectedCountryCode(defaultCountry.code);
              setSelectedCallingCode(defaultCountry.calling_code);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, [API_URL, locale]);

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

  // Update phone when country code or phone number changes
  useEffect(() => {
    if (selectedCallingCode && phoneNumber) {
      setPhone(`${selectedCallingCode}${phoneNumber}`);
    } else if (phoneNumber) {
      setPhone(phoneNumber);
    }
  }, [selectedCallingCode, phoneNumber]);

  const sendOTP = async (): Promise<boolean> => {
    if (!selectedCallingCode || !phoneNumber.trim()) {
      setError(t('errors.selectCountryPhone'));
      return false;
    }
    
    const fullPhone = `${selectedCallingCode}${phoneNumber.trim()}`;

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
          phone: fullPhone,
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
      setError(t('errors.nameRequired'));
      return false;
    }
    if (!formData.description.trim()) {
      setError(t('errors.descriptionRequired'));
      return false;
    }
    if (formData.description.trim().length < 300) {
      setError(t('errors.descriptionMinLength'));
      return false;
    }
    if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
      setError(t('errors.targetAmountRequired'));
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
      setError(t('errors.charterRequired'));
      return;
    }

    // Check if user is already authenticated
    // Use centralized token utility
    const token = getAuthToken();
    
    if (token) {
      // User is already authenticated, create money pool directly
      await submitForm(token);
    } else {
      // User not authenticated, move to verification step
      setCurrentStep('verification');
    }
  };

  const handleOTPVerification = async () => {
    setError('');

    if (!otpCode || otpCode.length !== 6) {
      setError(t('errors.otpInvalid'));
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
      await submitForm(token);
      return;
    }
    
    // User not authenticated - need OTP flow
    if (!phone.trim()) {
      setError(t('errors.phoneRequired'));
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
        setError(t('errors.fullNameRequired'));
        return;
      }
    }
    
    // Ready to create money pool
    await submitForm(undefined);
  };

  const handleActivation = async () => {
    if (!createdMoneyPoolId) return;
    
    // Si on veut publier, afficher l'avertissement
    if (activateImmediately) {
      setShowPublishWarning(true);
      return;
    }
    
    // Si on garde en brouillon, passer directement à l'étape success
    setCurrentStep('success');
  };

  const handleConfirmPublish = async () => {
    if (!createdMoneyPoolId) return;
    
    setShowPublishWarning(false);
    setIsLoading(true);
    setError('');

    try {
      // Get token (should be available after OTP authentication or from existing session)
      // First try the token received from OTP (stored in local state)
      let token = receivedToken || getAuthToken();
      
      console.log('[ACTIVATION] Token check:', {
        hasReceivedToken: !!receivedToken,
        hasStoredToken: !!getAuthToken(),
        hasToken: !!token
      });
      
      // If still no token, wait a bit and try again (might have been saved just now)
      if (!token) {
        console.log('[ACTIVATION] No token found, waiting 200ms...');
        await new Promise(resolve => setTimeout(resolve, 200));
        token = getAuthToken();
        console.log('[ACTIVATION] Token after wait:', !!token);
      }
      
      if (!token) {
        console.error('[ACTIVATION] No token available for activation');
        throw new Error(locale === 'fr' 
          ? 'Session expirée. Veuillez vous reconnecter.' 
          : 'Session expired. Please log in again.');
      }
      
      console.log('[ACTIVATION] Using token for publish request');

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept-Language': locale || 'fr',
      };

      // Publier la cagnotte
      const response = await fetch(`${API_URL}/api/v1/money-pools/${createdMoneyPoolId}/publish`, {
        method: 'PATCH',
        headers
      });

      if (!response.ok) {
        // If 401 or 403, token might be invalid
        if (response.status === 401 || response.status === 403) {
          clearAuthToken();
          throw new Error(locale === 'fr' 
            ? 'Session expirée. Veuillez vous reconnecter.' 
            : 'Session expired. Please log in again.');
        }
        
        const data = await response.json();
        throw new Error(data.detail || data.message || 'Failed to publish money pool');
      }

      // Passer à l'étape success
      setCurrentStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.genericError'));
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
          // For public money pools, don't send min/max contribution or allow_anonymous
          min_contribution: formData.visibility === 'public' 
            ? undefined 
            : (formData.min_contribution && parseFloat(formData.min_contribution) > 0 
              ? parseFloat(formData.min_contribution) 
              : undefined),
          max_contribution: formData.visibility === 'public' 
            ? undefined 
            : (formData.max_contribution && parseFloat(formData.max_contribution) > 0 
              ? parseFloat(formData.max_contribution) 
              : undefined),
          allow_recurring_contributions: true,
          auto_approve_contributors: true,
          cross_country: false,
          require_kyc_for_contributors: false,
          allow_anonymous: formData.visibility === 'public' 
            ? true  // Default to true for public money pools
            : allowAnonymous
        },
        currency: formData.currency,
        country: formData.country,
        // For public money pools, don't send max_participants
        max_participants: formData.visibility === 'public' 
          ? undefined 
          : (formData.max_participants && parseInt(formData.max_participants) > 0 
            ? parseInt(formData.max_participants) 
            : undefined), // Unlimited by default
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        images: formData.images.filter(img => img.trim()),
        videos: formData.videos.filter(vid => vid.trim())
      };

      // If no token, add OTP fields (should have been validated before)
      if (!token) {
        if (!otpSessionId || !otpCode || otpCode.length !== 6) {
          throw new Error(t('errors.otpRequired'));
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
        'Accept-Language': locale || 'fr',
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
        // If token expired (401), clear it and ask for OTP
        if (response.status === 401 && token) {
          // Token expired or invalid, clear it and move to verification step
          clearAuthToken();
          setError(locale === 'fr' 
            ? 'Votre session a expiré. Veuillez vérifier votre identité.' 
            : 'Your session has expired. Please verify your identity.');
          setCurrentStep('verification');
          return;
        }
        throw new Error(data.detail || data.message || 'Failed to create money pool');
      }

      // If OTP authentication was used, save the token returned by the API
      if (data.access_token && !token) {
        console.log('[CREATE] Received access_token from API, saving...');
        setAuthToken(data.access_token);
        setReceivedToken(data.access_token); // Store in local state for immediate use
        console.log('[CREATE] Token saved to state and localStorage');
      } else if (!data.access_token && !token) {
        console.warn('[CREATE] No access_token in response and no token provided');
      }

      setCreatedMoneyPoolId(data.id);
      setCreatedMoneyPoolVisibility(data.visibility || formData.visibility);
      setCreatedMoneyPoolStatus(data.status === 'active' ? 'active' : 'draft');
      // Toujours passer à l'étape d'activation pour demander si on veut activer
      setCurrentStep('activation');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };



  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-sand">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 max-w-md ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            } px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="h-6 w-6" />
            ) : (
              <XMarkIcon className="h-6 w-6" />
            )}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-white hover:text-gray-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-cloud">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link 
              href={`/${locale}`}
              className="text-ink-muted hover:text-magenta transition-colors flex items-center gap-1 font-inter"
            >
              <span>{t('breadcrumbHome')}</span>
            </Link>
            <span className="text-cloud">/</span>
            <Link 
              href={`/${locale}/money-pools`}
              className="text-ink-muted hover:text-magenta transition-colors font-inter"
            >
              {t('breadcrumbMoneyPools')}
            </Link>
            <span className="text-cloud">/</span>
            <span className="text-night font-semibold font-inter">
              {t('breadcrumbCreate')}
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
              {t('formTitle')}
            </h1>
            <p className="text-lg text-ink-muted font-inter">
              {t('formSubtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Information & Charter - Always visible, modals overlay when needed */}
        {(currentStep === 'info' || currentStep === 'verification' || currentStep === 'activation') && (
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
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {t('targetAmount')}
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
                    placeholder={t('targetAmountPlaceholder')}
                  />
                </div>
              </div>

              {/* Row 2: Description (full width) */}
              <div>
                <label className="block text-sm font-semibold text-night mb-2 font-inter">
                  {t('description')}
                  <span className={`text-xs ml-2 font-normal ${formData.description.length < 300 ? 'text-red-500' : 'text-ink-muted'}`}>
                    ({formData.description.length}/300 {t('descriptionMinChars')})
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  minLength={300}
                  className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                  placeholder={t('descriptionPlaceholder')}
                />
                {formData.description.length > 0 && formData.description.length < 300 && (
                  <p className="mt-1 text-xs text-red-500 font-inter">
                    {`${300 - formData.description.length} ${t('descriptionMissing')}`}
                  </p>
                )}
              </div>

              {/* Row 3: Visibilité - Date de fin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {t('visibility')}
                  </label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                  >
                    <option value="public">{t('visibilityPublic')}</option>
                    {/* <option value="community">{t('visibilityCommunity')}</option> */}
                    <option value="private">{t('visibilityPrivate')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {t('endDate')}
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
              <details className="group" open={formData.visibility !== 'public'}>
                <summary className={`cursor-pointer text-sm font-semibold transition-colors font-inter flex items-center gap-2 py-3 ${
                  formData.visibility === 'public' 
                    ? 'text-ink-muted cursor-not-allowed' 
                    : 'text-magenta hover:text-sunset'
                }`}>
                  <svg className={`h-5 w-5 transform transition-transform group-open:rotate-90 ${formData.visibility === 'public' ? 'opacity-50' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {t('additionalSettings')}
                  {formData.visibility === 'public' && (
                    <span className="text-xs text-ink-muted ml-2 font-normal">
                      ({t('publicSettingsNotEditable') || 'Non modifiable pour les cagnottes publiques'})
                    </span>
                  )}
                </summary>
                <div className={`mt-4 space-y-4 pl-7 border-l-2 border-cloud ${formData.visibility === 'public' ? 'opacity-60' : ''}`}>
                  {/* Start Date and Max Participants - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                      <label className={`block text-sm font-semibold mb-2 font-inter ${
                        formData.visibility === 'public' ? 'text-ink-muted' : 'text-night'
                      }`}>
                        {t('startDate')}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({t('startDateDefault')})
                        </span>
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        disabled={formData.visibility === 'public'}
                        className={`w-full px-4 py-3 border-2 border-cloud rounded-2xl transition-all font-inter ${
                          formData.visibility === 'public' 
                            ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                            : 'focus:ring-2 focus:ring-magenta focus:border-transparent'
                        }`}
                      />
                    </div>

                    {/* Max Participants */}
                    <div>
                      <label className={`block text-sm font-semibold mb-2 font-inter ${
                        formData.visibility === 'public' ? 'text-ink-muted' : 'text-night'
                      }`}>
                        {t('maxParticipants')}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({t('maxParticipantsDefault')})
                        </span>
                      </label>
                      <input
                        type="number"
                        name="max_participants"
                        value={formData.max_participants}
                        onChange={handleInputChange}
                        min="1"
                        disabled={formData.visibility === 'public'}
                        className={`w-full px-4 py-3 border-2 border-cloud rounded-2xl transition-all font-inter ${
                          formData.visibility === 'public' 
                            ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                            : 'focus:ring-2 focus:ring-magenta focus:border-transparent'
                        }`}
                        placeholder={t('maxParticipantsPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Min/Max Contributions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 font-inter ${
                        formData.visibility === 'public' ? 'text-ink-muted' : 'text-night'
                      }`}>
                        {t('minContribution')}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({t('minContributionDefault')})
                        </span>
                      </label>
                      <input
                        type="number"
                        name="min_contribution"
                        value={formData.min_contribution}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        disabled={formData.visibility === 'public'}
                        className={`w-full px-4 py-3 border-2 border-cloud rounded-2xl transition-all font-inter ${
                          formData.visibility === 'public' 
                            ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                            : 'focus:ring-2 focus:ring-magenta focus:border-transparent'
                        }`}
                        placeholder={t('minContributionPlaceholder')}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 font-inter ${
                        formData.visibility === 'public' ? 'text-ink-muted' : 'text-night'
                      }`}>
                        {t('maxContribution')}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({t('maxContributionDefault')})
                        </span>
                      </label>
                      <input
                        type="number"
                        name="max_contribution"
                        value={formData.max_contribution}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        disabled={formData.visibility === 'public'}
                        className={`w-full px-4 py-3 border-2 border-cloud rounded-2xl transition-all font-inter ${
                          formData.visibility === 'public' 
                            ? 'bg-gray-50 cursor-not-allowed opacity-60' 
                            : 'focus:ring-2 focus:ring-magenta focus:border-transparent'
                        }`}
                        placeholder={t('maxContributionPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Allow Anonymous Contributions */}
                  <div className={`flex items-start gap-3 p-4 border-2 border-cloud rounded-2xl ${
                    formData.visibility === 'public' ? 'bg-gray-50' : ''
                  }`}>
                    <input
                      type="checkbox"
                      id="allow-anonymous"
                      checked={allowAnonymous}
                      onChange={(e) => setAllowAnonymous(e.target.checked)}
                      disabled={formData.visibility === 'public'}
                      className={`mt-1 w-5 h-5 text-magenta focus:ring-magenta rounded ${
                        formData.visibility === 'public' ? 'cursor-not-allowed opacity-60' : ''
                      }`}
                    />
                    <label 
                      htmlFor="allow-anonymous" 
                      className={`flex-1 text-sm font-inter ${
                        formData.visibility === 'public' 
                          ? 'text-ink-muted cursor-not-allowed' 
                          : 'text-night cursor-pointer'
                      }`}
                    >
                      <div className="font-semibold mb-1">
                        {t('allowAnonymous')}
                      </div>
                      <div className="text-xs text-ink-muted">
                        {t('allowAnonymousDescription')}
                      </div>
                    </label>
                  </div>
                </div>
              </details>

              {/* Illustrations */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-night mb-2 font-inter">
                    {t('illustrations')}
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
                      {t('clickToAddIllustrations')}
                    </span>
                    <span className="text-xs text-center">
                      {t('illustrationsFormat')}
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
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id="charter-accept"
                      checked={charterAccepted}
                      onChange={(e) => setCharterAccepted(e.target.checked)}
                      className="sr-only"
                      required
                    />
                    <label
                      htmlFor="charter-accept"
                      className={`flex items-center justify-center w-4 h-4 border-2 rounded cursor-pointer transition-all duration-200 hover:border-magenta focus-within:ring-2 focus-within:ring-magenta focus-within:ring-offset-1 ${
                        charterAccepted
                          ? 'bg-gradient-to-br from-magenta to-sunset border-transparent shadow-md shadow-magenta/30'
                          : 'border-cloud'
                      }`}
                    >
                      {charterAccepted && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </label>
                  </div>
                  <label htmlFor="charter-accept" className="text-sm text-night font-inter cursor-pointer flex-1 leading-relaxed">
                    {t('charterAccept')}{' '}
                    <a 
                      href="https://cocoti.com/terms-of-service" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-magenta hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('charterTerms')}
                    </a>
                    {' '}{t('charterAnd')}{' '}
                    <a 
                      href="https://cocoti.com/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-magenta hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t('charterPrivacy')}
                    </a>
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
                  {t('cancel')}
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !charterAccepted}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                >
                  {t('step1Button')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* OTP Verification Modal */}
        {currentStep === 'verification' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-cloud p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-night mb-2 font-inter">
                      {t('step2Title')}
                    </h2>
                    <p className="text-ink-muted font-inter text-sm">
                      {t('step2Subtitle')}
                    </p>
                  </div>
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
                      setPhoneNumber('');
                      // Reset country to default
                      const defaultCountry = countries.find(c => c.code === 'SN');
                      if (defaultCountry) {
                        setSelectedCountryCode(defaultCountry.code);
                        setSelectedCallingCode(defaultCountry.calling_code);
                      }
                    }}
                    className="p-2 hover:bg-cloud rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-ink-muted" />
                  </button>
                </div>

              {/* Authentication fields (if not logged in) */}
              {!isAuthenticated() && (
                <div className="space-y-4">
                  {/* Step 1: Phone Number with Country Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-night mb-2 font-inter">
                      {t('phoneLabel')}
                    </label>
                    <div className="flex gap-2 items-stretch">
                      {/* Country Code Selector */}
                      <div className="relative flex-shrink-0 w-auto">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => {
                            const country = countries.find(c => c.code === e.target.value);
                            if (country) {
                              setSelectedCountryCode(country.code);
                              setSelectedCallingCode(country.calling_code);
                            }
                          }}
                          required
                          disabled={!!otpSessionId}
                          className="appearance-none px-3 py-3 pr-8 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter disabled:opacity-50 disabled:cursor-not-allowed bg-white cursor-pointer text-sm h-full"
                          style={{ minWidth: '100px', maxWidth: '120px' }}
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag_emoji} {country.calling_code}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      {/* Phone Number Input */}
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={!!otpSessionId}
                        className="flex-1 min-w-0 px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={t('phonePlaceholder')}
                      />
                    </div>
                    {!otpSessionId && (
                      <button
                        type="button"
                        onClick={sendOTP}
                        disabled={isSendingOtp || !selectedCallingCode || !phoneNumber.trim()}
                        className="mt-2 px-4 py-2 bg-gradient-to-r from-magenta to-sunset text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                      >
                        {isSendingOtp 
                          ? t('sending')
                          : t('sendOtp')
                        }
                      </button>
                    )}
                  </div>

                  {/* Step 2: OTP Code with Individual Boxes */}
                  {otpSessionId && !otpVerified && (
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {t('otpLabel')}
                      </label>
                      <div className="flex gap-2 justify-center mb-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otpCode[index] || ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value) {
                                const newOtpCode = otpCode.split('');
                                newOtpCode[index] = value;
                                const updatedCode = newOtpCode.join('').slice(0, 6);
                                setOtpCode(updatedCode);
                                
                                // Auto-focus next input
                                if (index < 5 && value) {
                                  const nextInput = document.getElementById(`otp-input-${index + 1}`);
                                  nextInput?.focus();
                                }
                              } else {
                                // Handle backspace
                                const newOtpCode = otpCode.split('');
                                newOtpCode[index] = '';
                                setOtpCode(newOtpCode.join(''));
                              }
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace
                              if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                                const prevInput = document.getElementById(`otp-input-${index - 1}`);
                                prevInput?.focus();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                              if (pastedData) {
                                setOtpCode(pastedData);
                                // Focus last filled input or last input
                                const lastIndex = Math.min(pastedData.length - 1, 5);
                                const lastInput = document.getElementById(`otp-input-${lastIndex}`);
                                lastInput?.focus();
                              }
                            }}
                            id={`otp-input-${index}`}
                            className="w-12 h-14 text-center text-2xl font-bold border-2 border-cloud rounded-xl focus:ring-2 focus:ring-magenta focus:border-magenta transition-all font-inter"
                            autoFocus={index === 0}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-ink-muted font-inter text-center mb-3">
                        {t('otpDescription')}
                      </p>
                      <button
                        type="button"
                        onClick={handleOTPVerification}
                        disabled={otpCode.length !== 6 || isLoading}
                        className="w-full px-4 py-2 bg-gradient-to-r from-magenta to-sunset text-white rounded-xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                      >
                        {isLoading 
                          ? t('otpVerifying')
                          : t('otpVerify')
                        }
                      </button>
                    </div>
                  )}

                  {/* Step 3: Full Name (only if user needs registration) */}
                  {otpVerified && needsRegistration && (
                    <div>
                      <label className="block text-sm font-semibold text-night mb-2 font-inter">
                        {t('fullNameLabel')}
                        <span className="text-xs text-ink-muted ml-2 font-normal">
                          ({t('fullNameDescription')})
                        </span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-cloud rounded-2xl focus:ring-2 focus:ring-magenta focus:border-transparent transition-all font-inter"
                        placeholder={t('fullNamePlaceholder')}
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
                      {t('alreadyAuthenticated')}
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
                      setPhoneNumber('');
                      // Reset country to default
                      const defaultCountry = countries.find(c => c.code === 'SN');
                      if (defaultCountry) {
                        setSelectedCountryCode(defaultCountry.code);
                        setSelectedCallingCode(defaultCountry.calling_code);
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold hover:border-magenta hover:bg-magenta/5 transition-all font-inter"
                  >
                    {t('cancel')}
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
                      ? t('creating')
                      : t('createButton')
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Activation Modal */}
        {currentStep === 'activation' && createdMoneyPoolId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-cloud p-6 sm:p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-magenta to-sunset rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-night mb-2 font-inter">
                  {t('activationTitle')}
                </h2>
                <p className="text-ink-muted font-inter text-sm">
                  {t('activationQuestion')}
                </p>
              </div>

              <div className="space-y-3 mb-6">
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
                      {t('publishNow')}
                    </div>
                    <div className="text-sm text-ink-muted font-inter">
                      {t('publishNowDescription')}
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
                      {t('keepDraft')}
                    </div>
                    <div className="text-sm text-ink-muted font-inter">
                      {t('keepDraftDescription')}
                    </div>
                  </div>
                </label>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-inter">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleActivation}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed font-inter"
              >
                {isLoading
                  ? t('processing')
                  : t('continue')
                }
              </button>
            </motion.div>
          </div>
        )}

        {/* Publish Warning Modal */}
        <CustomConfirmationModal
          isOpen={showPublishWarning}
          onClose={() => setShowPublishWarning(false)}
          onConfirm={handleConfirmPublish}
          title={t('publishWarningTitle')}
          message={t('publishWarningMessage')}
          confirmText={t('publishConfirm')}
          cancelText={t('cancel')}
          type="warning"
          isLoading={isLoading}
        />

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
                {t('successTitle')}
              </h2>
              <p className="text-lg text-ink-muted font-inter">
                {activateImmediately 
                  ? t('successActive')
                  : t('successDraft')
                }
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Message spécifique pour les cagnottes privées */}
              {createdMoneyPoolVisibility === 'private' && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-blue-800 font-inter">
                    {t('privateMessage')}
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center flex-wrap">
                {/* Bouton "Voir toutes les cagnottes" - seulement pour publiques et actives */}
                {createdMoneyPoolVisibility === 'public' && createdMoneyPoolStatus === 'active' && (
                  <Link
                    href={`/${locale}/money-pools`}
                    className="px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold hover:border-magenta hover:bg-magenta/5 transition-all font-inter"
                  >
                    {t('viewAllPools')}
                  </Link>
                )}

                {/* Bouton "Copier le lien" - pour les cagnottes privées */}
                {createdMoneyPoolVisibility === 'private' && (
                  <button
                    onClick={async () => {
                      const url = `${window.location.origin}/${locale}/money-pool/${createdMoneyPoolId}`;
                      try {
                        await navigator.clipboard.writeText(url);
                        setToast({ message: t('linkCopied'), type: 'success' });
                      } catch (err) {
                        // Fallback pour les navigateurs qui ne supportent pas clipboard API
                        const textArea = document.createElement('textarea');
                        textArea.value = url;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        setToast({ message: t('linkCopied'), type: 'success' });
                      }
                    }}
                    className="px-6 py-3 bg-white border-2 border-cloud rounded-2xl text-night font-semibold hover:border-magenta hover:bg-magenta/5 transition-all font-inter flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {t('copyLink')}
                  </button>
                )}

                {/* Bouton "Voir ma cagnotte" - toujours affiché */}
                <Link
                  href={`/${locale}/money-pool/${createdMoneyPoolId}`}
                  className="px-6 py-3 bg-gradient-to-r from-magenta via-sunset to-coral text-white rounded-2xl font-semibold hover:shadow-glow transition-all font-inter"
                >
                  {t('viewMyPool')}
                </Link>

                {/* Bouton "Gérer dans le dashboard" - toujours affiché */}
                <a
                  href={`${APP_CONFIG.DASHBOARD_URL}/${locale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white border-2 border-sunset rounded-2xl text-sunset font-semibold hover:bg-sunset/5 hover:border-magenta transition-all font-inter flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  {t('manageInDashboard')}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

