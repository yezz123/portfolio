"use server";

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const dataDirectory = path.join(process.cwd(), "data");

// Simple in-memory cache for YAML files

const yamlCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface PortfolioConfig {
  personal: {
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
    website: string;
  };
  contact: {
    email: string;
    calUsername: string;
    responseTime: string;
    availableForWork: boolean;
  };
  site?: {
    title?: string;
    description?: string;
    url?: string;
    author?: string;
    keywords?: string[];
  };
  social?: {
    github?: {
      url?: string;
      username?: string;
    };
    twitter?: {
      url?: string;
      username?: string;
    };
    linkedin?: {
      url?: string;
      username?: string;
    };
    email?: {
      url?: string;
      username?: string;
    };
  };
  navigation?: {
    items: { name: string; href: string; icon: string }[];
  };
  seo?: {
    robots?: {
      index?: boolean;
      follow?: boolean;
      googleBot?: {
        index?: boolean;
        follow?: boolean;
        maxVideoPreview?: number;
        maxImagePreview?: string;
        maxSnippet?: number;
      };
    };
    openGraph?: {
      type?: string;
      locale?: string;
      siteName?: string;
    };
    twitter?: {
      card?: string;
      creator?: string;
    };
  };
  features?: {
    threejs?: boolean;
    themeToggle?: boolean;
    contactForm?: boolean;
    calBooking?: boolean;
    githubIntegration?: boolean;
    mdxSupport?: boolean;
    chatgptSummarization?: boolean;
  };
  github?: {
    username?: string;
    token?: string;
    pinnedRepos?: number;
    showStats?: boolean;
    showCommitActivity?: boolean;
    showLanguages?: boolean;
  };
  chatgpt?: {
    enabled?: boolean;
    apiKey?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  };
  footer?: {
    copyright?: string;
    madeWith?: string;
    pages?: Array<{
      name: string;
      href: string;
    }>;
    resources?: Array<{
      name: string;
      href: string;
    }>;
  };
}

// Load YAML configuration
export async function loadConfig(): Promise<PortfolioConfig> {
  try {
    const configPath = path.join(dataDirectory, "config.yaml");
    const cacheKey = configPath;

    // Check cache first
    const cached = yamlCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as PortfolioConfig;
    }

    const fileContents = fs.readFileSync(configPath, "utf8");
    const config = yaml.load(fileContents) as PortfolioConfig;

    if (!config) {
      throw new Error("Config file is empty or invalid");
    }

    if (!config.personal) {
      throw new Error("Personal information is missing from config");
    }

    // Cache the result
    yamlCache.set(cacheKey, {
      data: config,
      timestamp: Date.now(),
    });

    return config;
  } catch (error) {
    console.error("Error loading config:", error);
    throw error;
  }
}

// Load YAML data files
export async function loadYamlData(filename: string): Promise<unknown> {
  try {
    const filePath = path.join(dataDirectory, `${filename}.yaml`);
    const cacheKey = filePath;

    // Check cache first
    const cached = yamlCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents);

    // Cache the result
    yamlCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    console.error(`Error loading YAML file ${filename}:`, error);
    throw error;
  }
}

// Load all YAML data files
export async function loadAllYamlData(): Promise<Record<string, unknown>> {
  const files = fs.readdirSync(dataDirectory);
  const data: Record<string, unknown> = {};

  const yamlFiles = files.filter(
    (file) => file.endsWith(".yaml") && file !== "config.yaml",
  );

  for (const file of yamlFiles) {
    const name = file.replace(".yaml", "");
    data[name] = await loadYamlData(name);
  }

  return data;
}

// Clear cache function for development
export async function clearYAMLCache(): Promise<void> {
  yamlCache.clear();
}
