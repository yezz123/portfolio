"use client";

import { useEffect } from "react";
import { GoogleAnalytics as GA } from "@next/third-parties/google";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // Only load analytics after page load to improve performance
    if (gaId && typeof window !== "undefined") {
      // Analytics will be loaded by the GA component
    }
  }, [gaId]);

  if (!gaId) return null;

  return <GA gaId={gaId} />;
}
