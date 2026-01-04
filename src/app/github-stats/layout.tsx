import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const pageUrl = `${baseUrl}/github-stats`;
  const description = `GitHub statistics and contributions by ${personal.name}, a ${personal.title}. View repositories, stars, forks, and programming languages.`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("GitHub Statistics")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("Open Source Contributions")}`;

  return {
    title: `GitHub Stats - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "github",
      "statistics",
      "open source",
      "repositories",
      "contributions",
      "programming",
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
      title: `GitHub Stats - ${personal.name}`,
      description,
      type: "website",
      url: pageUrl,
      siteName: personal.name,
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${personal.name} GitHub Statistics`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `GitHub Stats - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function GitHubStatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
