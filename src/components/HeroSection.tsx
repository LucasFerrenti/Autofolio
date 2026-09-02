import React from 'react';
import { 
  Github, 
  Linkedin, 
  MapPin, 
  ArrowDown, 
  Mail, 
  ExternalLink,
  Code,
  Star,
  Layers
} from 'lucide-react';
import { LinkedInProfile, PortfolioProject } from '../types';

interface HeroSectionProps {
  profile: LinkedInProfile;
  projects: PortfolioProject[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  projects,
}) => {
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalSkills = profile.skills?.length || 0;

  return (
    <section id="about" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-neutral-800/60">
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-indigo-950/20 via-neutral-950/0 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid: Left Profile Details & Right LinkedIn Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Avatar, Name, Headline, Quick Info */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="flex items-center gap-5">
              <img
                src={profile.avatarUrl || (profile.linkedinUsername ? `https://unavatar.io/linkedin/${profile.linkedinUsername}` : `https://unavatar.io/linkedin/ferrenti-lucas`)}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-neutral-800 shadow-xl transition-all duration-300 bg-neutral-900"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=200&background=0a66c2&color=fff&bold=true`;
                }}
              />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                  {profile.name}
                </h1>
                <p className="text-sm sm:text-base text-indigo-300/90 font-medium mt-1 leading-snug">
                  {profile.headline}
                </p>
                <div className="flex items-center gap-3 mt-2.5 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    {profile.location || 'Berazategui, Buenos Aires, Argentina'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white font-mono">
                  {projects.length}
                </div>
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium mt-0.5">
                  Proyectos
                </div>
              </div>
              <div className="text-center border-x border-neutral-800">
                <div className="text-lg sm:text-xl font-bold text-indigo-300 font-mono flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400 inline" />
                  {totalStars}
                </div>
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium mt-0.5">
                  GitHub Stars
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                  {totalSkills}+
                </div>
                <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-medium mt-0.5">
                  Skills Stack
                </div>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                id="hero-btn-projects"
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-white text-neutral-900 text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
              >
                <span>Ver Proyectos</span>
                <ArrowDown className="w-4 h-4 text-neutral-900" />
              </a>

              <a
                href="#contact"
                id="hero-btn-contact"
                className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-100 text-sm font-medium border border-neutral-700/80 transition-all active:scale-[0.98]"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Contactar</span>
              </a>
            </div>

          </div>

          {/* Right Column: LinkedIn Summary & Skills */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* LinkedIn Summary Card */}
            <div className="relative rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-7 shadow-lg">
              
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-100">
                      Perfil Profesional
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Trayectoria y experiencia técnica
                    </p>
                  </div>
                </div>

                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Ver en LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Bio / Summary paragraphs */}
              <div className="prose prose-invert max-w-none text-sm leading-relaxed text-neutral-300 space-y-3">
                {(profile.summary || 'Ingeniero de Software y Desarrollador Full-Stack especializado en la construcción de productos digitales escalables, arquitecturas en la nube y soluciones modernas con TypeScript, React y Node.js.')
                  .split('\n\n')
                  .map((paragraph, idx) => (
                    <p key={idx} className="text-neutral-300">
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Skills section */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="mt-6 pt-5 border-t border-neutral-800/80">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Stack & Especialidades Principales</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-md bg-neutral-800/80 text-neutral-200 border border-neutral-700/60 font-mono hover:border-neutral-500 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
