"use client";

import { useState, useEffect } from "react";
import { CalBadge } from "./cal-badge";
// Removed direct database import

export function DynamicCalBadge() {
  const [contactInfo, setContactInfo] = useState<{
    calUsername: string;
  } | null>(null);

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const response = await fetch("/api/contact-info");
        if (response.ok) {
          const info = await response.json();
          setContactInfo(info as { calUsername: string });
        }
      } catch (error) {
        console.error("Error loading contact info:", error);
      }
    };
    loadContactInfo();
  }, []);

  if (!contactInfo?.calUsername) {
    return null;
  }

  return <CalBadge calUsername={contactInfo.calUsername} />;
}
