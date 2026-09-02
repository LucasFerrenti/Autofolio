import React from 'react';
import { 
  Github, 
  Linkedin, 
  Code2
} from 'lucide-react';
import { LinkedInProfile } from '../types';

interface NavbarProps {
  profile: LinkedInProfile;
  projectCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  projectCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Name */}
        <a 
          href="#top" 
          id="nav-brand-link"
          className="flex items-center gap-3 group text-neutral-100 hover:text-white transition-colors"
        >
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <a href="#about" className="hover:text-neutral-100 transition-colors">
            Sobre Mí
          </a>
          <a href="#projects" className="hover:text-neutral-100 transition-colors flex items-center gap-1.5">
            Proyectos
            <span className="text-xs bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded-full font-mono">
              {projectCount}
            </span>
          </a>
          <a href="#contact" className="hover:text-neutral-100 transition-colors">
            Contacto
          </a>
        </nav>

        {/* Social direct links */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <a
              href={`https://github.com/${profile.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900 rounded-lg transition-colors"
              title="Perfil de GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-400 hover:text-[#0a66c2] hover:bg-neutral-900 rounded-lg transition-colors"
                title="Perfil de LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
