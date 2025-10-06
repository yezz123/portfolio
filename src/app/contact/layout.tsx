import { Metadata } from "next";
import { loadConfig } from "@/lib/yaml-loader";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const { personal } = config;

  return {
    title: `Contact - ${personal.name}`,
    description: `Get in touch with ${personal.name}, a ${personal.title}. ${personal.bio}`,
    openGraph: {
      title: `Contact - ${personal.name}`,
      description: `Get in touch with ${personal.name}, a ${personal.title}. ${personal.bio}`,
      type: "website",
      url: `${config.site?.url || ""}/contact`,
      images: [
        {
          url: `${config.site?.url || ""}/images/og/og.PNG`,
          width: 1200,
          height: 630,
          alt: `Contact - ${personal.name}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Contact - ${personal.name}`,
      description: `Get in touch with ${personal.name}, a ${personal.title}. ${personal.bio}`,
      images: [`${config.site?.url || ""}/images/og/og.PNG`],
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
