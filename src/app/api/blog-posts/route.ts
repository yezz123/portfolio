import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");

    const posts = await getBlogPosts();

    // Filter posts based on query parameters
    let filteredPosts = posts;

    if (featured === "true") {
      filteredPosts = posts.filter((post) => post.featured);
    }

    return NextResponse.json(filteredPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 },
    );
  }
}
