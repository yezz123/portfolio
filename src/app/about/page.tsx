"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Github, Linkedin } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { PersonalInfo, WorkExperience } from "@/lib/data";
import { safeDateRangeFormat } from "@/lib/utils";
import { ResumeDownload } from "@/components/resume-download";
import { SpotifyClient } from "@/components/spotify-client";
import Image from "next/image";

export default function AboutPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [personalResponse, workResponse] = await Promise.all([
        fetch("/api/personal-info"),
        fetch("/api/work-experience"),
      ]);

      if (personalResponse.ok) {
        const personal = await personalResponse.json();
        setPersonalInfo(personal);
      }

      if (workResponse.ok) {
        const work = await workResponse.json();
        setWorkExperience(work);
      }
    };
    loadData();
  }, []);

  if (!personalInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const socialLinks = [
    {
      name: "Email",
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      displayText: personalInfo.email,
    },
    {
      name: "GitHub",
      href: `https://github.com/${personalInfo.github}`,
      icon: Github,
      displayText: `@${personalInfo.github}`,
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/${personalInfo.twitter}`,
      icon: XIcon,
      displayText: `@${personalInfo.twitter}`,
    },
    {
      name: "LinkedIn",
      href: `https://linkedin.com/in/${personalInfo.linkedin}`,
      icon: Linkedin,
      displayText: `@${personalInfo.linkedin}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3"
          >
            {personalInfo.name}
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block hidden lg:block"
            >
              <Image
                src="/icons/wave.png"
                alt="Wave"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
            </motion.div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-6"
          >
            {personalInfo.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 text-muted-foreground"
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {personalInfo.location}
            </div>
            <div className="flex items-center">
              <SpotifyClient />
            </div>
          </motion.div>
        </div>

        {/* Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-6xl cursor-pointer group"
              onClick={() => setIsImageModalOpen(true)}
            >
              <Image
                src="/images/og/og.PNG"
                alt="About Banner"
                width={1200}
                height={630}
                className="rounded-lg shadow-lg w-full h-auto object-cover brightness-110 contrast-90 transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* About Me Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {personalInfo.bioLong.split("\n").map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className="mb-4 text-base leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.1,
                    }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Work Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Work Experience</h2>
          <div className="space-y-6">
            {workExperience.map((work, index) => (
              <motion.div
                key={work.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              >
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <Card className="cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">
                            {work.position}
                          </CardTitle>
                          <CardDescription className="text-lg font-medium flex items-center gap-3">
                            {work.logoUrl && (
                              <Image
                                src={work.logoUrl}
                                alt={`${work.company} logo`}
                                width={24}
                                height={24}
                                className="w-6 h-6 object-contain rounded-full"
                              />
                            )}
                            {work.url ? (
                              <a
                                href={work.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                {work.company}
                              </a>
                            ) : (
                              work.company
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>
                            {safeDateRangeFormat(work.startDate, work.endDate)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-base leading-relaxed">
                        {work.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {work.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Let&apos;s Connect</CardTitle>
              <CardDescription>
                I&apos;m always interested in new opportunities and
                collaborations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.div
                      key={social.name}
                      whileHover={{
                        scale: 1.02,
                        x: 5,
                      }}
                      whileTap={{
                        x: [0, -3, 3, -3, 0],
                        transition: { duration: 0.3 },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Button
                        variant="outline"
                        asChild
                        className="justify-start h-auto p-4 w-full"
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <motion.div
                            whileHover={{
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 0.5,
                            }}
                          >
                            <Icon className="w-5 h-5 mr-3" />
                          </motion.div>
                          <div>
                            <div className="font-medium">{social.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {social.displayText}
                            </div>
                          </div>
                        </a>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center"
        >
          <ResumeDownload />
        </motion.div>
      </div>

      {/* Image Modal/Lightbox */}
      <AnimatePresence>
        {isImageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageModalOpen(false)}
          >
            {/* Transparent backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Image
                  src="/images/og/og.PNG"
                  alt="About Banner - Full Size"
                  width={1200}
                  height={630}
                  quality={85}
                  className="rounded-lg shadow-2xl w-full h-auto object-contain max-h-[90vh]"
                  priority
                />

                {/* Close button */}
                <button
                  onClick={() => setIsImageModalOpen(false)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 backdrop-blur-sm"
                  aria-label="Close image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
