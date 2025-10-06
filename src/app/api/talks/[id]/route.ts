import { NextResponse } from "next/server";
import { getTalkById } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const talk = await getTalkById(id);

    if (!talk) {
      return NextResponse.json({ error: "Talk not found" }, { status: 404 });
    }

    return NextResponse.json(talk);
  } catch (error) {
    console.error("Error loading talk:", error);
    return NextResponse.json({ error: "Failed to load talk" }, { status: 500 });
  }
}
