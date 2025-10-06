"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <WifiOff className="w-16 h-16 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
          <p className="text-muted-foreground">
            It looks like you&apos;re not connected to the internet. Please
            check your connection and try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Some features may be limited while offline.</p>
        </div>
      </div>
    </div>
  );
}
