// Fichier utilitaire pour gérer les traductions
// Utilisation de données statiques pour éviter les problèmes avec Turbopack

// Données de traduction statiques
const frMessages = {
  "meta": {
    "title": "Cocoti – L'app qui digitalise la solidarité humaine",
    "description": "Cocoti facilite la gestion de tontines digitales, cagnottes solidaires et projets collectifs avec une expérience fluide et sécurisée."
  },
  "language": {
    "label": "Langue",
    "switchTo": {
      "fr": "Passer en français",
      "en": "Switch to English"
    }
  },
  "navigation": {
    "cta": "Télécharger l'app",
    "items": [
      {
        "id": "solutions",
        "label": "Nos solutions"
      },
      {
        "id": "how",
        "label": "Comment ça marche"
      },
      {
        "id": "pricing",
        "label": "Tarifs"
      },
      {
        "id": "faq",
        "label": "FAQ"
      }
    ]
  },
  "whatsapp": {
    "defaultMessage": "Bonjour ! Je suis intéressé(e) par Cocoti. Pouvez-vous m'en dire plus ?",
    "buttonTitle": "Contacter via WhatsApp"
  },
  "accessibility": {
    "toggleMenu": "Ouvrir le menu",
    "closeMenu": "Fermer le menu",
    "closeModal": "Fermer"
  },
  "footer": {
    "company": "Développé entre Dakar et Paris pour digitaliser la solidarité humaine.",
    "copyright": "Tous droits réservés.",
    "socialLinks": [
      {
        "label": "",
        "href": "https://x.com/cocoti",
        "icon": "x"
      },
      {
        "label": "",
        "href": "https://youtube.com/cocoti",
        "icon": "youtube"
      },
      {
        "label": "",
        "href": "https://linkedin.com/company/cocoti",
        "icon": "linkedin"
      },
      {
        "label": "",
        "href": "https://tiktok.com/cocoti",
        "icon": "tiktok"
      },
      {
        "label": "",
        "href": "https://whatsapp.com/cocoti",
        "icon": "whatsapp"
      },
      {
        "label": "",
        "href": "https://facebook.com/cocoti",
        "icon": "facebook"
      },
      {
        "label": "",
        "href": "https://instagram.com/cocoti",
        "icon": "instagram"
      }
    ]
  },
  "hero": {
    "badge": "L'app qui digitalise la solidarité humaine",
    "title": "La finance collective, simple et transparente.",
    "subtitle": "Avec Cocoti, gérez vos tontines, cagnottes et projets en toute simplicité. Invitez votre communauté, automatisez les contributions et suivez vos progrès en temps réel.",
    "download": "Télécharger l'app",
    "viewDashboard": "Commencer maintenant"
  },
  "solutions": {
    "title": "Une app, toutes vos solutions collectives.",
    "subtitle": "Gérez vos projets financiers en groupe avec des outils adaptés à vos besoins."
  },
  "how": {
    "title": "Comment ça marche",
    "subtitle": "Trois étapes simples pour lancer votre projet collectif."
  },
  "why": {
    "title": "Pourquoi choisir Cocoti",
    "subtitle": "Des fonctionnalités pensées pour la solidarité africaine."
  },
  "pricing": {
    "title": "Tarifs transparents",
    "subtitle": "Choisissez le plan qui correspond à vos besoins."
  },
  "testimonials": {
    "title": "Ils nous font confiance",
    "subtitle": "Découvrez comment Cocoti transforme leurs projets collectifs."
  },
  "faq": {
    "title": "Questions fréquentes",
    "subtitle": "Tout ce que vous devez savoir sur Cocoti.",
    "cta": {
      "title": "Vous ne trouvez pas votre réponse ?",
      "description": "Notre équipe est là pour vous aider. Contactez-nous directement sur WhatsApp pour une réponse personnalisée.",
      "whatsapp": "Nous écrire sur WhatsApp"
    }
  },
  "admin": {
    "title": "Administration Cocoti",
    "subtitle": "Gérez le contenu de votre site",
    "sections": {
      "hero": {
        "title": "Section Hero",
        "description": "Gérer le titre principal, sous-titre et boutons d'action"
      },
      "solutions": {
        "title": "Solutions",
        "description": "Modifier les solutions proposées (tontines, cagnottes, etc.)"
      },
      "how": {
        "title": "Comment ça marche",
        "description": "Éditer les étapes du processus"
      },
      "why": {
        "title": "Pourquoi nous choisir",
        "description": "Gérer les valeurs et avantages"
      },
      "pricing": {
        "title": "Tarifs",
        "description": "Modifier les plans et prix"
      },
      "testimonials": {
        "title": "Témoignages",
        "description": "Gérer les avis clients"
      },
      "faq": {
        "title": "FAQ",
        "description": "Questions fréquentes"
      },
        "footer": {
          "title": "Footer",
          "description": "Modifier les liens et informations du pied de page"
        },
        "whatsapp": {
          "title": "WhatsApp",
          "description": "Configurer le numéro et message WhatsApp"
        },
        "legal": {
          "title": "Mentions Légales",
          "description": "Gérer les informations légales et mentions obligatoires"
        }
      },
      "whatsapp": {
        "title": "Configuration WhatsApp",
        "numberLabel": "Numéro WhatsApp",
        "numberPlaceholder": "Ex: +221771234567",
        "numberHelp": "Format international avec le code pays (ex: +221 pour le Sénégal)",
        "messageLabel": "Message par défaut",
        "messagePlaceholder": "Message qui sera pré-rempli dans WhatsApp",
        "messageHelp": "Ce message apparaîtra automatiquement quand les utilisateurs cliquent sur le bouton WhatsApp"
    },
    "navigation": {
      "dashboard": "Tableau de bord",
      "edit": "Éditer",
      "back": "Retour au dashboard",
      "save": "Sauvegarder",
      "cancel": "Annuler"
    },
    "forms": {
      "save": "Enregistrer",
      "cancel": "Annuler",
      "saving": "Enregistrement...",
      "saved": "Enregistré avec succès !",
      "error": "Erreur lors de l'enregistrement"
    }
  },
  "cookies": {
    "title": "Gestion des cookies",
    "description": "Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et personnaliser le contenu. Vous pouvez choisir quels cookies accepter ou refuser.",
    "customize": "Personnaliser mes choix",
    "privacyPolicy": "Politique de confidentialité",
    "rejectAll": "Refuser tout",
    "acceptAll": "Accepter tout",
    "settingsTitle": "Paramètres des cookies",
    "necessary": {
      "title": "Cookies nécessaires",
      "description": "Essentiels au fonctionnement du site. Ne peuvent pas être désactivés."
    },
    "analytics": {
      "title": "Cookies analytiques",
      "description": "Nous aident à comprendre comment vous utilisez notre site."
    },
    "marketing": {
      "title": "Cookies marketing",
      "description": "Utilisés pour vous montrer des publicités pertinentes."
    },
    "preferences": {
      "title": "Cookies de préférences",
      "description": "Mémorisent vos choix pour personnaliser votre expérience."
    },
    "saveChoices": "Sauvegarder mes choix"
  }
};

