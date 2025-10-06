import { NextResponse } from "next/server";
import { getBlogPosts, getTalks, getProjects } from "@/lib/data";

interface UnifiedTag {
  name: string;
  count: number;
  blogs: number;
  talks: number;
  projects: number;
  content: {
    type: "blog" | "talk" | "project";
    slug: string;
    title: string;
    date: string;
    readingTime?: number;
    featured?: boolean;
  }[];
}

export async function GET() {
  try {
    const [blogPosts, talks, projects] = await Promise.all([
      getBlogPosts(),
      getTalks(),
      getProjects(),
    ]);

    // Create a map to aggregate all tags
    const tagMap = new Map<string, UnifiedTag>();

    // Process blog posts
    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            name: tag,
            count: 0,
            blogs: 0,
            talks: 0,
            projects: 0,
            content: [],
          });
        }

        const tagData = tagMap.get(tag)!;
        tagData.count++;
        tagData.blogs++;
        tagData.content.push({
          type: "blog",
          slug: post.slug,
          title: post.title,
          date: post.date,
          readingTime: post.readingTime,
          featured: post.featured,
        });
      });
    });

    // Process talks
    talks.forEach((talk) => {
      talk.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            name: tag,
            count: 0,
            blogs: 0,
            talks: 0,
            projects: 0,
            content: [],
          });
        }

        const tagData = tagMap.get(tag)!;
        tagData.count++;
        tagData.talks++;
        tagData.content.push({
          type: "talk",
          slug: talk.id,
          title: talk.title,
          date: talk.date,
        });
      });
    });

    // Process projects
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        if (!tagMap.has(tech)) {
          tagMap.set(tech, {
            name: tech,
            count: 0,
            blogs: 0,
            talks: 0,
            projects: 0,
            content: [],
          });
        }

        const tagData = tagMap.get(tech)!;
        tagData.count++;
        tagData.projects++;
        tagData.content.push({
          type: "project",
          slug: project.id,
          title: project.name,
          date: project.updatedAt || new Date().toISOString(),
        });
      });
    });

    // Sort content within each tag by date (newest first)
    tagMap.forEach((tagData) => {
      tagData.content.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    // Convert map to array and sort by total count (most popular first)
    const tags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error loading unified tags:", error);
    return NextResponse.json(
      {
        error: "Failed to load tags",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
