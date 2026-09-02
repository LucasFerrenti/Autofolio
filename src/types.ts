export interface PortfolioFrontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
  demoUrl?: string;
  publicUrl?: string;
  galleryFolder?: string;
  images?: string[];
  badge?: string;
  priority?: 'high' | 'medium' | 'low';
  role?: string;
  year?: string;
  client?: string;
  status?: 'Completado' | 'En Desarrollo' | 'Mantenimiento' | 'Archivado';
}

export interface PortfolioProject {
  id: string | number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string;
  homepage?: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: string;
  createdAt: string;
  defaultBranch: string;
  isPrivate: boolean;
  
  // Loaded from autofolio.yaml or .portfolio.md (if present)
  hasPortfolioMd: boolean;
  portfolioMdRaw?: string;
  portfolioContent?: string;
  frontmatter?: PortfolioFrontmatter;
  
  // Computed display fields
  displayTitle: string;
  displayDescription: string;
  displayTags: string[];
  displayImages: string[];
  featured: boolean;
  order: number;
  demoUrl?: string;
  badge?: string;
}

export interface LinkedInProfile {
  name: string;
  headline: string;
  summary: string;
  avatarUrl?: string;
  location: string;
  email: string;
  githubUsername: string;
  linkedinUsername: string;
  linkedinUrl?: string;
  openToWork: boolean;
  skills: string[];
}

export interface PortfolioConfigOverride {
  profile?: {
    [K in keyof LinkedInProfile]?: LinkedInProfile[K] | null;
  };
  settings?: {
    showLinkedInBadge?: boolean;
    enableInteractivePreviews?: boolean;
    defaultBranchFallback?: string;
  };
}

declare global {
  const __BUILD_TIMESTAMP__: string;
  const __BUILD_TIME__: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
