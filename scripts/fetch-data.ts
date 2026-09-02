/**
 * fetch-data.ts
 *
 * Unified CLI script to fetch:
 * 1. LinkedIn Profile Data -> src/data/profile.json
 * 2. GitHub Repositories & Portfolio Projects -> src/data/repositories.json
 *
 * Usage:
 *   npm run fetch-data
 *   npx tsx scripts/fetch-data.ts
 *
 * Overrides:
 *   npx tsx scripts/fetch-data.ts --linkedin=ferrenti-lucas --github=LucasFerrenti
 */

import 'dotenv/config';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { githubUsername, linkedinUsername, configOverride } from '../src/config/portfolioConfig';
import {
  parseYamlConfig,
  parseFrontmatterAndContent,
  resolveImageUrl,
} from '../src/services/githubService';
import { PortfolioFrontmatter, PortfolioProject } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ProfileData {
  name: string;
  headline: string;
  summary: string;
  location: string;
  avatarUrl: string;
  email: string;
  githubUsername: string;
  linkedinUsername: string;
  linkedinUrl: string;
  openToWork: boolean;
  skills: string[];
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

function parseArgs(): {
  linkedin: string;
  github: string;
  apifyToken: string;
  githubToken: string;
} {
  const args = process.argv.slice(2);
  let linkedin = linkedinUsername || configOverride.profile?.linkedinUsername || process.env.LINKEDIN_USERNAME || '';
  let github = githubUsername || configOverride.profile?.githubUsername || process.env.GITHUB_USERNAME || '';
  let apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN || '';
  let githubToken = process.env.GITHUB_TOKEN || '';

  for (const arg of args) {
    if (arg.startsWith('--linkedin=')) {
      linkedin = arg.split('=')[1];
    } else if (arg.startsWith('--github=')) {
      github = arg.split('=')[1];
    } else if (arg.startsWith('--apify-token=')) {
      apifyToken = arg.split('=')[1];
    } else if (arg.startsWith('--github-token=')) {
      githubToken = arg.split('=')[1];
    }
  }

  return { linkedin, github, apifyToken, githubToken };
}

/* ==========================================================================
   LINKEDIN SCRAPER (APIFY / DIRECT FALLBACK)
   ========================================================================== */

async function scrapeLinkedInWithApify(username: string, token: string): Promise<{
  name: string;
  headline: string;
  summary: string;
  location: string;
  avatarUrl: string;
  email?: string;
  openToWork?: boolean;
  skills: string[];
} | null> {
  try {
    console.log(`   🌐 Conectando a Apify Cloud Actor (harvestapi/linkedin-profile-scraper)...`);
    const { ApifyClient } = await import('apify-client');
    const client = new ApifyClient({ token });

    const profileUrl = `https://www.linkedin.com/in/${username}`;
    const run = await client.actor('harvestapi/linkedin-profile-scraper').call({
      queries: [profileUrl],
    });

    if (!run?.defaultDatasetId) {
      console.warn('   ⚠️ No se obtuvo dataset de la ejecución de Apify.');
      return null;
    }

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (!items || items.length === 0) {
      console.warn('   ⚠️ Apify no devolvió registros para este perfil.');
      return null;
    }

    const raw = items[0] as Record<string, any>;

    let name = raw.fullName || '';
    if (!name && (raw.firstName || raw.lastName)) {
      name = `${raw.firstName || ''} ${raw.lastName || ''}`.trim();
    }

    const headline = raw.headline || raw.position || '';
    const summary = raw.about || raw.summary || raw.description || '';

    let location = '';
    if (raw.location) {
      if (typeof raw.location === 'object') {
        location = raw.location.parsed?.text || raw.location.linkedinText || raw.location.country || '';
      } else {
        location = String(raw.location);
      }
    }

    let avatarUrl = '';
    if (raw.profilePicture) {
      if (typeof raw.profilePicture === 'object') {
        avatarUrl = raw.profilePicture.url || raw.profilePicture.sizes?.[0]?.url || '';
      } else {
        avatarUrl = String(raw.profilePicture);
      }
    }
    if (!avatarUrl && raw.photo) {
      avatarUrl = typeof raw.photo === 'string' ? raw.photo : raw.photo.url || '';
    }

    let skills: string[] = [];
    if (Array.isArray(raw.skills)) {
      skills = raw.skills
        .map((s: any) => (typeof s === 'string' ? s : s.name || ''))
        .filter((s: string) => Boolean(s.trim()));
    }

    let email = '';
    if (Array.isArray(raw.emails) && raw.emails.length > 0) {
      email = raw.emails[0];
    }

    console.log(`   ✅ Perfil obtenido con éxito desde Apify!`);

    return {
      name,
      headline,
      summary,
      location,
      avatarUrl,
      email,
      openToWork: raw.openToWork,
      skills,
    };
  } catch (error) {
    console.warn('   ⚠️ Error al consultar Apify:', error instanceof Error ? error.message : error);
    return null;
  }
}

/* ==========================================================================
   GITHUB REPOSITORIES FETCHER
   ========================================================================== */

async function fetchRepoAutofolioConfig(
  owner: string,
  repoName: string,
  _defaultBranch?: string,
  githubToken?: string
): Promise<{ raw: string; type: 'autofolio.yaml' } | null> {
  const branches = ['main', 'master'];
  const configFile = 'autofolio.yaml';

  for (const branch of branches) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${configFile}`;
      const headers: Record<string, string> = {};
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }
      const res = await fetch(url, { headers });
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('404: Not Found') && text.trim().length > 0) {
          return { raw: text, type: 'autofolio.yaml' };
        }
      }
    } catch {
      // continue
    }
  }

  // Fallback: GitHub Contents API
  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${configFile}`;
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    const res = await fetch(apiUrl, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
        if (decoded && !decoded.includes('404: Not Found') && decoded.trim().length > 0) {
          return { raw: decoded, type: 'autofolio.yaml' };
        }
      }
    }
  } catch {
    // continue
  }

  return null;
}

