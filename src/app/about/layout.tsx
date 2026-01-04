import React from "react";
import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const pageUrl = `${baseUrl}/about`;
  const description = `Learn more about ${personal.name}, a ${personal.title}. ${personal.bio}`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("About Me")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent(personal.title)}`;

  return {
    title: `About - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "about",
      "software engineer",
      "developer",
      "portfolio",
      ...(site?.keywords || []),
    ].join(", "),
    authors: [{ name: personal.name, url: personal.website }],
    creator: personal.name,
    publisher: personal.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `About - ${personal.name}`,
      description,
      type: "profile",
      url: pageUrl,
      siteName: personal.name,
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `About - ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `About - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
