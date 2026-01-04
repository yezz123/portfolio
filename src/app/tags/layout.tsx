import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const pageUrl = `${baseUrl}/tags`;
  const description = `Browse content by tags from ${personal.name}, a ${personal.title}. Explore blogs, talks, and projects organized by topics.`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("All Tags")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("Browse by Topic")}`;

  return {
    title: `Tags - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "tags",
      "topics",
      "blog",
      "categories",
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
      title: `Tags - ${personal.name}`,
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
          alt: `${personal.name} Tags`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `Tags - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function TagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
