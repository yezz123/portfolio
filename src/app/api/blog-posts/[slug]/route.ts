import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error loading blog post:", error);
    return NextResponse.json(
      { error: "Failed to load blog post" },
      { status: 500 },
    );
  }
}
