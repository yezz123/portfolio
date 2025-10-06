import { NextResponse } from "next/server";
import { getTalks } from "@/lib/data";

export async function GET() {
  try {
    const talks = await getTalks();
    return NextResponse.json(talks);
  } catch (error) {
    console.error("Error loading talks:", error);
    return NextResponse.json(
      { error: "Failed to load talks" },
      { status: 500 },
    );
  }
}
