"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitHubChart } from "@/components/ui/github-chart";
// Removed direct imports - using API calls instead
import { Github, Star, GitFork, Code, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function GitHubStatsPage() {
  const [gitHubStats, setGitHubStats] = useState({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    commitActivity: [] as Array<{
      total: number;
      week: number;
      days: number[];
    }>,
    languages: {} as Record<string, number>,
    topRepos: [] as Array<{
      id: number;
      name: string;
      description: string | null;
      html_url: string;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
    }>,
  });
  const [personalInfo, setPersonalInfo] = useState({
    github: "yourusername",
    name: "Your Name",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, personalResponse] = await Promise.all([
          fetch("/api/github-stats"),
          fetch("/api/personal-info"),
        ]);

        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setGitHubStats(stats);
        }

        if (personalResponse.ok) {
          const info = await personalResponse.json();
          setPersonalInfo(info);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const topLanguages = Object.entries(gitHubStats.languages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const totalLanguageBytes = Object.values(gitHubStats.languages || {}).reduce(
    (sum, bytes) => sum + bytes,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <Github className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-bold">
              GitHub Statistics
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            My open source contributions, repository statistics, and development
            activity.
          </motion.p>
        </div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Repositories
              </CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gitHubStats.totalRepos}</div>
              <p className="text-xs text-muted-foreground">
                Public repositories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stars</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gitHubStats.totalStars}</div>
              <p className="text-xs text-muted-foreground">Stars received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forks</CardTitle>
              <GitFork className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gitHubStats.totalForks}</div>
              <p className="text-xs text-muted-foreground">Repository forks</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Commit Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <GitHubChart
              commitActivity={gitHubStats.commitActivity}
              className="h-full"
            />
          </motion.div>

          {/* Language Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Programming Languages</CardTitle>
                <CardDescription>
                  Languages used across my repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topLanguages.map(([language, bytes]) => {
                    const percentage = (
                      (bytes / totalLanguageBytes) *
                      100
                    ).toFixed(1);
                    return (
                      <div key={language} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
                            <span className="font-medium">{language}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Top Repositories</span>
              </CardTitle>
              <CardDescription>
                Most starred repositories from my GitHub profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gitHubStats.topRepos.slice(0, 6).map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{repo.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center">
                          <GitFork className="w-3 h-3 mr-1" />
                          {repo.forks_count}
                        </span>
                        {repo.language && (
                          <Badge variant="secondary" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* GitHub Profile Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                View my complete GitHub profile for more repositories and
                contributions.
              </p>
              <a
                href={`https://github.com/${personalInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-primary hover:underline"
              >
                <Github className="w-4 h-4" />
                <span>Visit GitHub Profile</span>
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
