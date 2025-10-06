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
      images: [
        {
          url: `${config.site?.url || ""}/images/og/og.PNG`,
          width: 1200,
          height: 630,
          alt: `Talks - ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Talks - ${personal.name}`,
      description: `Watch talks and presentations by ${personal.name}, a ${personal.title}. ${personal.bio}`,
      images: [`${config.site?.url || ""}/images/og/og.PNG`],
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
