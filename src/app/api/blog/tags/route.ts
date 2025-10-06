import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";

interface TagWithPosts {
  name: string;
  count: number;
  posts: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readingTime: number;
  }[];
}

export async function GET() {
  try {
    const blogPosts = await getBlogPosts();

    // Count tags and group posts by tag
    const tagMap = new Map<string, TagWithPosts>();

    blogPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, {
            name: tag,
            count: 0,
            posts: [],
          });
        }

        const tagData = tagMap.get(tag)!;
        tagData.count++;
        tagData.posts.push({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          readingTime: post.readingTime,
        });
      });
    });

    // Sort posts within each tag by date (newest first)
    tagMap.forEach((tagData) => {
      tagData.posts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    // Convert map to array and sort by count (most popular first)
    const tags = Array.from(tagMap.values()).sort((a, b) => b.count - a.count);

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error loading blog tags:", error);
    return NextResponse.json(
      {
        error: "Failed to load blog tags",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
