"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  PhotoIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import GenericSectionForm from "./forms/GenericSectionForm";
import FooterEditor from "./FooterEditor";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import { useContent } from "@/hooks/useContent";
import Notification from "../Notification";

type AdminSection = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
};

// Traductions pour l'interface admin
const adminTranslations = {
  fr: {
    title: "Administration Cocoti",
    subtitle: "Gérez le contenu de votre site",
    sections: {
      hero: {
        title: "Section Hero",
        description: "Gérer le titre principal, sous-titre et boutons d'action"
      },
      solutions: {
        title: "Solutions",
        description: "Modifier les solutions proposées (tontines, cagnottes, etc.)"
      },
      how: {
        title: "Comment ça marche",
        description: "Éditer les étapes du processus"
      },
      why: {
        title: "Pourquoi nous choisir",
        description: "Gérer les valeurs et avantages"
      },
      pricing: {
        title: "Tarifs",
        description: "Modifier les plans et prix"
      },
      testimonials: {
        title: "Témoignages",
        description: "Gérer les avis clients"
      },
      faq: {
        title: "FAQ",
        description: "Questions fréquentes"
      },
      contact: {
        title: "Contact",
        description: "Informations de contact"
      },
      footer: {
        title: "Footer",
        description: "Modifier les liens et informations du pied de page"
      }
    },
    navigation: {
      dashboard: "Tableau de bord",
      edit: "Éditer",
      back: "Retour au dashboard",
      save: "Sauvegarder",
      cancel: "Annuler"
    }
  },
  en: {
    title: "Cocoti Administration",
    subtitle: "Manage your website content",
    sections: {
      hero: {
        title: "Hero Section",
        description: "Manage main title, subtitle and action buttons"
      },
      solutions: {
        title: "Solutions",
        description: "Edit proposed solutions (tontines, money pots, etc.)"
      },
      how: {
        title: "How it works",
        description: "Edit process steps"
      },
      why: {
        title: "Why choose us",
        description: "Edit values and benefits"
      },
      pricing: {
        title: "Pricing",
        description: "Manage plans and prices"
      },
      testimonials: {
        title: "Testimonials",
        description: "Edit customer reviews"
      },
      faq: {
        title: "FAQ",
        description: "Manage frequently asked questions"
      },
      contact: {
        title: "Contact",
        description: "Edit contact information"
      },
      footer: {
        title: "Footer",
        description: "Manage footer links and information"
      }
    },
    navigation: {
      dashboard: "Dashboard",
      edit: "Edit",
      back: "Back to dashboard",
      save: "Save",
      cancel: "Cancel"
    }
  }
};

