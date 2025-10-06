import { NextResponse } from "next/server";
import { getNavigationItems } from "@/lib/data";

export async function GET() {
  try {
    const navigationItems = await getNavigationItems();
    return NextResponse.json(navigationItems);
  } catch (error) {
    console.error("Error loading navigation items:", error);
    return NextResponse.json(
      { error: "Failed to load navigation items" },
      { status: 500 },
    );
  }
}
