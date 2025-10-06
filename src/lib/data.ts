// File-based data loading imports
import { loadConfig, loadYamlData } from "./yaml-loader";
import {
  getAllBlogPosts as loadAllBlogPosts,
  getBlogPost as loadBlogPost,
  getFeaturedBlogPosts as loadFeaturedBlogPosts,
  getAllTalks as loadAllTalks,
  getTalk as loadTalk,
} from "./mdx-loader";

// GitHub API imports
import {
  getPinnedRepos,
  getGitHubStats as fetchGitHubStats,
  githubRepoToProject,
} from "./github";

// Types for blog posts and talks
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  readingTime: number;
}

export interface Talk {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  slidesUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  githubUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  githubImageUrl?: string;
  technologies: string[];
  featured: boolean;
  pinned: boolean;
  stars?: number;
  forks?: number;
  updatedAt?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  technologies: string[];
  logoUrl?: string;
  url?: string;
}

export interface UsesItem {
  category: "desk" | "home" | "tools";
  name: string;
  description: string;
  url?: string;
  icon?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  bioLong: string;
  avatar: string;
  location: string;
  email: string;
  github: string;
  twitter: string;
  linkedin: string;
  steam?: string;
  website: string;
}

// Data loading functions using YAML and MDX files
export async function getPersonalInfo(): Promise<PersonalInfo> {
  const config = await loadConfig();
  return config.personal;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await loadAllBlogPosts();
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  return await loadBlogPost(slug);
}

export async function getFeaturedBlogPosts(
  limit: number = 3,
): Promise<BlogPost[]> {
  return await loadFeaturedBlogPosts(limit);
}

export async function getTalks(): Promise<Talk[]> {
  return await loadAllTalks();
}

export async function getTalkById(id: string): Promise<Talk | undefined> {
  return await loadTalk(id);
}

export async function getProjects(): Promise<Project[]> {
  const projectsData = (await loadYamlData("projects")) as Project[];
  const projects = projectsData || [];

  // Enhance projects with GitHub images if no local imageUrl exists
  return await Promise.all(
    projects.map(async (project) => {
      if (!project.imageUrl && project.githubUrl) {
        try {
          // Extract repo owner and name from GitHub URL
          const githubMatch = project.githubUrl.match(
            /github\.com\/([^/]+)\/([^/]+)/,
          );
          if (githubMatch) {
            const [, owner, repo] = githubMatch;

            // Try to fetch repo data from GitHub API
            const githubToken = process.env.GITHUB_TOKEN;
            const headers: HeadersInit = {
              Accept: "application/vnd.github.v3+json",
            };

            if (githubToken) {
              headers["Authorization"] = `token ${githubToken}`;
            }

            // Use GitHub's social preview image which shows repo stats
            const githubImageUrl = `https://opengraph.githubassets.com/${owner}/${repo}`;

            return {
              ...project,
              imageUrl: githubImageUrl,
              imageAlt: `${project.name} project`,
              githubImageUrl: githubImageUrl,
            };
          }
        } catch (error) {
          console.error(
            `Error fetching GitHub image for project ${project.name}:`,
            error,
          );
        }
      }
      return project;
    }),
  );
}

export async function getPinnedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.pinned);
}

export async function getWorkExperience(): Promise<WorkExperience[]> {
  const workData = (await loadYamlData("work-experience")) as WorkExperience[];
  return workData || [];
}

export async function getUsesItems(): Promise<UsesItem[]> {
  const usesData = (await loadYamlData("uses")) as Record<string, UsesItem[]>;
  const allItems: UsesItem[] = [];

  if (usesData.desk)
    allItems.push(
      ...usesData.desk.map((item) => ({ ...item, category: "desk" as const })),
    );
  if (usesData.home)
    allItems.push(
      ...usesData.home.map((item) => ({ ...item, category: "home" as const })),
    );
  if (usesData.tools)
    allItems.push(
      ...usesData.tools.map((item) => ({
        ...item,
        category: "tools" as const,
      })),
    );

  return allItems;
}

export async function getUsesByCategory(
  category: UsesItem["category"],
): Promise<UsesItem[]> {
  const usesData = (await loadYamlData("uses")) as Record<string, UsesItem[]>;
  return usesData[category]?.map((item) => ({ ...item, category })) || [];
}

export async function getContactInfo() {
  const config = await loadConfig();
  return config.contact;
}

export async function getNavigationItems() {
  const config = await loadConfig();
  return config.navigation?.items || [];
}

export async function getSiteConfig() {
  return await loadConfig();
}

// GitHub API functions
export async function getGitHubStats() {
  try {
    return await fetchGitHubStats();
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return {
      totalRepos: 0,
      totalStars: 0,
      totalForks: 0,
      commitActivity: [],
      languages: {},
      topRepos: [],
    };
  }
}

export async function getGitHubProjects(): Promise<Project[]> {
  try {
    const repos = await getPinnedRepos();
    return repos.map(githubRepoToProject);
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return await getPinnedProjects(); // Fallback to YAML data
  }
}

// SEO and metadata functions
export async function generateMetadata(
  page: string,
  data?: Record<string, string>,
) {
  const personalInfo = await getPersonalInfo();
  const config = await getSiteConfig();
  const baseUrl =
    config.site?.url ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const metadata = {
    title: `${page} - ${personalInfo.name}`,
    description: personalInfo.bio,
    openGraph: {
      title: `${page} - ${personalInfo.name}`,
      description: personalInfo.bio,
      url: `${baseUrl}/${page.toLowerCase()}`,
      siteName: config.site?.title || personalInfo.name,
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: personalInfo.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page} - ${personalInfo.name}`,
      description: personalInfo.bio,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
  };

  if (data) {
    Object.assign(metadata, data);
  }

  return metadata;
}
