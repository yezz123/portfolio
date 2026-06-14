import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBlogPostBySlug, getPersonalInfo } from "@/lib/data";
import { safeDateFormat } from "@/lib/utils";
import { BlogInteractions } from "@/components/blog-interactions";
import { CodeBlockScript } from "@/components/code-block";
import { CommentSection } from "@/components/comments/comment-section";
import { BlogSummarizeButton } from "@/components/blog-summarize-button";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const [post, personalInfo] = await Promise.all([
    getBlogPostBySlug(resolvedParams.slug),
    getPersonalInfo(),
  ]);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `${baseUrl}${post.image}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: personalInfo.name,
      url: personalInfo.website,
      sameAs: [
        `https://github.com/${personalInfo.github}`,
        `https://x.com/${personalInfo.twitter}`,
        `https://linkedin.com/in/${personalInfo.linkedin}`,
      ],
    },
    publisher: {
      "@type": "Person",
      name: personalInfo.name,
      url: personalInfo.website,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
    keywords: post.tags.join(", "),
    articleSection: "Technology",
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-12">
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {safeDateFormat(post.date, "MMMM dd, yyyy")}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readingTime} min read
            </div>
            {post.featured && <Badge variant="default">Featured</Badge>}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            {post.tags &&
              Array.isArray(post.tags) &&
              post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            <BlogSummarizeButton
              blogSlug={resolvedParams.slug}
              content={post.content}
              title={post.title}
            />
          </div>

          <Separator />
        </header>

        {/* Article Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </div>
        </article>

        {/* Blog Interactions */}
        <div>
          <BlogInteractions
            blogId={resolvedParams.slug}
            initialLikes={0}
            initialDislikes={0}
            blogTitle={post.title}
            blogUrl={postUrl}
          />
        </div>

        {/* Comments Section */}
        <section className="mt-16 pt-8">
          <Separator className="mb-8" />
          <CommentSection blogId={resolvedParams.slug} />
        </section>

        {/* Article Footer */}
        <footer className="mt-16 pt-8">
          <Separator className="mb-8" />

          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Enjoyed this article?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/blog">Read More Articles</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">Learn More About Me</Link>
              </Button>
            </div>
          </div>
        </footer>
      </div>
      <CodeBlockScript />
    </div>
  );
}
