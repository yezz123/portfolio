import { MetadataRoute } from "next";
import { loadConfig } from "@/lib/yaml-loader";
import { getBlogPosts, getProjects, getTalks } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [config, posts, talks, projects] = await Promise.all([
    loadConfig(),
    getBlogPosts(),
    getTalks(),
    getProjects(),
  ]);
  const baseUrl = config.site?.url || "https://yezz.me";
  const now = new Date();
  const tags = new Set<string>();

  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  talks.forEach((talk) => talk.tags.forEach((tag) => tags.add(tag)));
  projects.forEach((project) =>
    project.technologies.forEach((technology) => tags.add(technology)),
  );

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/talks`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/oss`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/uses`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: post.featured ? 0.8 : 0.7,
    })),
    ...Array.from(tags).map((tag) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
