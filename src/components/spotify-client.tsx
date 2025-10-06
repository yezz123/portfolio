"use client";

import { useState, useEffect } from "react";
import { Music } from "lucide-react";

interface LastFmTrack {
  name: string;
  artist: { "#text": string };
  url: string;
  "@attr"?: { nowplaying?: string };
}

export function SpotifyClient() {
  const [currentTrack, setCurrentTrack] = useState<LastFmTrack | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch("/api/lastfm/now-playing");
        if (response.ok) {
          const data = await response.json();
          setCurrentTrack(data);
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error("Error fetching Last.fm data:", error);
        setCurrentTrack(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTrack();

    // Refresh every 30 seconds
    const interval = setInterval(fetchCurrentTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Music className="w-4 h-4" />
        <span className="text-sm">Loading music...</span>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Music className="w-4 h-4" />
        <span className="text-sm">Not playing</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Music className="w-4 h-4" />
      <a
        href={currentTrack.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm hover:text-primary transition-colors"
      >
        <span className="sm:hidden">
          <span className="font-medium text-foreground">
            {currentTrack.name.length > 15
              ? `${currentTrack.name.substring(0, 15)}...`
              : currentTrack.name}
          </span>
        </span>
        <span className="hidden sm:inline">
          Listening to{" "}
          <span className="font-medium text-foreground">
            {currentTrack.name}
          </span>{" "}
          by {currentTrack.artist["#text"]}
        </span>
      </a>
    </div>
  );
}
