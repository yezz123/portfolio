import { Metadata } from "next";
import { getBlogPostBySlug, getBlogPosts, getPersonalInfo } from "@/lib/data";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const [post, personalInfo] = await Promise.all([
    getBlogPostBySlug(resolvedParams.slug),
    getPersonalInfo(),
  ]);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  // Generate dynamic OG image URL
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&author=${encodeURIComponent(personalInfo.name)}&date=${encodeURIComponent(new Date(post.date).toLocaleDateString())}`;
  const imageUrl = post.image ? `${baseUrl}${post.image}` : ogImageUrl;

  // Generate a better description if excerpt is too short
  const description =
    post.excerpt.length > 160
      ? post.excerpt.substring(0, 157) + "..."
      : post.excerpt;

  // Generate keywords from tags and content
  const keywords = [
    ...post.tags,
    personalInfo.name,
    "blog",
    "software engineering",
    "technology",
    "programming",
  ];

  return {
    title: `${post.title} | ${personalInfo.name}`,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: personalInfo.name, url: personalInfo.website }],
    creator: personalInfo.name,
    publisher: personalInfo.name,
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
      title: post.title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      url: postUrl,
      siteName: personalInfo.name,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: "image/jpeg",
        },
      ],
      authors: [personalInfo.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      site: `@${personalInfo.twitter}`,
      creator: `@${personalInfo.twitter}`,
      title: post.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    other: {
      "article:author": personalInfo.name,
      "article:published_time": post.date,
      "article:modified_time": post.date,
      "article:section": "Technology",
      "article:tag": post.tags.join(", "),
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
