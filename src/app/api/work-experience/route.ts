import { NextResponse } from "next/server";
import { getWorkExperience } from "@/lib/data";

export async function GET() {
  try {
    const workExperience = await getWorkExperience();
    return NextResponse.json(workExperience);
  } catch (error) {
    console.error("Error loading work experience:", error);
    return NextResponse.json(
      { error: "Failed to load work experience" },
      { status: 500 },
    );
  }
}
