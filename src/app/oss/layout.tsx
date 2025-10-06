import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal } = config;

  return {
    title: `OSS - ${personal.name}`,
    description: `Explore open source projects by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `OSS - ${personal.name}`,
      description: `Explore open source projects by ${personal.name}, a ${personal.title}. ${personal.bio}`,
      type: "website",
      url: `${config.site?.url || ""}/oss`,
    },
    twitter: {
      card: "summary_large_image",
      title: `OSS - ${personal.name}`,
      description: `Explore open source projects by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    },
  };
}

export default function OSSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
