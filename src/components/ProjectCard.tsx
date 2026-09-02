import React from 'react';
import { 
  Github, 
  ExternalLink, 
  Star, 
  GitFork, 
  Eye
} from 'lucide-react';
import { PortfolioProject } from '../types';

interface ProjectCardProps {
  project: PortfolioProject;
  onSelectProject: (project: PortfolioProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
}) => {
  const coverImage = project.displayImages && project.displayImages.length > 0 
    ? project.displayImages[0] 
    : `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80`;

  const hasValidDemo = Boolean(
    project.demoUrl && 
    project.demoUrl.trim() !== '' && 
    project.demoUrl !== '#' && 
    project.demoUrl !== 'https://' && 
    project.demoUrl !== 'http://'
  );

  return (
    <div 
      id={`project-card-${project.id}`}
      className="group flex flex-col rounded-2xl bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700/80 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      {/* Card Image Banner */}
      <div 
        onClick={() => onSelectProject(project)}
        className="relative aspect-video w-full overflow-hidden bg-neutral-950 cursor-pointer"
      >
        <img
          src={coverImage}
          alt={project.displayTitle}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80`;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {project.badge ? (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-neutral-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-sm">
              {project.badge}
            </span>
          ) : project.featured ? (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-indigo-950/90 text-indigo-300 border border-indigo-500/40 backdrop-blur-md shadow-sm">
              ⭐ Destacado
            </span>
          ) : <span />}
        </div>

        {/* Hover quick preview button overlay */}
        <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900/90 text-white text-xs font-semibold border border-neutral-700 shadow-xl backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Ver Proyecto & Detalles</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          
          {/* Title & Language */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 
              onClick={() => onSelectProject(project)}
              className="text-base font-bold text-neutral-100 group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1"
            >
              {project.displayTitle}
            </h3>
            {project.language && (
              <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded shrink-0">
                {project.language}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {project.displayDescription}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.displayTags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300 border border-neutral-750"
              >
                {tag}
              </span>
            ))}
            {project.displayTags.length > 4 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                +{project.displayTags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 text-xs">
          
          {/* Stats: Stars & Forks */}
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="flex items-center gap-1 hover:text-indigo-300 transition-colors" title={`${project.stars} estrellas en GitHub`}>
              <Star className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{project.stars}</span>
            </span>
            <span className="flex items-center gap-1" title={`${project.forks} forks en GitHub`}>
              <GitFork className="w-3.5 h-3.5 text-neutral-500" />
              <span>{project.forks}</span>
            </span>
          </div>

          {/* Action links */}
          <div className="flex items-center gap-1.5">
            {hasValidDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600/20 rounded-md transition-colors"
                title="Abrir Demo en Vivo"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
              title="Ver Repositorio en GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
