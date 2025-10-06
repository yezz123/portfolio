import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal } = config;

  return {
    title: `Talks - ${personal.name}`,
    description: `Watch talks and presentations by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `Talks - ${personal.name}`,
      description: `Watch talks and presentations by ${personal.name}, a ${personal.title}. ${personal.bio}`,
      type: "website",
      url: `${config.site?.url || ""}/talks`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Talks - ${personal.name}`,
      description: `Watch talks and presentations by ${personal.name}, a ${personal.title}. ${personal.bio}`,
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
