"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  HeartIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlusIcon,
  XMarkIcon,
  EyeIcon,
  Cog6ToothIcon,
  ListBulletIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { usePublicProjects, PublicProject } from "@/hooks/usePublicProjects";
import { translate } from "@/utils/translations";

interface CausesCarouselConfig {
  enabled: boolean;
  autoRotate: boolean;
  rotationSpeed: number;
  maxProjects: number;
  selectedProjects: string[];
  title: string;
  subtitle: string;
}

interface CausesCarouselEditorProps {
  config: CausesCarouselConfig;
  onUpdate: (config: CausesCarouselConfig) => Promise<{ success: boolean; error?: string }>;
  locale: 'fr' | 'en';
}

export default function CausesCarouselEditor({ config, onUpdate, locale }: CausesCarouselEditorProps) {
  const [localConfig, setLocalConfig] = useState<CausesCarouselConfig>(config);
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'projects' | 'preview'>('content');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { projects, loading } = usePublicProjects(locale);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const selectedProjectsData = projects.filter(p => localConfig.selectedProjects.includes(p.id));
  const availableProjects = projects.filter(p => !localConfig.selectedProjects.includes(p.id));

  const t = (key: string) => translate(key, locale);

  // Mettre à jour la config locale quand les props changent
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleConfigChange = (key: keyof CausesCarouselConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleAddProject = (projectId: string) => {
    if (localConfig.selectedProjects.length < localConfig.maxProjects) {
      handleConfigChange('selectedProjects', [...localConfig.selectedProjects, projectId]);
    }
  };

  const handleRemoveProject = (projectId: string) => {
    handleConfigChange('selectedProjects', localConfig.selectedProjects.filter(id => id !== projectId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await onUpdate(localConfig);
      if (!result.success) {
        setError(result.error || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const previewProjects = selectedProjectsData.slice(0, localConfig.maxProjects);

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-cloud">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'content', label: locale === 'fr' ? 'Contenu' : 'Content', icon: DocumentTextIcon },
            { id: 'settings', label: locale === 'fr' ? 'Paramètres' : 'Settings', icon: Cog6ToothIcon },
            { id: 'projects', label: locale === 'fr' ? 'Projets' : 'Projects', icon: ListBulletIcon },
            { id: 'preview', label: locale === 'fr' ? 'Aperçu' : 'Preview', icon: EyeIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-magenta text-magenta'
                  : 'border-transparent text-ink-muted hover:text-night hover:border-cloud'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div className="bg-ivory p-4 rounded-lg">
              <label className="block">
                <div className="font-medium text-night mb-2">
                  {locale === 'fr' ? 'Titre de la section' : 'Section Title'}
                </div>
                <input
                  type="text"
                  value={localConfig.title}
                  onChange={(e) => handleConfigChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                  placeholder={locale === 'fr' ? 'Ex: Projets en vedette' : 'Ex: Featured Projects'}
                />
              </label>
            </div>

            {/* Subtitle */}
            <div className="bg-ivory p-4 rounded-lg">
              <label className="block">
                <div className="font-medium text-night mb-2">
                  {locale === 'fr' ? 'Sous-titre de la section' : 'Section Subtitle'}
                </div>
                <textarea
                  value={localConfig.subtitle}
                  onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                  placeholder={locale === 'fr' ? 'Ex: Découvrez les projets qui ont besoin de votre soutien' : 'Ex: Discover projects that need your support'}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enable Carousel */}
            <div className="bg-ivory p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localConfig.enabled}
                  onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                  className="h-4 w-4 text-magenta focus:ring-magenta border-cloud rounded"
                />
                <div>
                  <div className="font-medium text-night">
                    {t('causes.settings.enabled')}
                  </div>
                  <div className="text-sm text-ink-muted">
                    {t('causes.settings.enabledDescription')}
                  </div>
                </div>
              </label>
            </div>

            {/* Auto Rotate */}
            <div className="bg-ivory p-4 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={localConfig.autoRotate}
                  onChange={(e) => handleConfigChange('autoRotate', e.target.checked)}
                  className="h-4 w-4 text-magenta focus:ring-magenta border-cloud rounded"
                />
                <div>
                  <div className="font-medium text-night">
                    {t('causes.settings.autoRotate')}
                  </div>
                  <div className="text-sm text-ink-muted">
                    {t('causes.settings.autoRotateDescription')}
                  </div>
                </div>
              </label>
            </div>

            {/* Rotation Speed */}
            <div className="bg-ivory p-4 rounded-lg">
              <label className="block">
                <div className="font-medium text-night mb-2">
                  {t('causes.settings.rotationSpeed')}
                </div>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={localConfig.rotationSpeed}
                  onChange={(e) => handleConfigChange('rotationSpeed', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                />
              </label>
            </div>

            {/* Max Projects */}
            <div className="bg-ivory p-4 rounded-lg">
              <label className="block">
                <div className="font-medium text-night mb-2">
                  {t('causes.settings.maxProjects')}
                </div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localConfig.maxProjects}
                  onChange={(e) => handleConfigChange('maxProjects', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-cloud rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
                />
                <div className="text-sm text-ink-muted mt-1">
                  {t('causes.settings.maxProjectsDescription')}
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Projects */}
            <div>
              <h4 className="font-medium text-night mb-4">
                {t('causes.projects.availableProjects')}
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-ink-muted">
                    {t('causes.projects.loadingProjects')}
                  </div>
                ) : availableProjects.length === 0 ? (
                  <div className="text-center py-8 text-ink-muted">
                    {t('causes.projects.noProjects')}
                  </div>
                ) : (
                  availableProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-cloud transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-night text-sm">
                            {project.title}
                          </div>
                          <div className="text-xs text-ink-muted">
                            {project.progress}% - {project.raised}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddProject(project.id)}
                        disabled={localConfig.selectedProjects.length >= localConfig.maxProjects}
                        className="p-1 text-magenta hover:bg-magenta/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Projects */}
            <div>
              <h4 className="font-medium text-night mb-4">
                {t('causes.projects.selectedProjects')} ({selectedProjectsData.length}/{localConfig.maxProjects})
              </h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {selectedProjectsData.length === 0 ? (
                  <div className="text-center py-8 text-ink-muted">
                    {locale === 'fr' ? 'Aucun projet sélectionné' : 'No selected projects'}
                  </div>
                ) : (
                  selectedProjectsData.map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-white border border-cloud rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-magenta text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium text-night text-sm">
                            {project.title}
                          </div>
                          <div className="text-xs text-ink-muted">
                            {project.progress}% - {project.raised}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveProject(project.id)}
                        className="p-1 text-coral hover:bg-coral/10 rounded"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-night mb-4">
              {t('causes.preview.title')}
            </h4>
            <p className="text-ink-muted text-sm mb-6">
              {t('causes.preview.subtitle')}
            </p>
          </div>

          {previewProjects.length === 0 ? (
            <div className="text-center py-12 bg-ivory rounded-lg">
              <HeartIcon className="h-12 w-12 text-ink-muted mx-auto mb-4" />
              <p className="text-ink-muted">
                {locale === 'fr' ? 'Aucun projet sélectionné pour l\'aperçu' : 'No projects selected for preview'}
              </p>
            </div>
          ) : (
            <div className="relative bg-white rounded-2xl border border-cloud overflow-hidden">
              {/* Carousel Preview */}
              <div className="overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-500 ease-in-out"
                  animate={{ x: `-${currentPreviewIndex * 100}%` }}
                >
                  {previewProjects.map((project) => (
                    <div key={project.id} className="w-full flex-shrink-0">
                      <div className="flex h-48">
                        {/* Image Section */}
                        <div className="relative w-1/3 flex-shrink-0">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 text-night px-2 py-1 rounded-full text-xs font-semibold">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-night mb-2">
                              {project.title}
                            </h3>
                            <p className="text-sm text-ink-muted mb-4 line-clamp-2">
                              {project.description}
                            </p>
                          </div>

                          {/* Progress Section */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-ink-muted">
                                {locale === 'fr' ? 'Collecté' : 'Raised'}
                              </span>
                              <span className="font-semibold text-night">
                                {project.raised} / {project.target}
                              </span>
                            </div>
                            
                            <div className="w-full bg-cloud rounded-full h-1.5">
                              <div
                                className="bg-gradient-to-r from-sunset to-magenta h-1.5 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-ink-muted">
                                {project.progress}% {locale === 'fr' ? 'atteint' : 'reached'}
                              </span>
                              <div className="flex items-center gap-1 bg-gradient-to-r from-sunset to-magenta text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                                <HeartIcon className="h-3 w-3" />
                                {locale === 'fr' ? 'Soutenir' : 'Support'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Controls */}
              {previewProjects.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPreviewIndex((prev) => (prev - 1 + previewProjects.length) % previewProjects.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2"
                  >
                    <ChevronLeftIcon className="h-4 w-4 text-night" />
                  </button>
                  <button
                    onClick={() => setCurrentPreviewIndex((prev) => (prev + 1) % previewProjects.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2"
                  >
                    <ChevronRightIcon className="h-4 w-4 text-night" />
                  </button>

                  {/* Dots */}
                  <div className="flex justify-center mt-4 gap-2">
                    {previewProjects.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPreviewIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentPreviewIndex
                            ? 'bg-magenta scale-110'
                            : 'bg-cloud hover:bg-magenta/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-cloud">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-sunset to-magenta text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            locale === 'fr' ? 'Sauvegarde...' : 'Saving...'
          ) : (
            locale === 'fr' ? 'Sauvegarder' : 'Save'
          )}
        </button>
      </div>
    </div>
  );
}
