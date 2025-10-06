import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal } = config;

  return {
    title: `Uses - ${personal.name}`,
    description: `See what tools and technologies ${personal.name} uses as a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `Uses - ${personal.name}`,
      description: `See what tools and technologies ${personal.name} uses as a ${personal.title}. ${personal.bio}`,
      type: "website",
      url: `${config.site?.url || ""}/uses`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Uses - ${personal.name}`,
      description: `See what tools and technologies ${personal.name} uses as a ${personal.title}. ${personal.bio}`,
    },
  };
}

export default function UsesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