async function fetchRepoReadme(
  owner: string,
  repoName: string,
  _defaultBranch?: string,
  githubToken?: string
): Promise<string | null> {
  const branches = ['main', 'master'];
  const filenames = ['README.md', 'readme.md'];

  for (const branch of branches) {
    for (const filename of filenames) {
      try {
        const url = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${filename}`;
        const headers: Record<string, string> = {};
        if (githubToken) {
          headers['Authorization'] = `token ${githubToken}`;
        }
        const res = await fetch(url, { headers });
        if (res.ok) {
          const text = await res.text();
          if (text && !text.includes('404: Not Found') && text.trim().length > 0) {
            return text;
          }
        }
      } catch {
        // continue
      }
    }
  }

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/readme`;
    const headers: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    const res = await fetch(apiUrl, { headers });
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
        if (decoded && decoded.trim().length > 0) {
          return decoded;
        }
      }
    }
  } catch {
    // continue
  }

  return null;
}

async function fetchUserProjects(
  username: string,
  githubToken?: string
): Promise<PortfolioProject[]> {
  console.log(`\n🐙 Consultando repositorios públicos de GitHub para @${username}...`);

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!res.ok) {
      console.warn(`   ⚠️ GitHub retornó código ${res.status}: ${res.statusText}`);
      if (res.status === 403) {
        console.log(`   💡 Consejo: Puedes configurar GITHUB_TOKEN en .env para 5,000 peticiones/hora.`);
      }
    }

    const repos: RawGitHubRepo[] = res.ok ? await res.json() : [];
    const publicRepos = Array.isArray(repos) ? repos.filter((r) => !r.private) : [];
    if (publicRepos.length > 0) {
      console.log(`   Se encontraron ${publicRepos.length} repositorios públicos. Inspeccionando configs autofolio.yaml...`);
    }

    const checkBatch = publicRepos.slice(0, 50);
    const parsedProjects: PortfolioProject[] = [];

    if (checkBatch.length > 0) {
      const results = await Promise.allSettled(
        checkBatch.map(async (repo) => {
          const configResult = await fetchRepoAutofolioConfig(
            repo.owner.login,
            repo.name,
            repo.default_branch || 'main',
            githubToken
          );

          const hasPortfolioMd = Boolean(configResult);
          let frontmatter: PortfolioFrontmatter = {};
          let content = '';

          if (configResult) {
            if (configResult.type === 'autofolio.yaml') {
              frontmatter = parseYamlConfig(configResult.raw);
              const readme = await fetchRepoReadme(
                repo.owner.login,
                repo.name,
                repo.default_branch || 'main',
                githubToken
              );
              content = readme || '';
            } else {
              const parsed = parseFrontmatterAndContent(configResult.raw);
              frontmatter = parsed.frontmatter;
              content = parsed.content;
            }
          }

          const tags = frontmatter.tags && frontmatter.tags.length > 0
            ? frontmatter.tags
            : repo.topics && repo.topics.length > 0
            ? repo.topics
            : repo.language
            ? [repo.language]
            : ['Proyecto'];

          let images: string[] = [];
          if (frontmatter.images && Array.isArray(frontmatter.images) && frontmatter.images.length > 0) {
            images = frontmatter.images.map((img) =>
              resolveImageUrl(img, repo.owner.login, repo.name, repo.default_branch || 'main')
            );
          } else {
            images = [`https://opengraph.githubassets.com/1/${repo.full_name}`];
          }

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
          if (res.value.hasPortfolioMd) {
            parsedProjects.push(res.value);
          }
        }
      }
    }

    // Si falló por rate limit o no hubo repos pero existe autofolio.yaml local, incluir el proyecto actual
    const localYamlPath = resolve(__dirname, '..', 'autofolio.yaml');
    if (parsedProjects.length === 0 && existsSync(localYamlPath)) {
      console.log(`   📄 Cargando configuración de proyecto local desde autofolio.yaml...`);
      const localYaml = readFileSync(localYamlPath, 'utf-8');
      const frontmatter = parseYamlConfig(localYaml);
      const localReadmePath = resolve(__dirname, '..', 'README.md');
      const readme = existsSync(localReadmePath) ? readFileSync(localReadmePath, 'utf-8') : '';

      const localProject: PortfolioProject = {
        id: 1,
        name: 'Autofolio',
        fullName: `${username}/Autofolio`,
        htmlUrl: `https://github.com/${username}/Autofolio`,
        description: frontmatter.description || 'Portafolio interactivo para desarrolladores.',
        stars: 1,
        forks: 0,
        language: 'TypeScript',
        topics: frontmatter.tags || ['React', 'TypeScript'],
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        defaultBranch: 'main',
        isPrivate: false,
        hasPortfolioMd: true,
        portfolioContent: readme,
        frontmatter,
        displayTitle: frontmatter.title || 'Autofolio',
        displayDescription: frontmatter.description || 'Portafolio dinámico sincronizado con GitHub y LinkedIn.',
        displayTags: frontmatter.tags || ['React 19', 'TypeScript', 'Tailwind CSS'],
        displayImages: (frontmatter.images && frontmatter.images.length > 0)
          ? frontmatter.images.map((img) => resolveImageUrl(img, username, 'Autofolio', 'main'))
          : [`https://opengraph.githubassets.com/1/${username}/Autofolio`],
        featured: true,
        order: 1,
        demoUrl: frontmatter.publicUrl || undefined,
        badge: frontmatter.badge || '⭐ Proyecto Destacado',
      };
      parsedProjects.push(localProject);
    }

    parsedProjects.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return b.stars - a.stars;
    });

    console.log(`   ✅ Se procesaron y validaron ${parsedProjects.length} proyectos con configuración de portfolio.`);
    return parsedProjects;
  } catch (error) {
    console.warn('   ⚠️ Error al consultar repositorios de GitHub:', error instanceof Error ? error.message : error);
    return [];
  }
}

