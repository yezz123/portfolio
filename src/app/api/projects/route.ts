import { NextResponse } from "next/server";
import { getProjects } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pinned = searchParams.get("pinned");
    const featured = searchParams.get("featured");

    const projects = await getProjects();

    // Filter projects based on query parameters
    let filteredProjects = projects;

    if (pinned === "true") {
      filteredProjects = projects.filter((project) => project.pinned);
    }

    if (featured === "true") {
      filteredProjects = projects.filter((project) => project.featured);
    }

    return NextResponse.json(filteredProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
