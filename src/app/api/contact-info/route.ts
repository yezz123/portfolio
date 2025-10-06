import { NextResponse } from "next/server";
import { getContactInfo } from "@/lib/data";

export async function GET() {
  try {
    const contactInfo = await getContactInfo();
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error loading contact info:", error);
    return NextResponse.json(
      { error: "Failed to load contact info" },
      { status: 500 },
    );
  }
}
