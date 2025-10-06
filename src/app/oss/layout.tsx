import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const ossUrl = `${baseUrl}/oss`;
  const description = `Explore open source projects by ${personal.name}, a ${personal.title}. ${personal.bio}`;
  // Generate dynamic OG image URL for OSS page
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("Open Source Projects")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("GitHub Repositories")}`;

  return {
    title: `OSS - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "open source",
      "github",
      "repositories",
      "software engineering",
      "programming",
      "development",
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
      title: `OSS - ${personal.name}`,
      description,
      type: "website",
      url: ossUrl,
      siteName: personal.name,
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${personal.name} Open Source Projects`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `OSS - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: ossUrl,
    },
  };
}

export default function OSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
