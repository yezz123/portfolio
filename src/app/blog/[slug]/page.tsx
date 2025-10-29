"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogPost } from "@/lib/data";
import { safeDateFormat } from "@/lib/utils";
import { BlogInteractions } from "@/components/blog-interactions";
import { CodeBlockScript } from "@/components/code-block";
import { CommentSection } from "@/components/comments/comment-section";
import Link from "next/link";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [interactions, setInteractions] = useState({
    likes: 0,
    dislikes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const [postResponse, interactionsResponse] = await Promise.all([
          fetch(`/api/blog-posts/${resolvedParams.slug}`),
          fetch(`/api/blog-posts/${resolvedParams.slug}/interactions`),
        ]);

        if (postResponse.ok) {
          const postData = await postResponse.json();
          setPost(postData);
        } else {
          notFound();
        }

        if (interactionsResponse.ok) {
          const interactionsData = await interactionsResponse.json();
          setInteractions({
            likes: interactionsData.likes || 0,
            dislikes: interactionsData.dislikes || 0,
          });
        }
      } catch (error) {
        console.error("Error loading blog post:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image
      ? `${process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me"}${post.image}`
      : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Yasser Tahiri",
      url: "https://yezz.me",
      sameAs: [
        "https://github.com/yezz123",
        "https://twitter.com/THyasser1",
        "https://linkedin.com/in/yezz123",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "Yasser Tahiri",
      url: "https://yezz.me",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL || "https://yezz.me"}/blog/${post.slug}`,
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        {/* Featured Image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mb-12"
          >
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
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

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags &&
              Array.isArray(post.tags) &&
              post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
          </div>

          <Separator />
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="prose prose-neutral dark:prose-invert max-w-none"
        >
          <div className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </div>
        </motion.article>

        {/* Blog Interactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <BlogInteractions
            blogId={resolvedParams.slug}
            initialLikes={interactions.likes}
            initialDislikes={interactions.dislikes}
            blogTitle={post.title}
            blogUrl={`${window.location.origin}/blog/${post.slug}`}
          />
        </motion.div>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 pt-8"
        >
          <Separator className="mb-8" />
          <CommentSection blogId={resolvedParams.slug} />
        </motion.section>

        {/* Article Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 pt-8"
        >
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
        </motion.footer>
      </div>
      <CodeBlockScript />
    </div>
  );
}
