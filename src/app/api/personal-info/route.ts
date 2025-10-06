import { NextResponse } from "next/server";
import { getPersonalInfo } from "@/lib/data";

export async function GET() {
  try {
    const personalInfo = await getPersonalInfo();
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("Error loading personal info:", error);
    return NextResponse.json(
      {
        error: "Failed to load personal info",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
