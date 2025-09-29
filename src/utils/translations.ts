// Fichier utilitaire pour gérer les traductions
import frMessages from "@/i18n/messages/fr.json";
import enMessages from "@/i18n/messages/en.json";

export const getTranslations = (locale: 'fr' | 'en') => {
  return locale === 'fr' ? frMessages : enMessages;
};

export const translate = (key: string, locale: 'fr' | 'en', content?: any) => {
  const fallbackMessages = getTranslations(locale);
  const messages = content || fallbackMessages;
  
  const keys = key.split('.');
  let value: any = messages;
  for (const k of keys) {
    value = value?.[k];
  }
  
  // Si la valeur n'existe pas dans les données de l'API, essayer les fichiers JSON
  if (!value && content) {
    let fallbackValue: any = fallbackMessages;
    for (const k of keys) {
      fallbackValue = fallbackValue?.[k];
    }
    return fallbackValue || key;
  }
  
  return value || key;
};
