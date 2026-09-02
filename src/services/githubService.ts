import { PortfolioFrontmatter, PortfolioProject } from '../types';

/**
 * Parses YAML frontmatter from raw markdown string
 */
export function parseFrontmatterAndContent(rawMarkdown: string): {
  frontmatter: PortfolioFrontmatter;
  content: string;
} {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]?([\s\S]*)$/;
  const match = rawMarkdown.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {},
      content: rawMarkdown.trim()
    };
  }

  const rawYaml = match[1];
  const content = match[2].trim();
  const frontmatter: PortfolioFrontmatter = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentArrayKey: string | null = null;
  let currentArray: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check array item continuation: e.g. "  - item" or "- item"
    if (trimmed.startsWith('- ') && currentArrayKey) {
      const itemValue = trimmed.replace(/^-\s*/, '').replace(/^['"]|['"]$/g, '').trim();
      currentArray.push(itemValue);
      continue;
    }

    // If we had an open array key, save it if items were found
    if (currentArrayKey) {
      if (currentArray.length > 0) {
        (frontmatter as Record<string, unknown>)[currentArrayKey] = currentArray;
      }
      currentArrayKey = null;
      currentArray = [];
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawVal = line.slice(colonIndex + 1).trim();

    // Check if it is an explicit quote
    const isQuoted =
      (rawVal.startsWith('"') && rawVal.endsWith('"')) ||
      (rawVal.startsWith("'") && rawVal.endsWith("'"));

    let value = isQuoted ? rawVal.slice(1, -1) : rawVal;

    if (!isQuoted && (value === '' || value === '[]')) {
      // Possible start of multiline array
      currentArrayKey = key;
      currentArray = [];
    } else if (value.startsWith('[') && value.endsWith(']')) {
      // Inline array: ["React", "TS"]
      const arrayItems = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      (frontmatter as Record<string, unknown>)[key] = arrayItems;
    } else if (!isQuoted && value.toLowerCase() === 'true') {
      (frontmatter as Record<string, unknown>)[key] = true;
    } else if (!isQuoted && value.toLowerCase() === 'false') {
      (frontmatter as Record<string, unknown>)[key] = false;
    } else if (!isQuoted && !isNaN(Number(value)) && value.trim() !== '') {
      (frontmatter as Record<string, unknown>)[key] = Number(value);
    } else {
      (frontmatter as Record<string, unknown>)[key] = value;
    }
  }

  if (currentArrayKey && currentArray.length > 0) {
    (frontmatter as Record<string, unknown>)[currentArrayKey] = currentArray;
  }

  return { frontmatter, content };
}

/**
 * Parses a pure YAML config file (no --- delimiters).
 * Used for autofolio.yaml files.
 */
export function parseYamlConfig(rawYaml: string): PortfolioFrontmatter {
  const config: PortfolioFrontmatter = {};
  const lines = rawYaml.split(/\r?\n/);
  let currentArrayKey: string | null = null;
  let currentArray: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check array item continuation: e.g. "  - item"
    if (trimmed.startsWith('- ') && currentArrayKey) {
      const itemValue = trimmed.replace(/^-\s*/, '').replace(/^['"]|['"]$/g, '').trim();
      currentArray.push(itemValue);
      continue;
    }

    // If we had an open array key, save it if items were found
    if (currentArrayKey) {
      if (currentArray.length > 0) {
        (config as Record<string, unknown>)[currentArrayKey] = currentArray;
      }
      currentArrayKey = null;
      currentArray = [];
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawVal = line.slice(colonIndex + 1).trim();

    const isQuoted =
      (rawVal.startsWith('"') && rawVal.endsWith('"')) ||
      (rawVal.startsWith("'") && rawVal.endsWith("'"));

    let value = isQuoted ? rawVal.slice(1, -1) : rawVal;

    if (!isQuoted && (value === '' || value === '[]')) {
      currentArrayKey = key;
      currentArray = [];
    } else if (value.startsWith('[') && value.endsWith(']')) {
      const arrayItems = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
      (config as Record<string, unknown>)[key] = arrayItems;
    } else if (!isQuoted && value.toLowerCase() === 'true') {
      (config as Record<string, unknown>)[key] = true;
    } else if (!isQuoted && value.toLowerCase() === 'false') {
      (config as Record<string, unknown>)[key] = false;
    } else if (!isQuoted && !isNaN(Number(value)) && value.trim() !== '') {
      (config as Record<string, unknown>)[key] = Number(value);
    } else {
      (config as Record<string, unknown>)[key] = value;
    }
  }

  if (currentArrayKey && currentArray.length > 0) {
    (config as Record<string, unknown>)[currentArrayKey] = currentArray;
  }

  return config;
}

/**
 * Resolves image URLs for GitHub repository files or absolute URLs
 */
export function resolveImageUrl(
  imagePath: string,
  owner: string,
  repo: string,
  defaultBranch = 'main'
): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Remove leading slash if any
  const cleanPath = imagePath.replace(/^\/+/, '');
  return `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${cleanPath}`;
}

/**
 * Fetches user profile data from public GitHub API
 */
export async function fetchGitHubUserProfile(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error (${res.status}): ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Failed to fetch GitHub profile:', error);
    return null;
  }
}

interface RawGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  created_at: string;
  default_branch: string;
  private: boolean;
  fork: boolean;
  owner: {
    login: string;
    avatar_url: string;
  };
}