/* ==========================================================================
   MAIN EXECUTION
   ========================================================================== */

async function main() {
  const { linkedin, github, apifyToken, githubToken } = parseArgs();

  console.log(`\n======================================================`);
  console.log(`🚀 Autofolio Data Generator (Profile & Repositories)`);
  console.log(`======================================================`);
  console.log(`   LinkedIn: ${linkedin || '(no configurado)'}`);
  console.log(`   GitHub:   ${github || '(no configurado)'}\n`);

  const outputDir = resolve(__dirname, '..', 'src', 'data');
  mkdirSync(outputDir, { recursive: true });

  // 1. OBTENER Y GUARDAR DATOS DE LINKEDIN -> src/data/profile.json
  if (linkedin) {
    console.log(`🔍 [1/2] Obteniendo datos del perfil de LinkedIn desde Apify...`);
    let profileData: {
      name: string;
      headline: string;
      summary: string;
      location: string;
      avatarUrl?: string;
      email?: string;
      openToWork?: boolean;
      skills?: string[];
    } | null = null;

    if (apifyToken) {
      profileData = await scrapeLinkedInWithApify(linkedin, apifyToken);
    } else {
      console.warn('   ⚠️ No se encontró APIFY_API_TOKEN en el entorno ni en argumentos.');
    }

    const configProfile = configOverride.profile || {};

    const profile: ProfileData = {
      name: profileData?.name || configProfile.name || '',
      headline: profileData?.headline || configProfile.headline || '',
      summary: profileData?.summary || configProfile.summary || '',
      location: profileData?.location || configProfile.location || '',
      avatarUrl: profileData?.avatarUrl || `https://unavatar.io/linkedin/${linkedin}`,
      email: profileData?.email || configProfile.email || '',
      githubUsername: github,
      linkedinUsername: linkedin,
      linkedinUrl: `https://www.linkedin.com/in/${linkedin}`,
      openToWork: profileData?.openToWork ?? configProfile.openToWork ?? false,
      skills: (profileData?.skills && profileData.skills.length > 0)
        ? profileData.skills
        : configProfile.skills || [],
    };

    const profilePath = resolve(outputDir, 'profile.json');
    writeFileSync(profilePath, JSON.stringify(profile, null, 2) + '\n', 'utf-8');
    console.log(`✅ Perfil guardado en: ${profilePath}`);
  }

  // 2. OBTENER Y GUARDAR DATOS DE REPOSITORIOS GITHUB -> src/data/repositories.json
  if (github) {
    console.log(`\n📦 [2/2] Obteniendo proyectos de GitHub...`);
    const projects = await fetchUserProjects(github, githubToken);

    const reposPath = resolve(outputDir, 'repositories.json');
    writeFileSync(reposPath, JSON.stringify(projects, null, 2) + '\n', 'utf-8');
    console.log(`✅ Repositorios guardados en: ${reposPath} (${projects.length} proyectos)`);
  }

  console.log(`\n🎉 Proceso finalizado con éxito.\n`);
}

main();
