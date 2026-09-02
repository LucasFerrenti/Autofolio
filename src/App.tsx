import React, { useState, useEffect, useCallback } from 'react';
import { LinkedInProfile, PortfolioProject } from './types';
import { fetchUserRepositoriesWithPortfolio } from './services/githubService';
import { configOverride } from './config/portfolioConfig';
import profileData from './data/profile.json';
import repositoriesData from './data/repositories.json';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectPreviewModal } from './components/ProjectPreviewModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

/**
 * Merges profile.json base data with manual overrides from portfolioConfigOverride.
 * Override values take priority when defined and non-empty.
 */
function buildProfile(): LinkedInProfile {
  const base: LinkedInProfile = profileData as LinkedInProfile;
  const overrides = configOverride.profile || {};

  return {
    ...base,
    ...(Object.fromEntries(
      Object.entries(overrides).filter(
        ([, value]) => value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)
      )
    )),
  } as LinkedInProfile;
}

export default function App() {
  // Profile loaded from profile.json merged with overrides
  const [profile] = useState<LinkedInProfile>(buildProfile);

  // Repositories loaded statically from repositories.json
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    return (Array.isArray(repositoriesData) ? repositoriesData : []) as PortfolioProject[];
  });
  const [isLoadingGitHub, setIsLoadingGitHub] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Search and Tag filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Interactive Project Preview Modal
  const [selectedProjectForPreview, setSelectedProjectForPreview] = useState<PortfolioProject | null>(null);

  // Function to sync public repos from GitHub
  const syncWithGitHub = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setIsLoadingGitHub(true);

    try {
      const result = await fetchUserRepositoriesWithPortfolio(username, { onlyConfigured: true });

      if (result.error && result.projects.length === 0) {
        setToastMessage({
          text: result.error,
          type: 'error',
        });
      } else if (result.projects.length === 0) {
        setProjects([]);
        setToastMessage({
          text: `No se encontraron proyectos públicos para @${username}.`,
          type: 'info',
        });
      } else {
        setProjects(result.projects);
        setToastMessage({
          text: `¡Sincronizado! Se cargaron ${result.projects.length} proyectos de GitHub.`,
          type: 'success',
        });
      }
    } catch {
      setToastMessage({
        text: 'Error de conexión al consultar GitHub.',
        type: 'error',
      });
    } finally {
      setIsLoadingGitHub(false);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  }, []);

  // Initial GitHub sync only if projects.json is empty on startup
  useEffect(() => {
    if (projects.length === 0 && profile.githubUsername) {
      syncWithGitHub(profile.githubUsername);
    }
  }, [syncWithGitHub, profile.githubUsername, projects.length]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-slideUp">
          <div className={`p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 text-xs ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : toastMessage.type === 'error'
              ? 'bg-red-950/90 border-red-500/50 text-red-200'
              : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
          } backdrop-blur-md`}>
            <div className="flex items-center gap-2.5">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        profile={profile}
        projectCount={projects.length}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          profile={profile}
          projects={projects}
        />

        {/* Public Projects Grid */}
        <ProjectGrid
          projects={projects}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          onRefreshGitHub={() => syncWithGitHub(profile.githubUsername)}
          isLoading={isLoadingGitHub}
          onSelectProject={(project) => setSelectedProjectForPreview(project)}
        />

        {/* Contact Section */}
        <ContactSection profile={profile} />
      </main>

      {/* Footer */}
      <Footer
        profile={profile}
      />

      {/* Project Preview Modal */}
      <ProjectPreviewModal
        project={selectedProjectForPreview}
        onClose={() => setSelectedProjectForPreview(null)}
      />

    </div>
  );
}
