import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal } = config;

  return {
    title: `Projects - ${personal.name}`,
    description: `Explore the featured projects by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `Projects - ${personal.name}`,
      description: `Explore the featured projects by ${personal.name}, a ${personal.title}. ${personal.bio}`,
      type: "website",
      url: `${config.site?.url || ""}/projects`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Projects - ${personal.name}`,
      description: `Explore the featured projects by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    },
  };
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
