import React from 'react';
import { 
  FolderGit2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PortfolioProject } from '../types';
import { ProjectCard } from './ProjectCard';
import { PortfolioFilterBar } from './PortfolioFilterBar';

interface ProjectGridProps {
  projects: PortfolioProject[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  onRefreshGitHub: () => void;
  isLoading: boolean;
  onSelectProject: (p: PortfolioProject) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  onRefreshGitHub,
  isLoading,
  onSelectProject,
}) => {
  // Extract all unique tags
  const tagsSet = new Set<string>();
  projects.forEach((p) => {
    p.displayTags.forEach((t) => tagsSet.add(t));
  });
  const availableTags = Array.from(tagsSet).sort();

  // Filter projects by search and selectedTag
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      project.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.displayDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.displayTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === 'All' ||
      project.displayTags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <section id="projects" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-indigo-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portafolio de Proyectos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Proyectos & Desarrollos
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Explora mis proyectos más recientes, aplicaciones web y desarrollos de software de código abierto.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mb-10">
        <PortfolioFilterBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedTag={selectedTag}
          onSelectTag={onSelectTag}
          availableTags={availableTags}
          onRefreshGitHub={onRefreshGitHub}
          isLoading={isLoading}
          totalFiltered={filteredProjects.length}
        />
      </div>

      {/* Loading Skeleton / Placeholders */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-5 space-y-4 animate-pulse overflow-hidden relative"
            >
              {/* Shimmer effect bar */}
              <div className="aspect-video bg-neutral-800/60 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>

              {/* Title & subtitle skeleton */}
              <div className="space-y-2">
                <div className="h-5 bg-neutral-800/80 rounded-md w-3/4" />
                <div className="h-3.5 bg-neutral-800/60 rounded w-full" />
                <div className="h-3.5 bg-neutral-800/60 rounded w-4/5" />
              </div>

              {/* Tags skeleton */}
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-16 bg-neutral-800/70 rounded" />
                <div className="h-5 w-20 bg-neutral-800/70 rounded" />
                <div className="h-5 w-14 bg-neutral-800/70 rounded" />
              </div>

              {/* Footer meta skeleton */}
              <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between">
                <div className="h-4 w-20 bg-neutral-800/60 rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-5 bg-neutral-800/70 rounded" />
                  <div className="h-5 w-5 bg-neutral-800/70 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400 mb-4">
            <FolderGit2 className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-neutral-100 mb-1">
            No se encontraron proyectos
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed mb-6">
            No hay proyectos disponibles que coincidan con los filtros de búsqueda actuales.
          </p>
          
          {searchQuery || selectedTag !== 'All' ? (
            <button
              onClick={() => {
                onSearchChange('');
                onSelectTag('All');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Filtros</span>
            </button>
          ) : null}
        </div>
      )}

    </section>
  );
};
