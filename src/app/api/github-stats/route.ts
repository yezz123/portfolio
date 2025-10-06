import { NextResponse } from "next/server";
import { getGitHubStats } from "@/lib/data";

export async function GET() {
  try {
    const stats = await getGitHubStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 },
    );
  }
}