const enMessages = {
  "meta": {
    "title": "Cocoti – The app digitalizing human solidarity",
    "description": "Cocoti makes it simple to run digital tontines, solidarity funds and collective projects with a smooth, secure experience."
  },
  "language": {
    "label": "Language",
    "switchTo": {
      "fr": "Passer en français",
      "en": "Switch to English"
    }
  },
  "navigation": {
    "cta": "Download the app",
    "items": [
      {
        "id": "solutions",
        "label": "Solutions"
      },
      {
        "id": "how",
        "label": "How it works"
      },
      {
        "id": "pricing",
        "label": "Pricing"
      },
      {
        "id": "faq",
        "label": "FAQ"
      }
    ]
  },
  "whatsapp": {
    "defaultMessage": "Hello! I'm interested in Cocoti. Can you tell me more?",
    "buttonTitle": "Contact via WhatsApp"
  },
  "accessibility": {
    "toggleMenu": "Open menu",
    "closeMenu": "Close menu",
    "closeModal": "Close"
  },
  "footer": {
    "company": "Developed between Dakar and Paris to digitize human solidarity.",
    "copyright": "All rights reserved.",
    "socialLinks": [
      {
        "label": "",
        "href": "https://x.com/cocoti",
        "icon": "x"
      },
      {
        "label": "",
        "href": "https://youtube.com/cocoti",
        "icon": "youtube"
      },
      {
        "label": "",
        "href": "https://linkedin.com/company/cocoti",
        "icon": "linkedin"
      },
      {
        "label": "",
        "href": "https://tiktok.com/cocoti",
        "icon": "tiktok"
      },
      {
        "label": "",
        "href": "https://whatsapp.com/cocoti",
        "icon": "whatsapp"
      },
      {
        "label": "",
        "href": "https://facebook.com/cocoti",
        "icon": "facebook"
      },
      {
        "label": "",
        "href": "https://instagram.com/cocoti",
        "icon": "instagram"
      }
    ]
  },
  "hero": {
    "badge": "The app digitizing human solidarity",
    "title": "Simple and transparent community finance.",
    "subtitle": "With Cocoti, manage your tontines, group savings, and community projects effortlessly. Invite your crew, automate contributions, and track progress in real time.",
    "download": "Download the app",
    "viewDashboard": "Start now"
  },
  "solutions": {
    "title": "One app, all your collective solutions.",
    "subtitle": "Manage your group financial projects with tools tailored to your needs."
  },
  "how": {
    "title": "How it works",
    "subtitle": "Three simple steps to launch your collective project."
  },
  "why": {
    "title": "Why choose Cocoti",
    "subtitle": "Features designed for African solidarity."
  },
  "pricing": {
    "title": "Transparent pricing",
    "subtitle": "Choose the plan that fits your needs."
  },
  "testimonials": {
    "title": "They trust us",
    "subtitle": "Discover how Cocoti transforms their collective projects."
  },
  "faq": {
    "title": "Frequently asked questions",
    "subtitle": "Everything you need to know about Cocoti.",
    "cta": {
      "title": "Can't find your answer?",
      "description": "Our team is here to help. Contact us directly on WhatsApp for a personalized response.",
      "whatsapp": "Write to us on WhatsApp"
    }
  },
  "admin": {
    "title": "Cocoti Administration",
    "subtitle": "Manage your website content",
    "sections": {
      "hero": {
        "title": "Hero Section",
        "description": "Manage main title, subtitle and action buttons"
      },
      "solutions": {
        "title": "Solutions",
        "description": "Edit proposed solutions (tontines, money pots, etc.)"
      },
      "how": {
        "title": "How it works",
        "description": "Edit process steps"
      },
      "why": {
        "title": "Why choose us",
        "description": "Edit values and benefits"
      },
      "pricing": {
        "title": "Pricing",
        "description": "Manage plans and prices"
      },
      "testimonials": {
        "title": "Testimonials",
        "description": "Edit customer reviews"
      },
      "faq": {
        "title": "FAQ",
        "description": "Manage frequently asked questions"
      },
        "footer": {
          "title": "Footer",
          "description": "Manage footer links and information"
        },
        "whatsapp": {
          "title": "WhatsApp",
          "description": "Configure WhatsApp number and message"
        },
        "legal": {
          "title": "Legal Notice",
          "description": "Manage legal information and mandatory notices"
        }
      },
      "whatsapp": {
        "title": "WhatsApp Configuration",
        "numberLabel": "WhatsApp Number",
        "numberPlaceholder": "Ex: +221771234567",
        "numberHelp": "International format with country code (ex: +221 for Senegal)",
        "messageLabel": "Default Message",
        "messagePlaceholder": "Message that will be pre-filled in WhatsApp",
        "messageHelp": "This message will appear automatically when users click the WhatsApp button"
    },
    "navigation": {
      "dashboard": "Dashboard",
      "edit": "Edit",
      "back": "Back to dashboard",
      "save": "Save",
      "cancel": "Cancel"
    },
    "forms": {
      "save": "Save",
      "cancel": "Cancel",
      "saving": "Saving...",
      "saved": "Saved successfully!",
      "error": "Error saving"
    }
  },
  "cookies": {
    "title": "Cookie Management",
    "description": "We use cookies to improve your experience, analyze our traffic, and personalize content. You can choose which cookies to accept or reject.",
    "customize": "Customize my choices",
    "privacyPolicy": "Privacy Policy",
    "rejectAll": "Reject All",
    "acceptAll": "Accept All",
    "settingsTitle": "Cookie Settings",
    "necessary": {
      "title": "Necessary Cookies",
      "description": "Essential for the website to function. Cannot be disabled."
    },
    "analytics": {
      "title": "Analytics Cookies",
      "description": "Help us understand how you use our site."
    },
    "marketing": {
      "title": "Marketing Cookies",
      "description": "Used to show you relevant advertisements."
    },
    "preferences": {
      "title": "Preference Cookies",
      "description": "Remember your choices to personalize your experience."
    },
    "saveChoices": "Save my choices"
  }
};

export const getTranslations = (locale: 'fr' | 'en') => {
  return locale === 'fr' ? frMessages : enMessages;
};

// Fonction pour interpréter les variables d'environnement dans les chaînes
const interpolateEnvVars = (str: string): string => {
  if (typeof str !== 'string') return str;
  
  return str.replace(/\$\{([^}]+)\}/g, (match, expression) => {
    // Gérer les expressions comme "NEXT_PUBLIC_DASHBOARD_URL || 'default'"
    const parts = expression.split('||').map((part: string) => part.trim());
    
    for (const part of parts) {
      if (part.startsWith('NEXT_PUBLIC_')) {
        const envVar = part.replace(/['"]/g, '');
        const value = process.env[envVar];
        if (value) return value;
      } else if (part.startsWith("'") && part.endsWith("'")) {
        return part.slice(1, -1); // Retourner la valeur par défaut sans les quotes
      }
    }
    
    return match; // Retourner la chaîne originale si aucune substitution n'est possible
  });
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
    value = fallbackValue;
  }
  
  // Interpréter les variables d'environnement dans la valeur finale
  return interpolateEnvVars(value || key);
};
