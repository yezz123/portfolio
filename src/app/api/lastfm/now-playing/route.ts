import { NextResponse } from "next/server";

export async function GET() {
  try {
    const lastFmApiKey = process.env.LASTFM_API_KEY;
    const lastFmUsername = process.env.LASTFM_USERNAME;

    if (!lastFmApiKey || !lastFmUsername) {
      return NextResponse.json(
        { error: "Last.fm credentials not configured" },
        { status: 500 },
      );
    }

    // Get recent tracks from Last.fm
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${lastFmUsername}&api_key=${lastFmApiKey}&format=json&limit=1`,
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Last.fm data" },
        { status: 500 },
      );
    }

    const data = await response.json();

    if (
      !data.recenttracks ||
      !data.recenttracks.track ||
      data.recenttracks.track.length === 0
    ) {
      return NextResponse.json(null);
    }

    const track = data.recenttracks.track[0];

    // Check if currently playing (has @attr with nowplaying="true")
    const isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";

    if (!isNowPlaying) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      name: track.name,
      artist: {
        "#text": track.artist["#text"],
      },
      url: track.url,
      "@attr": track["@attr"],
    });
  } catch (error) {
    console.error("Last.fm API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
