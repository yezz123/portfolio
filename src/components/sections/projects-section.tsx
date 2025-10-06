"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Project } from "@/lib/data";
import dynamic from "next/dynamic";

// Lazy load motion components to improve performance
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  },
);

// Create a client-only wrapper

const ClientOnlyMotionDiv = ({
  children,
  ...props
}: React.ComponentProps<typeof MotionDiv> & { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Filter out Framer Motion props for the fallback div
    const {
      initial,
      animate,
      whileInView,
      transition,
      viewport,
      style,
      onDrag,
      onDragStart,
      onDragEnd,
      onPan,
      onPanStart,
      onPanEnd,
      onAnimationStart,
      onAnimationComplete,
      onHoverStart,
      onHoverEnd,
      onTap,
      onTapStart,
      onTapCancel,
      ...divProps
    } = props;

    // Suppress unused variable warnings for destructured props
    void initial;
    void animate;
    void whileInView;
    void transition;
    void viewport;
    void style;
    void onDrag;
    void onDragStart;
    void onDragEnd;
    void onPan;
    void onPanStart;
    void onPanEnd;
    void onAnimationStart;
    void onAnimationComplete;
    void onHoverStart;
    void onHoverEnd;
    void onTap;
    void onTapStart;
    void onTapCancel;

    return <div {...divProps}>{children}</div>;
  }

  return <MotionDiv {...props}>{children}</MotionDiv>;
};

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects?pinned=true")
      .then((res) => res.json())
      .then((data) => {
        // Ensure we have an array
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected array but got:", data);
          setProjects([]);
        }
      })
      .catch((error) => {
        console.error("Error loading projects:", error);
        setProjects([]);
      });
  }, []);
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClientOnlyMotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Here are some of my favorite projects that showcase my skills and
            passion for development.
          </p>
        </ClientOnlyMotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ClientOnlyMotionDiv
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.imageAlt || `${project.name} project`}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.stars && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>⭐ {project.stars}</span>
                      {project.forks && <span>🍴 {project.forks}</span>}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button asChild className="flex-1">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
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
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </ClientOnlyMotionDiv>
          ))}
        </div>

        <ClientOnlyMotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <a href="/projects">View All Projects</a>
          </Button>
        </ClientOnlyMotionDiv>
      </div>
    </section>
  );
}
