import { Calendar, Clock, ArrowRight } from "lucide-react";
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
import { getBlogPosts } from "@/lib/data";
import { safeDateFormat } from "@/lib/utils";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology,
            and more.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug}>
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
                      <div className="aspect-video w-24 bg-linear-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center ml-4">
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
                  <Button variant="ghost" asChild className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-lg">
                  No blog posts yet. Check back soon for new content!
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
