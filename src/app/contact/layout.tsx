import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal, site } = config;

  const baseUrl =
    site?.url || process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const pageUrl = `${baseUrl}/contact`;
  const description = `Get in touch with ${personal.name}, a ${personal.title}. Schedule a meeting, send a message, or connect on social media.`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent("Get In Touch")}&author=${encodeURIComponent(personal.name)}&date=${encodeURIComponent("Contact Me")}`;

  return {
    title: `Contact - ${personal.name}`,
    description,
    keywords: [
      personal.name,
      "contact",
      "hire",
      "freelance",
      "consulting",
      "collaboration",
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
      title: `Contact - ${personal.name}`,
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
          alt: `Contact - ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personal.twitter}`,
      creator: `@${personal.twitter}`,
      title: `Contact - ${personal.name}`,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
