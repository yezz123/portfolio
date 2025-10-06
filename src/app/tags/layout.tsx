import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const personal = config.personal;

  return {
    title: `Tags - ${personal.name}`,
    description: `Browse blog post tags by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `Tags - ${personal.name}`,
      description: `Browse blog post tags by ${personal.name}, a ${personal.title}. ${personal.bio}`,
      type: "website",
      url: `${config.site?.url || ""}/tags`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Tags - ${personal.name}`,
      description: `Browse blog post tags by ${personal.name}, a ${personal.title}. ${personal.bio}`,
    },
  };
}

export default function TagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
