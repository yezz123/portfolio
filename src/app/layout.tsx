import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { DynamicCalBadge } from "@/components/dynamic-cal-badge";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts-provider";
import { MouseCursor } from "@/components/mouse-cursor";
import { loadConfig } from "@/lib/yaml-loader";
import { GoogleAnalytics } from "@/components/analytics";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadConfig();
  const site = config.site || {};
  const { personal } = config;

  return {
    title: `${personal.name} - ${personal.title}`,
    description: site.description || personal.bio,
    keywords: site.keywords || [
      "developer",
      "portfolio",
      "react",
      "nextjs",
      "typescript",
    ],
    authors: [{ name: personal.name }],
    creator: personal.name,
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: site.url || personal.website,
      title: site.title || `${personal.name} - ${personal.title}`,
      description: site.description || personal.bio,
      siteName: site.title || `${personal.name} Portfolio`,
      images: [
        {
          url: `${site.url || personal.website}/images/og/og.PNG`,
          width: 1200,
          height: 630,
          alt: `${personal.name} - ${personal.title}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title || `${personal.name} - ${personal.title}`,
      description: site.description || personal.bio,
      creator: `@${personal.twitter}`,
      images: [`${site.url || personal.website}/images/og/og.PNG`],
    },
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
    alternates: {
      canonical: site.url || personal.website,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    other: {
      "application/ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: personal.name,
        jobTitle: personal.title,
        description: personal.bio,
        url: site.url || personal.website,
        sameAs: [
          `https://github.com/${personal.github}`,
          `https://twitter.com/${personal.twitter}`,
          `https://linkedin.com/in/${personal.linkedin}`,
        ],
        image: `${site.url || personal.website}/favicon.ico`,
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="//github.com" />
        <link rel="dns-prefetch" href="//avatars.githubusercontent.com" />
        <link
          rel="preload"
          href="/favicon.ico"
          as="image"
          type="image/x-icon"
        />
        <link rel="preload" href="/icons/wave.png" as="image" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for preventing layout shift */
              .bg-grid-black\/\\[0\\.02\\] {
                background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='0.02'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
              }
              .dark .bg-grid-white\/\\[0\\.02\\] {
                background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.02'%3e%3ccircle cx='30' cy='30' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
              }
              /* Prevent layout shift for theme toggle */
              .theme-toggle-button {
                width: 2.5rem;
                height: 2.5rem;
                position: relative;
              }
              /* Prevent layout shift for navigation */
              nav.fixed {
                contain: layout style;
              }
              /* Font display optimization */
              @font-face {
                font-family: '__GeistSans_7b9baf';
                font-display: swap;
              }
              @font-face {
                font-family: '__GeistMono_7b9baf';
                font-display: swap;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <KeyboardShortcutsProvider>
            <MouseCursor />
            <Navigation />
            <main className="pt-16">{children}</main>
            <Footer />
            <DynamicCalBadge />
            <Toaster />
          </KeyboardShortcutsProvider>
        </ThemeProvider>
        <GoogleAnalytics />
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
