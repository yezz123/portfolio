import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = decodeURIComponent(resolvedParams.tag);
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const pageUrl = `${baseUrl}/tags/${encodeURIComponent(tag)}`;
  const description = `Explore content tagged with "${tag}" by ${personal.name}. Find blogs, talks, and projects related to ${tag}.`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(`#${tag}`)}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("Tagged Content")}`;

  return {
    title: `${tag} - Tags | ${personal.name}`,
    description,
    keywords: [
      tag,
      personal.name,
      "tags",
      "blog",
      "topics",
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
      title: `${tag} - Tags | ${personal.name}`,
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
          alt: `${tag} tagged content by ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `${tag} - Tags | ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function TagDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
