"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink, Play, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Talk } from "@/lib/data";
import { safeDateFormat } from "@/lib/utils";
import Image from "next/image";

export default function TalksPage() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTalks = async () => {
      try {
        const response = await fetch("/api/talks");
        if (response.ok) {
          const talksData = await response.json();
          setTalks(talksData);
        }
      } catch (error) {
        console.error("Error loading talks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTalks();
  }, []);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Talks & Presentations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Sharing knowledge and insights through speaking engagements,
            conference talks, and presentations.
          </motion.p>
        </div>

        {/* Talks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {talks.map((talk, index) => (
            <motion.div
              key={talk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  {/* Talk Image/Thumbnail */}
                  <div className="aspect-video rounded-lg mb-4 relative overflow-hidden">
                    {talk.imageUrl ? (
                      <>
                        <Image
                          src={talk.imageUrl}
                          alt={talk.title}
                          className="w-full h-full object-cover"
                          width={400}
                          height={225}
                          priority
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        {talk.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {talk.title
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 4)}
                          </span>
                        </div>
                        {talk.videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <CardTitle className="text-xl mb-2">{talk.title}</CardTitle>

                  <div className="flex items-center text-sm text-muted-foreground space-x-4 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {safeDateFormat(talk.date, "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {talk.venue}
                    </div>
                  </div>

                  <CardDescription className="text-base leading-relaxed">
                    {talk.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {talk.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {talk.videoUrl && (
                      <Button size="sm" asChild>
                        <a
                          href={talk.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Watch Video
                        </a>
                      </Button>
                    )}
                    {talk.slidesUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={talk.slidesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Slides
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {talks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-lg">
                  No talks available yet. Check back soon for upcoming
                  presentations!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">
                Interested in having me speak?
              </h3>
              <p className="text-muted-foreground mb-4">
                I&apos;m always excited to share knowledge and connect with the
                developer community.
              </p>
              <Button asChild>
                <a href="/contact">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get in Touch
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
