"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  PhotoIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ScaleIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import GenericSectionForm from "./forms/GenericSectionForm";
import FooterEditor from "./FooterEditor";
import WhatsAppEditor from "./WhatsAppEditor";
import LegalEditor from "./LegalEditor";
import CausesCarouselEditor from "./forms/CausesCarouselEditor";
import PricingEditor from "./forms/PricingEditor";
import { useAdminAuthContext } from "@/contexts/AdminAuthContext";
import { useContent, ContentData } from "@/hooks/useContent";
import Notification from "../Notification";

type AdminSection = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
};

import { translate } from "@/utils/translations";

const getAdminSections = (locale: 'fr' | 'en'): AdminSection[] => [
  {
    id: "hero",
    title: translate("admin.sections.hero.title", locale),
    description: translate("admin.sections.hero.description", locale),
    icon: DocumentTextIcon,
    color: "bg-blue-500"
  },
  {
    id: "solutions",
    title: translate("admin.sections.solutions.title", locale),
    description: translate("admin.sections.solutions.description", locale),
    icon: Cog6ToothIcon,
    color: "bg-green-500"
  },
  {
    id: "how",
    title: translate("admin.sections.how.title", locale),
    description: translate("admin.sections.how.description", locale),
    icon: UsersIcon,
    color: "bg-purple-500"
  },
  {
    id: "why",
    title: translate("admin.sections.why.title", locale),
    description: translate("admin.sections.why.description", locale),
    icon: QuestionMarkCircleIcon,
    color: "bg-orange-500"
  },
  {
    id: "pricing",
    title: translate("admin.sections.pricing.title", locale),
    description: translate("admin.sections.pricing.description", locale),
    icon: CurrencyDollarIcon,
    color: "bg-yellow-500"
  },
  {
    id: "testimonials",
    title: translate("admin.sections.testimonials.title", locale),
    description: translate("admin.sections.testimonials.description", locale),
    icon: ChatBubbleLeftRightIcon,
    color: "bg-pink-500"
  },
  {
    id: "faq",
    title: translate("admin.sections.faq.title", locale),
    description: translate("admin.sections.faq.description", locale),
    icon: QuestionMarkCircleIcon,
    color: "bg-indigo-500"
  },
  {
    id: "footer",
    title: translate("admin.sections.footer.title", locale),
    description: translate("admin.sections.footer.description", locale),
    icon: DocumentTextIcon,
    color: "bg-gray-500"
  },
  {
    id: "whatsapp",
    title: translate("admin.sections.whatsapp.title", locale),
    description: translate("admin.sections.whatsapp.description", locale),
    icon: ChatBubbleLeftRightIcon,
    color: "bg-green-500"
  },
  {
    id: "legal",
    title: translate("admin.sections.legal.title", locale),
    description: translate("admin.sections.legal.description", locale),
    icon: ScaleIcon,
    color: "bg-indigo-500"
  },
  {
    id: "causes",
    title: translate("admin.sections.causes.title", locale),
    description: translate("admin.sections.causes.description", locale),
    icon: HeartIcon,
    color: "bg-pink-500"
  }
];

