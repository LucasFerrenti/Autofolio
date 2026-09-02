import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Layers, 
  Image as ImageIcon, 
  BookOpen, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { PortfolioProject } from '../types';

interface ProjectPreviewModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  project,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'docs' | 'gallery' | 'demo'>('docs');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Reset tab and image index when project changes
  useEffect(() => {
    if (project) {
      setActiveTab('docs');
      setSelectedImageIndex(0);
    }
  }, [project]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!project) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [project]);

  if (!project) return null;

  const hasValidDemo = Boolean(
    project.demoUrl && 
    project.demoUrl.trim() !== '' && 
    project.demoUrl !== '#' && 
    project.demoUrl !== 'https://' && 
    project.demoUrl !== 'http://'
  );

  const images = project.displayImages && project.displayImages.length > 0
    ? project.displayImages
    : [];

  const formattedDate = new Date(project.updatedAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800/90 bg-neutral-950/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                  {project.displayTitle}
                </h2>
                {project.badge && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                    {project.badge}
                  </span>
                )}
                {project.frontmatter?.status && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-medium">
                    {project.frontmatter.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 font-mono truncate">
                {project.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasValidDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Demo</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}

            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors"
              title="Abrir en GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Cerrar (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-neutral-800 bg-neutral-900/90 text-xs font-medium no-scrollbar">
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg border-b-2 font-medium transition-all cursor-pointer ${
              activeTab === 'docs'
                ? 'border-indigo-500 text-indigo-300 bg-neutral-800/60'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documentación</span>
          </button>

          {images.length > 0 && (
            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg border-b-2 font-medium transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'border-indigo-500 text-indigo-300 bg-neutral-800/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Galería de Capturas ({images.length})</span>
            </button>
          )}

          {hasValidDemo && (
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg border-b-2 font-medium transition-all cursor-pointer ${
                activeTab === 'demo'
                  ? 'border-indigo-500 text-indigo-300 bg-neutral-800/60'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Preview Interactivo</span>
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: Documentation */}
          {activeTab === 'docs' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Main Markdown Body */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Hero Banner / Cover preview */}
                  {images.length > 0 && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 relative group">
                      <img
                        src={images[0]}
                        alt={project.displayTitle}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80`;
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Sidebar Meta Box */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Key Attributes */}
                  <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-3.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Detalles del Proyecto</span>
                    </h4>

                    {project.frontmatter?.role && (
                      <div className="text-xs">
                        <span className="text-neutral-500 block">Rol:</span>
                        <span className="text-neutral-200 font-medium">{project.frontmatter.role}</span>
                      </div>
                    )}

                    {project.frontmatter?.year && (
                      <div className="text-xs">
                        <span className="text-neutral-500 block">Año:</span>
                        <span className="text-neutral-200 font-medium">{project.frontmatter.year}</span>
                      </div>
                    )}

                    <div className="text-xs">
                      <span className="text-neutral-500 block">Última Actualización:</span>
                      <span className="text-neutral-200 font-medium">{formattedDate}</span>
                    </div>

                    <div className="text-xs">
                      <span className="text-neutral-500 block">Rama:</span>
                      <span className="text-neutral-300 font-mono bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                        {project.defaultBranch}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>{project.stars} Estrellas</span>
                      </span>
                      <span className="flex items-center gap-1 text-neutral-400">
                        <GitFork className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{project.forks} Forks</span>
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Tecnologías</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.displayTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono px-2 py-0.8 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={project.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700/60 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Ver Código en GitHub</span>
                    </a>
                  </div>

                </div>
              
              </div>
              {/* Rendered Content */}
              <div className="prose prose-invert max-w-none text-neutral-200 text-sm leading-relaxed space-y-4">
                {project.portfolioContent ? (
                  <div className="markdown-content">
                    <ReactMarkdown>
                      {project.portfolioContent}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 space-y-3">
                    <p className="font-semibold text-neutral-100">
                      {project.displayDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Image Gallery Viewer */}
          {activeTab === 'gallery' && images.length > 0 && (
            <div className="space-y-4">
              
              {/* Active Image Display */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                <img
                  src={images[selectedImageIndex]}
                  alt={`Screenshot ${selectedImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80`;
                  }}
                />

                {/* Left/Right Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-neutral-950/80 text-xs text-neutral-300 border border-neutral-700 backdrop-blur-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                          : 'border-neutral-800 hover:border-neutral-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Interactive Live Demo Preview */}
          {activeTab === 'demo' && hasValidDemo && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-1">
                <span>Vista interactiva ({project.demoUrl})</span>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <span>Abrir en nueva pestaña</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <iframe
                  src={project.demoUrl}
                  title={`Live demo of ${project.displayTitle}`}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>GitHub Repository</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>

    </div>
  );
};
