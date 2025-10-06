"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hash, BookOpen, Calendar, Mic, FolderOpen } from "lucide-react";
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

interface UnifiedTag {
  name: string;
  count: number;
  blogs: number;
  talks: number;
  projects: number;
  content: {
    type: "blog" | "talk" | "project";
    slug: string;
    title: string;
    date: string;
    readingTime?: number;
    featured?: boolean;
  }[];
}

export default function TagsPage() {
  const [tags, setTags] = useState<UnifiedTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (response.ok) {
          const data = await response.json();
          setTags(data);
        } else {
          setError("Failed to load tags");
        }
      } catch (err) {
        setError("Error loading tags");
        console.error("Error loading tags:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tags...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Sort tags by count (most popular first)
  const sortedTags = tags.sort((a, b) => b.count - a.count);

  // Generate color classes for tags
  const getTagColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-gradient mb-4">
            All Tags
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore all content organized by topics and tags. Click on any tag
            to see related blogs, talks, and projects.
          </p>
        </motion.div>

        {/* Tags Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {sortedTags.map((tag, index) => (
              <motion.div
                key={tag.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/tags/${encodeURIComponent(tag.name)}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="w-5 h-5 text-primary" />
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {tag.name}
                          </CardTitle>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`${getTagColor(index)} font-medium`}
                        >
                          {tag.count} {tag.count === 1 ? "item" : "items"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Content Type Breakdown */}
                        <div className="flex flex-wrap gap-2">
                          {tag.blogs > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {tag.blogs} blog{tag.blogs !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          {tag.talks > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Mic className="w-3 h-3 mr-1" />
                              {tag.talks} talk{tag.talks !== 1 ? "s" : ""}
                            </Badge>
                          )}
                          {tag.projects > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <FolderOpen className="w-3 h-3 mr-1" />
                              {tag.projects} project
                              {tag.projects !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>

                        {/* Latest Content Preview */}
                        {tag.content.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Latest content:
                            </p>
                            {tag.content.slice(0, 2).map((item) => (
                              <div
                                key={`${item.type}-${item.slug}`}
                                className="text-sm"
                              >
                                <p className="font-medium text-foreground line-clamp-1">
                                  {item.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.date).toLocaleDateString()}
                                  {item.type === "blog" && item.readingTime && (
                                    <>
                                      <BookOpen className="w-3 h-3" />
                                      {item.readingTime} min read
                                    </>
                                  )}
                                  {item.type === "talk" && (
                                    <Mic className="w-3 h-3" />
                                  )}
                                  {item.type === "project" && (
                                    <FolderOpen className="w-3 h-3" />
                                  )}
                                </div>
                              </div>
                            ))}
                            {tag.content.length > 2 && (
                              <p className="text-xs text-muted-foreground">
                                +{tag.content.length - 2} more items
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <Hash className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-2xl font-bold">
                  {tags.length}
                </CardTitle>
                <CardDescription>
                  {tags.length === 1 ? "Tag" : "Tags"} •{" "}
                  {tags.reduce((sum, tag) => sum + tag.count, 0)} total posts
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Blog Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
              <BookOpen className="w-5 h-5 mr-2" />
              Back to All Posts
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
