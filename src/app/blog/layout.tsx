import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const blogUrl = `${baseUrl}/blog`;
  const description = `Read the latest blog posts by ${personal.name}, a ${personal.title}. ${personal.bio}`;
  // Generate dynamic OG image URL for blog listing
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("Blog")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("Latest Posts")}`;

  return {
    title: `Blog - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "blog",
      "software engineering",
      "technology",
      "programming",
      "backend development",
      "devops",
      "python",
      "fastapi",
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
      title: `Blog - ${personal.name}`,
      description,
      type: "website",
      url: blogUrl,
      siteName: personal.name,
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${personal.name} Blog`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `Blog - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: blogUrl,
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
