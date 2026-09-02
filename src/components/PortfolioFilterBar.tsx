import React from 'react';
import { 
  Search, 
  RotateCw, 
  Check, 
  FolderGit2
} from 'lucide-react';

interface PortfolioFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  availableTags: string[];
  onRefreshGitHub: () => void;
  isLoading: boolean;
  totalFiltered: number;
}

export const PortfolioFilterBar: React.FC<PortfolioFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
  availableTags,
  onRefreshGitHub,
  isLoading,
  totalFiltered,
}) => {
  return (
    <div className="space-y-4">
      {/* Top row: Search, Count, Refresh button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            id="projects-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, tecnología, descripción..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white bg-neutral-800 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Action Indicators & Refresh */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Projects counter */}
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border bg-neutral-900 text-neutral-300 border-neutral-800 shadow-sm">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Proyectos</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-indigo-500/20 text-indigo-200">
              {totalFiltered}
            </span>
          </div>

          {/* Sincronizar GitHub */}
          <button
            onClick={onRefreshGitHub}
            disabled={isLoading}
            id="btn-refresh-github"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-all disabled:opacity-50 cursor-pointer"
            title="Sincronizar proyectos en vivo desde GitHub"
          >
            <RotateCw className={`w-3.5 h-3.5 text-neutral-400 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span>{isLoading ? 'Cargando...' : 'Actualizar'}</span>
          </button>

        </div>

      </div>

      {/* Tags Carousel / Pills */}
      {availableTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => onSelectTag('All')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedTag === 'All'
                ? 'bg-neutral-100 text-neutral-950 font-semibold'
                : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
            }`}
          >
            Todos ({totalFiltered})
          </button>

          {availableTags.map((tag) => {
            const isSelected = selectedTag.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => onSelectTag(isSelected ? 'All' : tag)}
                className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-medium shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
