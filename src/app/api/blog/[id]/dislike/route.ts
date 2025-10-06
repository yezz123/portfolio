import { NextResponse } from "next/server";
import * as db from "@/lib/database";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await db.dislikeBlogPost(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling blog dislike:", error);
    return NextResponse.json(
      { error: "Failed to dislike blog post" },
      { status: 500 },
    );
  }
}
