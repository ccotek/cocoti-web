/**
 * Unified token storage utility
 * Centralizes token storage/retrieval across the application
 * 
 * All parts of the application use 'cocoti_access_token' as the single source of truth
 */

const TOKEN_KEY = 'cocoti_access_token';

/**
 * Get authentication token from storage
 * Uses the unified key: cocoti_access_token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Store authentication token
 * Uses the unified key: cocoti_access_token
 * Also migrates from legacy keys and cleans them up
 */
export function setAuthToken(token: string, useSessionStorage = false): void {
  const storage = useSessionStorage ? sessionStorage : localStorage;
  
  // Store in unified key
  storage.setItem(TOKEN_KEY, token);
  
  // Migrate from legacy keys and clean them up to avoid conflicts
  const legacyKeys = ['auth_token', 'admin_token', 'cocoti_auth_token', 'token'];
  legacyKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

/**
 * Remove authentication token from storage
 * Also cleans up any legacy keys
 */
export function clearAuthToken(): void {
  // Clear unified key
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  
  // Clean up legacy keys
  const legacyKeys = ['auth_token', 'admin_token', 'cocoti_auth_token', 'token'];
  legacyKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Get authorization header value
 */
export function getAuthHeader(): string | null {
  const token = getAuthToken();
  return token ? `Bearer ${token}` : null;
}

