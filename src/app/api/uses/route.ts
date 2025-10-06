import { NextResponse } from "next/server";
import { getUsesItems, getUsesByCategory } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const items = category
      ? await getUsesByCategory(category as "desk" | "home" | "tools")
      : await getUsesItems();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error loading uses items:", error);
    return NextResponse.json(
      { error: "Failed to load uses items" },
      { status: 500 },
    );
  }
}