const getAdminSections = (locale: string): AdminSection[] => [
  {
    id: "hero",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.hero.title || "Hero Section",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.hero.description || "Manage main title, subtitle and action buttons",
    icon: DocumentTextIcon,
    color: "bg-blue-500"
  },
  {
    id: "solutions",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.solutions.title || "Solutions",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.solutions.description || "Edit proposed solutions",
    icon: Cog6ToothIcon,
    color: "bg-green-500"
  },
  {
    id: "how",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.how.title || "How it works",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.how.description || "Edit process steps",
    icon: UsersIcon,
    color: "bg-purple-500"
  },
  {
    id: "why",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.why.title || "Why choose us",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.why.description || "Edit values and benefits",
    icon: QuestionMarkCircleIcon,
    color: "bg-orange-500"
  },
  {
    id: "pricing",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.pricing.title || "Pricing",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.pricing.description || "Manage plans and prices",
    icon: CurrencyDollarIcon,
    color: "bg-yellow-500"
  },
  {
    id: "testimonials",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.testimonials.title || "Testimonials",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.testimonials.description || "Edit customer reviews",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-pink-500"
  },
  {
    id: "faq",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.faq.title || "FAQ",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.faq.description || "Manage frequently asked questions",
    icon: QuestionMarkCircleIcon,
    color: "bg-indigo-500"
  },
  {
    id: "contact",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.contact.title || "Contact",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.contact.description || "Edit contact information",
    icon: EnvelopeIcon,
    color: "bg-red-500"
  },
  {
    id: "footer",
    title: adminTranslations[locale as keyof typeof adminTranslations]?.sections.footer.title || "Footer",
    description: adminTranslations[locale as keyof typeof adminTranslations]?.sections.footer.description || "Manage footer links and information",
    icon: DocumentTextIcon,
    color: "bg-gray-500"
  }
];

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  
  // Obtenir les sections traduites
  const adminSections = getAdminSections(locale);
  const t = adminTranslations[locale];
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user, logout } = useAdminAuthContext();
  const { content, updateContent } = useContent(locale);

  console.log('🔍 AdminDashboard: Re-render, notification:', notification);

  // Gérer la notification avec un useEffect
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handleBackToDashboard = () => {
    setSelectedSection(null);
  };

  const handleSaveContent = async (section: string, data: any) => {
    console.log('🔍 AdminDashboard handleSaveContent: Début');
    console.log('🔍 AdminDashboard handleSaveContent: Section:', section);
    console.log('🔍 AdminDashboard handleSaveContent: Data:', data);
    
    try {
      const result = await updateContent(section, data);
      if (result.success) {
        setNotification({ message: 'Contenu sauvegardé avec succès !', type: 'success' });
      } else {
        setNotification({ message: 'Erreur lors de la sauvegarde', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setNotification({ message: 'Erreur lors de la sauvegarde', type: 'error' });
    }
  };

  return (
    <div className="flex h-screen bg-sand">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 border-r border-cloud`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-cloud">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-sunset to-magenta rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="ml-2 text-xl font-bold text-night">Cocoti Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-ink-muted hover:text-night"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {adminSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-2xl transition-colors ${
                  selectedSection === section.id
                    ? 'bg-gradient-to-r from-sunset/10 to-magenta/10 text-night border border-sunset/20'
                    : 'text-ink-muted hover:bg-ivory hover:text-night'
                }`}
              >
                <section.icon className="mr-3 h-5 w-5" />
                {section.title}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-cloud">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-ink-muted hover:text-night"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="ml-2 text-2xl font-semibold text-night">
                {selectedSection ? `Éditer - ${adminSections.find(s => s.id === selectedSection)?.title}` : 'Dashboard Admin'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ink-muted">Langue:</span>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as 'fr' | 'en')}
                  className="px-3 py-1 border border-cloud rounded-2xl text-sm bg-ivory focus:ring-2 focus:ring-magenta focus:border-magenta"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>
              <a
                href={`/${locale}`}
                target="_blank"
                className="px-4 py-2 border border-cloud text-night rounded-2xl hover:bg-ivory transition-colors"
              >
                Voir le site
              </a>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ink-muted">
                  {user?.name || 'Admin'}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 text-coral hover:bg-coral/10 rounded-2xl transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span className="text-sm">Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {!selectedSection ? (
            <div>
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-night mb-2">{t.title}</h2>
                    <p className="text-ink-muted">{t.subtitle}</p>
                  </div>
                  
                  {/* Sélecteur de langue */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocale('fr')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locale === 'fr'
                          ? 'bg-magenta text-white'
                          : 'bg-ivory text-ink-muted hover:bg-cloud'
                      }`}
                    >
                      🇫🇷 FR
                    </button>
                    <button
                      onClick={() => setLocale('en')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locale === 'en'
                          ? 'bg-magenta text-white'
                          : 'bg-ivory text-ink-muted hover:bg-cloud'
                      }`}
                    >
                      🇬🇧 EN
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminSections.map((section) => (
                  <motion.div
                    key={section.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-sm border border-cloud p-6 cursor-pointer hover:shadow-lg transition-shadow hover:border-sunset/20"
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-2xl ${section.color} shadow-glow`}>
                        <section.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="ml-3 text-lg font-semibold text-night">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-ink-muted text-sm">
                      {section.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={handleBackToDashboard}
                className="mb-6 flex items-center text-ink-muted hover:text-night transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
{t.navigation.back}
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-cloud p-6">
                <h3 className="text-xl font-semibold text-night mb-4">
                  {t.navigation.edit} : {adminSections.find(s => s.id === selectedSection)?.title}
                </h3>
                <p className="text-ink-muted mb-6">
                  {adminSections.find(s => s.id === selectedSection)?.description}
                </p>
                
                {/* Formulaire d'édition spécialisé pour le footer */}
                {selectedSection === 'footer' ? (
                  <FooterEditor
                    footer={content?.footer || { company: '', legalLinks: [], socialLinks: [], quickLinks: [] }}
                    onUpdate={(data) => handleSaveContent('footer', data)}
                    locale={locale}
                  />
                ) : (
                  /* Formulaire d'édition générique */
                  <GenericSectionForm
                    section={selectedSection}
                    sectionTitle={adminSections.find(s => s.id === selectedSection)?.title || ''}
                    sectionDescription={adminSections.find(s => s.id === selectedSection)?.description || ''}
                    onSave={(data) => handleSaveContent(selectedSection!, data)}
                    onCancel={handleBackToDashboard}
                    locale={locale}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
