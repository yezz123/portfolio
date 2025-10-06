"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, Github, Star, GitFork, Calendar } from "lucide-react";
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
import { Project } from "@/lib/data";

// Dynamically import motion components to prevent hydration issues
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  },
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const projectList = await response.json();
          setProjects(projectList);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Featured Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A selection of my most notable work and contributions
          </p>
        </MotionDiv>

        {/* Projects Grid */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <MotionDiv
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.imageAlt || `${project.name} project`}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            {project.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <CardDescription className="text-base">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    {project.stars && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {project.stars}
                        </span>
                        {project.forks && (
                          <span className="flex items-center gap-1">
                            <GitFork className="w-4 h-4" />
                            {project.forks}
                          </span>
                        )}
                        {project.updatedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </a>
                      </Button>
                      {project.githubUrl && (
                        <Button variant="outline" asChild>
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
