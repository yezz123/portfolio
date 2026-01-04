import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      "https://wallet.yezz.me/api/portfolio?currency=usd",
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "Portfolio-Website/1.0",
        },
        cache: "no-store",
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("Portfolio API returned status:", response.status);
      return NextResponse.json(
        { error: "Failed to fetch portfolio data" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      totalValueUsd: data.totalValueUsd,
      lastUpdated: data.lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 },
    );
  }
}
