import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const pageUrl = `${baseUrl}/talks`;
  const description = `Watch talks and presentations by ${personal.name}, a ${personal.title}. Conference talks, podcasts, and speaking engagements.`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("Talks & Presentations")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("Speaking Engagements")}`;

  return {
    title: `Talks - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "talks",
      "presentations",
      "conferences",
      "speaking",
      "podcasts",
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
      title: `Talks - ${personal.name}`,
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
          alt: `Talks - ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `Talks - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function TalksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
