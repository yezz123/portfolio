import { NextResponse } from "next/server";

// Simple in-memory cache for GitHub API responses

const githubCache = new Map<
  string,
  { data: GitHubResponse; timestamp: number }
>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  visibility: string;
  default_branch: string;
  fork: boolean;
  githubImageUrl?: string;
}

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalLanguages: number;
}

interface GitHubResponse {
  repositories: GitHubRepo[];
  stats: GitHubStats;
}

export async function GET() {
  try {
    const username = "yezz123";
    const cacheKey = `github-repos-${username}`;

    // Check cache first
    const cached = githubCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const githubImageHash = process.env.GITHUB_IMAGE_HASH;

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "yezz123",
    };

    if (githubToken) {
      headers["Authorization"] = `token ${githubToken}`;
    }

    // Fetch repositories (only owned by the user, not contributed to)
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
      { headers },
    );

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos: GitHubRepo[] = await reposResponse.json();

    // Filter out forks for display, but keep all for stats
    const allPublicRepos = repos.filter(
      (repo: GitHubRepo) => !repo.fork && repo.visibility === "public",
    );

    // Get top 9 for display
    const top9Repos = allPublicRepos
      .map((repo: GitHubRepo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        visibility: repo.visibility,
        default_branch: repo.default_branch,
        fork: repo.fork,
        githubImageUrl: githubImageHash
          ? `https://opengraph.githubassets.com/${githubImageHash}/${username}/${repo.name}`
          : `https://opengraph.githubassets.com/${username}/${repo.name}`,
      }))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 9); // Limit to top 9 repositories

    // Calculate stats from all repositories (not just top 9)
    const totalRepos = allPublicRepos.length;
    const totalStars = allPublicRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0,
    );
    const totalForks = allPublicRepos.reduce(
      (sum, repo) => sum + repo.forks_count,
      0,
    );
    const allLanguages = new Set(
      allPublicRepos.map((repo) => repo.language).filter(Boolean),
    );

    const responseData = {
      repositories: top9Repos,
      stats: {
        totalRepos,
        totalStars,
        totalForks,
        totalLanguages: allLanguages.size,
      },
    };

    // Cache the result
    githubCache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch GitHub repositories",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
