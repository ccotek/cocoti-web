"use client";

import { useState } from "react";
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
import { useAdminAuth } from "@/hooks/useAdminAuth";

type AdminSection = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
};

const adminSections: AdminSection[] = [
  {
    id: "hero",
    title: "Section Hero",
    description: "Gérer le titre principal, sous-titre et boutons d'action",
    icon: DocumentTextIcon,
    color: "bg-blue-500"
  },
  {
    id: "solutions",
    title: "Solutions",
    description: "Modifier les solutions proposées (tontines, cagnottes, etc.)",
    icon: Cog6ToothIcon,
    color: "bg-green-500"
  },
  {
    id: "how",
    title: "Comment ça marche",
    description: "Éditer les étapes du processus",
    icon: UsersIcon,
    color: "bg-purple-500"
  },
  {
    id: "why",
    title: "Pourquoi nous choisir",
    description: "Gérer les valeurs et avantages",
    icon: QuestionMarkCircleIcon,
    color: "bg-orange-500"
  },
  {
    id: "pricing",
    title: "Tarifs",
    description: "Modifier les plans et prix",
    icon: CurrencyDollarIcon,
    color: "bg-yellow-500"
  },
  {
    id: "testimonials",
    title: "Témoignages",
    description: "Gérer les avis clients",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-pink-500"
  },
  {
    id: "faq",
    title: "FAQ",
    description: "Questions fréquentes",
    icon: QuestionMarkCircleIcon,
    color: "bg-indigo-500"
  },
  {
    id: "contact",
    title: "Contact",
    description: "Informations de contact",
    icon: EnvelopeIcon,
    color: "bg-red-500"
  }
];

export default function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  const { user, logout } = useAdminAuth();

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const handleBackToDashboard = () => {
    setSelectedSection(null);
  };

  const handleSaveContent = (data: any) => {
    console.log('Content saved:', data);
    // Optionnel : afficher une notification de succès
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
                <h2 className="text-3xl font-bold text-night mb-2">Gestion du contenu</h2>
                <p className="text-ink-muted">Modifiez le contenu de votre site Cocoti en temps réel</p>
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
                Retour au dashboard
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-cloud p-6">
                <h3 className="text-xl font-semibold text-night mb-4">
                  Éditer : {adminSections.find(s => s.id === selectedSection)?.title}
                </h3>
                <p className="text-ink-muted mb-6">
                  {adminSections.find(s => s.id === selectedSection)?.description}
                </p>
                
                {/* Formulaire d'édition générique */}
                <GenericSectionForm
                  section={selectedSection}
                  sectionTitle={adminSections.find(s => s.id === selectedSection)?.title || ''}
                  sectionDescription={adminSections.find(s => s.id === selectedSection)?.description || ''}
                  onSave={handleSaveContent}
                  onCancel={handleBackToDashboard}
                  locale={locale}
                />
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
    </div>
  );
}
