import React from "react";
import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal } = config;

  return {
    title: `About - ${personal.name}`,
    description: `Learn more about ${personal.name}, a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `About - ${personal.name}`,
      description: `Learn more about ${personal.name}, a ${personal.title}. ${personal.bio}`,
      type: "profile",
      url: `${config.site?.url || ""}/about`,
      images: [
        {
          url: `${config.site?.url || ""}/images/og/og.jpeg`,
          width: 1200,
          height: 630,
          alt: `About - ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `About - ${personal.name}`,
      description: `Learn more about ${personal.name}, a ${personal.title}. ${personal.bio}`,
      images: [`${config.site?.url || ""}/images/og/og.jpeg`],
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