/**
 * Checks and fetches autofolio.yaml or .portfolio.md from a repository.
 * Returns the raw content and the type of file found.
 */
async function fetchRepoAutofolioConfig(
  owner: string,
  repoName: string,
  _defaultBranch?: string
): Promise<{ raw: string; type: 'autofolio.yaml' } | null> {
  const branches = ['main', 'master'];
  const configFile = 'autofolio.yaml';

  for (const branch of branches) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${configFile}`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('404: Not Found') && text.trim().length > 0) {
          return { raw: text, type: 'autofolio.yaml' };
        }
      }
    } catch {
      // Continue to next attempt
    }
  }

  // Fallback: GitHub Contents API with base64 decode if raw fetch is blocked
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${configFile}`;
    const res = await fetch(apiUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        const decoded = decodeURIComponent(
          atob(data.content.replace(/\s/g, ''))
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        if (decoded && !decoded.includes('404: Not Found') && decoded.trim().length > 0) {
          return { raw: decoded, type: 'autofolio.yaml' };
        }
      }
    }
  } catch {
    // Continue
  }

  return null;
}

/**
 * Fetches README.md content from a repository.
 * Used as documentation content when autofolio.config is found.
 */
async function fetchRepoReadme(
  owner: string,
  repoName: string,
  _defaultBranch?: string
): Promise<string | null> {
  const branches = ['main', 'master'];
  const filenames = ['README.md', 'readme.md'];

  for (const branch of branches) {
    for (const filename of filenames) {
      try {
        const url = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${filename}`;
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          if (text && !text.includes('404: Not Found') && text.trim().length > 0) {
            return text;
          }
        }
      } catch {
        // Continue to next attempt
      }
    }
  }

  // Fallback: GitHub README API
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/readme`;
    const res = await fetch(apiUrl, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        const decoded = decodeURIComponent(
          atob(data.content.replace(/\s/g, ''))
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        if (decoded && decoded.trim().length > 0) {
          return decoded;
        }
      }
    }
  } catch {
    // Continue
  }

  return null;
}

/**
 * Main service to fetch and process public GitHub repositories with autofolio.yaml / .portfolio.md inspection
 */
export async function fetchUserRepositoriesWithPortfolio(
  username: string,
  options: { onlyConfigured?: boolean } = { onlyConfigured: true }
): Promise<{ projects: PortfolioProject[]; totalFetched: number; error?: string }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!res.ok) {
      if (res.status === 403) {
        return {
          projects: [],
          totalFetched: 0,
          error: 'Límite de peticiones de la API de GitHub alcanzado temporalmente. Puedes seguir navegando los proyectos en caché o configuración.',
        };
      }
      if (res.status === 404) {
        return {
          projects: [],
          totalFetched: 0,
          error: `El usuario de GitHub "${username}" no fue encontrado.`,
        };
      }
      return {
        projects: [],
        totalFetched: 0,
        error: `Error al conectar con GitHub (${res.status}): ${res.statusText}`,
      };
    }

    const repos: RawGitHubRepo[] = await res.json();
    if (!Array.isArray(repos)) {
      return { projects: [], totalFetched: 0 };
    }

    // Exclude forks by default or keep non-forks prioritized
    const publicRepos = repos.filter((r) => !r.private);

    // Concurrently fetch autofolio.config (or .portfolio.md fallback) for up to 30 most recent repositories
    const checkBatch = publicRepos.slice(0, 30);
    const parsedProjects: PortfolioProject[] = [];

    const results = await Promise.allSettled(
      checkBatch.map(async (repo) => {
        const configResult = await fetchRepoAutofolioConfig(
          repo.owner.login,
          repo.name,
          repo.default_branch || 'main'
        );

        const hasPortfolioMd = Boolean(configResult);
        let frontmatter: PortfolioFrontmatter = {};
        let content = '';

        if (configResult) {
          if (configResult.type === 'autofolio.yaml') {
            // Pure YAML config — parse directly, fetch README.md for content
            frontmatter = parseYamlConfig(configResult.raw);
            const readme = await fetchRepoReadme(
              repo.owner.login,
              repo.name,
              repo.default_branch || 'main'
            );
            content = readme || '';
          } else {
            // Legacy .portfolio.md — parse frontmatter + markdown content
            const parsed = parseFrontmatterAndContent(configResult.raw);
            frontmatter = parsed.frontmatter;
            content = parsed.content;
          }
        }

        // Determine tags
        const tags = frontmatter.tags && frontmatter.tags.length > 0
          ? frontmatter.tags
          : repo.topics && repo.topics.length > 0
          ? repo.topics
          : repo.language
          ? [repo.language]
          : ['Proyecto'];

        // Determine images
        let images: string[] = [];
        if (frontmatter.images && Array.isArray(frontmatter.images) && frontmatter.images.length > 0) {
          images = frontmatter.images.map((img) =>
            resolveImageUrl(img, repo.owner.login, repo.name, repo.default_branch || 'main')
          );
        } else {
          // OpenGraph social preview fallback or tech placeholder
          images = [
            `https://opengraph.githubassets.com/1/${repo.full_name}`,
          ];
        }

        // Resolve demo URL: publicUrl (autofolio.config) → demoUrl (legacy) → homepage
        const demoCandidate = typeof frontmatter.publicUrl === 'string' && frontmatter.publicUrl.trim()
          ? frontmatter.publicUrl
          : typeof frontmatter.demoUrl === 'string'
          ? frontmatter.demoUrl
          : typeof repo.homepage === 'string'
          ? repo.homepage
          : '';
        const rawDemo = demoCandidate.trim();
        const validDemoUrl = (rawDemo && rawDemo !== '#' && rawDemo !== 'https://' && rawDemo !== 'http://') ? rawDemo : undefined;

        const displayTitle = (typeof frontmatter.title === 'string' && frontmatter.title.trim())
          ? frontmatter.title.trim()
          : repo.name.replace(/[-_]/g, ' ');

        const displayDescription = (typeof frontmatter.description === 'string' && frontmatter.description.trim())
          ? frontmatter.description.trim()
          : repo.description || 'Proyecto público en GitHub.';

        const project: PortfolioProject = {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          htmlUrl: repo.html_url,
          description: repo.description || 'Sin descripción en el repositorio.',
          homepage: repo.homepage || undefined,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || 'Code',
          topics: repo.topics || [],
          updatedAt: repo.updated_at,
          createdAt: repo.created_at,
          defaultBranch: repo.default_branch || 'main',
          isPrivate: repo.private,
          hasPortfolioMd,
          portfolioMdRaw: configResult?.raw || undefined,
          portfolioContent: content || undefined,
          frontmatter: hasPortfolioMd ? frontmatter : undefined,
          displayTitle,
          displayDescription,
          displayTags: tags,
          displayImages: images,
          featured: Boolean(frontmatter.featured),
          order: typeof frontmatter.order === 'number' ? frontmatter.order : 999,
          demoUrl: validDemoUrl,
          badge: typeof frontmatter.badge === 'string' ? frontmatter.badge : undefined,
        };

        return project;
      })
    );

    for (const res of results) {
      if (res.status === 'fulfilled' && res.value) {
        if (!options.onlyConfigured || res.value.hasPortfolioMd) {
          parsedProjects.push(res.value);
        }
      }
    }

    // Sort by: featured first, then custom order, then stars/update date
    parsedProjects.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return b.stars - a.stars;
    });

    return {
      projects: parsedProjects,
      totalFetched: repos.length,
    };
  } catch (error) {
    return {
      projects: [],
      totalFetched: 0,
      error: error instanceof Error ? error.message : 'Error desconocido al conectar con GitHub',
    };
  }
}
