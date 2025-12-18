/**
 * Detects the OS of the user's device and returns the corresponding app store link.
 */
export const getAppStoreLink = (apps: Array<{ store: string; href: string }>) => {
    if (typeof window === 'undefined') {
        const googlePlay = apps.find(app => app.store.toLowerCase().includes('google') || app.store.toLowerCase().includes('play'));
        return googlePlay?.href || apps[0]?.href || 'https://play.google.com/store/apps';
    }

    const userAgent = window.navigator.userAgent || window.navigator.vendor;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        const appleStore = apps.find(app => app.store.toLowerCase().includes('apple') || app.store.toLowerCase().includes('app store'));
        return appleStore?.href || 'https://apps.apple.com/';
    }

    // Android detection
    if (/android/i.test(userAgent)) {
        const googlePlay = apps.find(app => app.store.toLowerCase().includes('google') || app.store.toLowerCase().includes('play'));
        return googlePlay?.href || 'https://play.google.com/store/apps';
    }

    // Default fallback (e.g., desktop): prioritize Play Store
    const googlePlay = apps.find(app => app.store.toLowerCase().includes('google') || app.store.toLowerCase().includes('play'));
    return googlePlay?.href || apps[0]?.href || 'https://play.google.com/store/apps';
};