export default function AdminDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  
  // Obtenir la section sélectionnée depuis l'URL
  const selectedSection = searchParams.get('section');
  
  // Obtenir les sections traduites
  const adminSections = getAdminSections(locale);
  const t = (key: string) => translate(key, locale);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { user, logout } = useAdminAuthContext();
  const { content, updateContent } = useContent(locale);

  // Configuration par défaut pour le carousel des cagnottes
  const defaultCausesConfig = {
    enabled: true,
    autoRotate: true,
    rotationSpeed: 5,
    maxProjects: 6,
    selectedProjects: [] as string[],
    title: locale === 'fr' ? 'Des projets qui changent tout' : 'Projects that change everything',
    subtitle: locale === 'fr' 
      ? 'Rejoignez des milliers de personnes qui transforment leurs communautés grâce à la solidarité collective.'
      : 'Join thousands of people transforming their communities through collective solidarity.'
  };

  // Utiliser les données du CMS si disponibles
  const causesCarouselConfig = content?.causes ? {
    enabled: content.causes.enabled ?? defaultCausesConfig.enabled,
    autoRotate: content.causes.autoRotate ?? defaultCausesConfig.autoRotate,
    rotationSpeed: content.causes.rotationSpeed ?? defaultCausesConfig.rotationSpeed,
    maxProjects: content.causes.maxProjects ?? defaultCausesConfig.maxProjects,
    selectedProjects: content.causes.selectedProjects ?? defaultCausesConfig.selectedProjects,
    title: content.causes.title || defaultCausesConfig.title,
    subtitle: content.causes.subtitle || defaultCausesConfig.subtitle
  } : defaultCausesConfig;


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
    // Mettre à jour l'URL avec le paramètre section
    const params = new URLSearchParams(searchParams.toString());
    params.set('section', sectionId);
    router.push(`/cms?${params.toString()}`);
  };

  const handleBackToDashboard = () => {
    // Supprimer le paramètre section de l'URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete('section');
    router.push(`/cms?${params.toString()}`);
  };

  const handleSaveContent = async (section: keyof ContentData, data: any) => {
    
    try {
      const result = await updateContent(section, data);
      if (result.success) {
        setNotification({ message: 'Contenu sauvegardé avec succès !', type: 'success' });
        return { success: true };
      } else {
        setNotification({ message: 'Erreur lors de la sauvegarde', type: 'error' });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setNotification({ message: 'Erreur lors de la sauvegarde', type: 'error' });
      return { success: false, error: 'Erreur lors de la sauvegarde' };
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
                {selectedSection ? `${t("admin.navigation.edit")} - ${t(`admin.sections.${selectedSection}.title`)}` : t("admin.title")}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-ink-muted">{t("language.label")}:</span>
                <select
                  value={locale}
                  onChange={(e) => {
                    const newLocale = e.target.value as 'fr' | 'en';
                    setLocale(newLocale);
                    // Préserver la section sélectionnée lors du changement de langue
                    const params = new URLSearchParams(searchParams.toString());
                    if (selectedSection) {
                      params.set('section', selectedSection);
                    }
                    router.push(`/cms?${params.toString()}`);
                  }}
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
                    <h2 className="text-3xl font-bold text-night mb-2">{t("admin.title")}</h2>
                    <p className="text-ink-muted">{t("admin.subtitle")}</p>
                  </div>
                  
                  {/* Sélecteur de langue */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setLocale('fr');
                        // Préserver la section sélectionnée lors du changement de langue
                        const params = new URLSearchParams(searchParams.toString());
                        if (selectedSection) {
                          params.set('section', selectedSection);
                        }
                        router.push(`/cms?${params.toString()}`);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        locale === 'fr'
                          ? 'bg-magenta text-white'
                          : 'bg-ivory text-ink-muted hover:bg-cloud'
                      }`}
                    >
                      🇫🇷 FR
                    </button>
                    <button
                      onClick={() => {
                        setLocale('en');
                        // Préserver la section sélectionnée lors du changement de langue
                        const params = new URLSearchParams(searchParams.toString());
                        if (selectedSection) {
                          params.set('section', selectedSection);
                        }
                        router.push(`/cms?${params.toString()}`);
                      }}
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
{t("admin.navigation.back")}
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-cloud p-6">
                <h3 className="text-xl font-semibold text-night mb-4">
                  {t("admin.navigation.edit")} : {t(`admin.sections.${selectedSection}.title`)}
                </h3>
                <p className="text-ink-muted mb-6">
                  {t(`admin.sections.${selectedSection}.description`)}
                </p>
                
                {/* Formulaire d'édition spécialisé */}
        {selectedSection === 'footer' ? (
          <FooterEditor
            footer={content?.footer || { company: '', legalLinks: [], socialLinks: [], quickLinks: [] }}
            onUpdate={(data) => handleSaveContent('footer', data)}
            locale={locale}
          />
        ) : selectedSection === 'whatsapp' ? (
          <WhatsAppEditor
            whatsapp={content?.whatsapp || { number: '', message: '' }}
            onUpdate={(data) => handleSaveContent('whatsapp', data)}
            locale={locale}
          />
        ) : selectedSection === 'legal' ? (
          <LegalEditor
            legal={content?.legal || {
              title: locale === 'fr' ? 'Mentions légales' : 'Legal Notice',
              subtitle: locale === 'fr' ? 'Informations légales sur l\'éditeur du site' : 'Legal information about the site publisher',
              sections: [
                {
                  title: locale === 'fr' ? 'Éditeur du site' : 'Site publisher',
                  content: locale === 'fr' ? 'Informations sur l\'entreprise éditrice du site.' : 'Information about the company publishing the site.',
                  company: {
                    name: 'Cocoti SAS',
                    address: '123 Avenue de la République, 75011 Paris, France',
                    phone: '+33 1 23 45 67 89',
                    email: 'contact@cocoti.app'
                  }
                },
                {
                  title: locale === 'fr' ? 'Directeur de publication' : 'Publication director',
                  content: locale === 'fr' ? 'Le directeur de la publication est le Président de Cocoti SAS.' : 'The publication director is the President of Cocoti SAS.'
                },
                {
                  title: locale === 'fr' ? 'Hébergement' : 'Hosting',
                  content: locale === 'fr' ? 'Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.' : 'The site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.'
                },
                {
                  title: locale === 'fr' ? 'Propriété intellectuelle' : 'Intellectual property',
                  content: locale === 'fr' ? 'L\'ensemble de ce site relève de la législation française et internationale sur le droit d\'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.' : 'This entire site is subject to French and international legislation on copyright and intellectual property. All reproduction rights are reserved.'
                },
                {
                  title: locale === 'fr' ? 'Responsabilité' : 'Liability',
                  content: locale === 'fr' ? 'Les informations contenues sur ce site sont aussi précises que possible et le site remis à jour à différentes périodes de l\'année, mais peut toutefois contenir des inexactitudes ou des omissions.' : 'The information contained on this site is as accurate as possible and the site is updated at different times of the year, but may nevertheless contain inaccuracies or omissions.'
                },
                {
                  title: locale === 'fr' ? 'Liens hypertextes' : 'Hyperlinks',
                  content: locale === 'fr' ? 'Des liens hypertextes peuvent être présents sur le site. L\'utilisateur est informé qu\'en cliquant sur ces liens, il sortira du site cocoti.app.' : 'Hyperlinks may be present on the site. The user is informed that by clicking on these links, they will leave the cocoti.app site.'
                }
              ]
            }}
            onUpdate={(data) => handleSaveContent('legal', data)}
            locale={locale}
          />
        ) : selectedSection === 'causes' ? (
          <CausesCarouselEditor
            config={causesCarouselConfig}
            onUpdate={async (config) => {
              try {
                console.log('Saving causes carousel config:', config);
                
                // Utiliser handleSaveContent comme les autres sections
                const result = await handleSaveContent('causes', config);
                
                return result;
              } catch (error) {
                console.error('Error saving carousel config:', error);
                return { success: false, error: 'Erreur lors de la sauvegarde' };
              }
            }}
            locale={locale}
          />
        ) : selectedSection === 'pricing' ? (
          <PricingEditor
            pricing={content?.pricing || { title: '', plans: [] }}
            onUpdate={(data) => handleSaveContent('pricing', data)}
            locale={locale}
          />
        ) : (
          /* Formulaire d'édition générique */
          <GenericSectionForm
            section={selectedSection}
            sectionTitle={adminSections.find(s => s.id === selectedSection)?.title || ''}
            sectionDescription={adminSections.find(s => s.id === selectedSection)?.description || ''}
            onSave={(data) => handleSaveContent(selectedSection! as keyof ContentData, data)}
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
