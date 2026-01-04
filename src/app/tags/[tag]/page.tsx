"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Hash,
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Mic,
  FolderOpen,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

interface TagContent {
  type: "blog" | "talk" | "project";
  slug: string;
  title: string;
  date: string;
  readingTime?: number;
  featured?: boolean;
  description?: string;
  url?: string;
  venue?: string;
  technologies?: string[];
}

interface TagData {
  tag: string;
  count: number;
  blogs: number;
  talks: number;
  projects: number;
  content: TagContent[];
}

export default function TagPage() {
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);

  const [tagData, setTagData] = useState<TagData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTagContent = async () => {
      try {
        const response = await fetch(`/api/tags/${encodeURIComponent(tag)}`);
        if (response.ok) {
          const data = await response.json();
          setTagData(data);
        } else {
          setError("Failed to load content for this tag");
        }
      } catch (err) {
        setError("Error loading content for this tag");
        console.error("Error loading tag content:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tag) {
      loadTagContent();
    }
  }, [tag]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading posts for &ldquo;{tag}&rdquo;...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tagData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || "Tag not found"}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>Retry</Button>
            <Button variant="outline" asChild>
              <Link href="/tags">Back to Tags</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate color for the current tag
  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    ];
    const hash = tagName.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const currentTagColor = getTagColor(tag);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" asChild>
              <Link href="/tags">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Tags
              </Link>
            </Button>
          </div>

          {/* Tag Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hash className="w-8 h-8 text-primary" />
              <Badge
                variant="secondary"
                className={`${currentTagColor} text-lg px-4 py-2 font-medium`}
              >
                {tagData.tag}
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gradient mb-4">
              Content tagged &ldquo;{tagData.tag}&rdquo;
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              {tagData.count} {tagData.count === 1 ? "item" : "items"} found
            </p>

            {/* Content Type Breakdown */}
            <div className="flex flex-wrap gap-4 justify-center">
              {tagData.blogs > 0 && (
                <Badge variant="outline" className="text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {tagData.blogs} blog{tagData.blogs !== 1 ? "s" : ""}
                </Badge>
              )}
              {tagData.talks > 0 && (
                <Badge variant="outline" className="text-sm">
                  <Mic className="w-4 h-4 mr-2" />
                  {tagData.talks} talk{tagData.talks !== 1 ? "s" : ""}
                </Badge>
              )}
              {tagData.projects > 0 && (
                <Badge variant="outline" className="text-sm">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  {tagData.projects} project{tagData.projects !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-6"
        >
          {tagData.content.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.slug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "blog" && (
                          <BookOpen className="w-5 h-5 text-primary" />
                        )}
                        {item.type === "talk" && (
                          <Mic className="w-5 h-5 text-primary" />
                        )}
                        {item.type === "project" && (
                          <FolderOpen className="w-5 h-5 text-primary" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {item.type.charAt(0).toUpperCase() +
                            item.type.slice(1)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {item.type === "blog" ? (
                          <Link
                            href={`/blog/${item.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {item.description}
                      </CardDescription>
                      {item.venue && (
                        <p className="text-sm text-muted-foreground mt-2">
                          📍 {item.venue}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {item.featured && (
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {item.url && (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {item.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.readingTime} min read
                        </div>
                      )}
                    </div>
                    {item.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.slice(0, 3).map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className={`text-xs ${
                              tech.toLowerCase() === tag.toLowerCase()
                                ? currentTagColor
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {tech}
                          </Badge>
                        ))}
                        {item.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>

        {/* Empty State */}
        {tagData.content.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center py-16"
          >
            <Hash className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-6">
              No content is tagged with &ldquo;{tagData.tag}&rdquo; yet.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/blog">Browse All Blogs</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tags">Back to Tags</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/blog">
                <BookOpen className="w-5 h-5 mr-2" />
                View All Blogs
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/talks">
                <Mic className="w-5 h-5 mr-2" />
                View All Talks
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/projects">
                <FolderOpen className="w-5 h-5 mr-2" />
                View All Projects
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
