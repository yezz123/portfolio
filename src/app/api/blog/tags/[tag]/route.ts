import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";

interface RouteParams {
  params: Promise<{
    tag: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { tag: tagParam } = await params;
    const tag = decodeURIComponent(tagParam);
    const blogPosts = await getBlogPosts();

    // Filter posts by tag
    const postsWithTag = blogPosts.filter((post) =>
      post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()),
    );

    // Sort by date (newest first)
    postsWithTag.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return NextResponse.json({
      tag,
      posts: postsWithTag,
      count: postsWithTag.length,
    });
  } catch (error) {
    console.error("Error loading blog posts for tag:", error);
    return NextResponse.json(
      {
        error: "Failed to load blog posts for tag",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
