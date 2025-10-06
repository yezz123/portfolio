"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Send } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogPost } from "@/lib/data";
import { safeDateFormat } from "@/lib/utils";
import Link from "next/link";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/blog-posts");
        if (response.ok) {
          const blogPosts = await response.json();
          setPosts(blogPosts);
        }
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleAddComment = (slug: string) => {
    if (!newComment[slug]?.trim()) return;

    setComments((prev) => ({
      ...prev,
      [slug]: [...(prev[slug] || []), newComment[slug]],
    }));

    setNewComment((prev) => ({ ...prev, [slug]: "" }));
  };

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Thoughts, tutorials, and insights about web development, technology,
            and more.
          </motion.p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </div>
                    {post.image ? (
                      <div className="aspect-video w-24 rounded-lg overflow-hidden ml-4">
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={96}
                          height={54}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center ml-4">
                        <span className="text-white text-sm font-bold">
                          {post.title
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {safeDateFormat(post.date, "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readingTime} min read
                    </div>
                    {post.featured && (
                      <Badge variant="default" className="text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Button variant="ghost" asChild className="w-full mb-4">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>

                  {/* Comment Section */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 text-sm text-primary">
                      Comments
                    </h3>

                    <div className="space-y-2 mb-3">
                      {(comments[post.slug] || []).length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        comments[post.slug].map((cmt, idx) => (
                          <div
                            key={idx}
                            className="bg-muted p-2 rounded-md text-sm"
                          >
                            {cmt}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment[post.slug] || ""}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            [post.slug]: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                      <Button
                        onClick={() => handleAddComment(post.slug)}
                        size="icon"
                        variant="default"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-lg">
                  No blog posts yet. Check back soon for new content!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
