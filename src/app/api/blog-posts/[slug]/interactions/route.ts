import { NextResponse } from "next/server";
import * as db from "@/lib/database";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Get interaction counts only
    const reactionCounts = await db.getBlogReactionCounts(slug);

    return NextResponse.json({
      likes: reactionCounts.likes,
      dislikes: reactionCounts.dislikes,
    });
  } catch (error) {
    console.error("Error fetching blog interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog interactions" },
      { status: 500 },
    );
  }
}
