import { NextResponse } from "next/server";
import { getBlogPosts, getTalks, getProjects } from "@/lib/data";

interface RouteParams {
  params: Promise<{
    tag: string;
  }>;
}

interface TagContent {
  type: "blog" | "talk" | "project";
  slug: string;
  title: string;
  date: string;
  readingTime?: number;
  featured?: boolean;
  description?: string;
  url?: string;
  venue?: string;
  technologies?: string[];
}

interface TagData {
  tag: string;
  count: number;
  blogs: number;
  talks: number;
  projects: number;
  content: TagContent[];
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { tag: tagParam } = await params;
    const tag = decodeURIComponent(tagParam);
    const [blogPosts, allTalks, allProjects] = await Promise.all([
      getBlogPosts(),
      getTalks(),
      getProjects(),
    ]);

    const content: TagContent[] = [];
    let blogs = 0;
    let talks = 0;
    let projects = 0;

    // Process blog posts
    blogPosts.forEach((post) => {
      if (
        post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase())
      ) {
        blogs++;
        content.push({
          type: "blog",
          slug: post.slug,
          title: post.title,
          date: post.date,
          readingTime: post.readingTime,
          featured: post.featured,
          description: post.excerpt,
        });
      }
    });

    // Process talks
    allTalks.forEach((talk) => {
      if (
        talk.tags.some((talkTag) => talkTag.toLowerCase() === tag.toLowerCase())
      ) {
        talks++;
        content.push({
          type: "talk",
          slug: talk.id,
          title: talk.title,
          date: talk.date,
          description: talk.description,
          venue: talk.venue,
          url: talk.videoUrl || talk.slidesUrl,
        });
      }
    });

    // Process projects
    allProjects.forEach((project) => {
      if (
        project.technologies.some(
          (tech) => tech.toLowerCase() === tag.toLowerCase(),
        )
      ) {
        projects++;
        content.push({
          type: "project",
          slug: project.id,
          title: project.name,
          date: project.updatedAt || new Date().toISOString(),
          description: project.description,
          url: project.url,
          technologies: project.technologies,
        });
      }
    });

    // Sort content by date (newest first)
    content.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const tagData: TagData = {
      tag,
      count: content.length,
      blogs,
      talks,
      projects,
      content,
    };

    return NextResponse.json(tagData);
  } catch (error) {
    console.error("Error loading content for tag:", error);
    return NextResponse.json(
      {
        error: "Failed to load content for tag",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
