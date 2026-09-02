import React from 'react';
import { ArrowUp } from 'lucide-react';
import { LinkedInProfile } from '../types';

interface FooterProps {
  profile: LinkedInProfile;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800/80 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="font-bold text-neutral-200 text-sm">
            {profile.name}
          </div>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <p className="text-neutral-400">
            Portafolio Profesional de Ingeniería & Desarrollo de Software
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-200 transition-colors"
          >
            GitHub
          </a>

          {profile.linkedinUrl && (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0a66c2] transition-colors"
            >
              LinkedIn
            </a>
          )}

          <button
            onClick={scrollToTop}
            id="btn-back-to-top"
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
            title="Volver arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
