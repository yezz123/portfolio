"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Star,
  GitFork,
  Calendar,
  Code,
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
import Image from "next/image";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  visibility: string;
  default_branch: string;
  githubImageUrl?: string;
}

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalLanguages: number;
}

interface GitHubResponse {
  repositories: GitHubRepo[];
  stats: GitHubStats;
}

export default function OSSPage() {
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRepositories = async () => {
      try {
        const response = await fetch("/api/github/repositories");
        if (response.ok) {
          const data: GitHubResponse = await response.json();
          setRepositories(data.repositories);
          setStats(data.stats);
        } else {
          setError("Failed to load repositories");
        }
      } catch (err) {
        setError("Error loading repositories");
        console.error("Error loading repositories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadRepositories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading repositories...</p>
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

  // Sort repositories by stars (descending) and then by updated date
  const sortedRepos = repositories.sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

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
            Open Source Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of my top 9 open source projects by popularity on
            GitHub. Building tools and libraries to help developers create
            amazing applications.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="text-center p-6">
            <Github className="w-10 h-10 text-primary mx-auto mb-4" />
            <CardTitle className="text-4xl font-bold">
              {stats?.totalRepos || 0}
            </CardTitle>
            <CardDescription>Public Repositories</CardDescription>
          </Card>
          <Card className="text-center p-6">
            <Star className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-4xl font-bold">
              {stats?.totalStars || 0}
            </CardTitle>
            <CardDescription>Total Stars</CardDescription>
          </Card>
          <Card className="text-center p-6">
            <GitFork className="w-10 h-10 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-4xl font-bold">
              {stats?.totalForks || 0}
            </CardTitle>
            <CardDescription>Total Forks</CardDescription>
          </Card>
          <Card className="text-center p-6">
            <Code className="w-10 h-10 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-4xl font-bold">
              {stats?.totalLanguages || 0}
            </CardTitle>
            <CardDescription>Languages Used</CardDescription>
          </Card>
        </motion.section>

        {/* Repositories Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gradient mb-4">
              Featured Repositories
            </h2>
            <p className="text-lg text-muted-foreground">
              My top 9 most popular open source projects by GitHub stars
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                      {repo.githubImageUrl ? (
                        <Image
                          src={repo.githubImageUrl}
                          alt={`${repo.name} repository`}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {repo.name
                              .split("-")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{repo.name}</CardTitle>
                    <CardDescription className="text-base">
                      {repo.description || "No description available"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.topics.slice(0, 5).map((topic) => (
                          <Badge
                            key={topic}
                            variant="secondary"
                            className="text-xs"
                          >
                            {topic}
                          </Badge>
                        ))}
                        {repo.topics.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{repo.topics.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        {repo.forks_count}
                      </span>
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <Code className="w-4 h-4" />
                          {repo.language}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </div>
                  </CardContent>

                  <div className="p-6 pt-0">
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          View Code
                        </a>
                      </Button>
                      {repo.homepage && (
                        <Button variant="outline" asChild>
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* GitHub Profile Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Button size="lg" asChild>
            <a
              href="https://github.com/yezz123"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5 mr-2" />
              View Full GitHub Profile
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
