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
import { MapPin, Mail, Github, Linkedin, X } from "lucide-react";
import { XIcon } from "@/components/ui/x-icon";
import { PersonalInfo, WorkExperience } from "@/lib/data";
import { safeDateRangeFormat } from "@/lib/utils";
import { ResumeDownload } from "@/components/resume-download";
import { SpotifyClient } from "@/components/spotify-client";
import Image from "next/image";

export default function AboutPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    "/images/about/avatar.jpeg",
    "/images/about/image.jpeg",
    "/images/about/image2.jpeg",
    "/images/about/imag3.jpeg",
  ];

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

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % galleryImages.length,
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [galleryImages.length]);

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

        {/* Bio Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Avatar and Floating Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-1 flex justify-center relative"
            >
              {/* Main Avatar */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="relative w-full max-w-sm lg:max-w-2xl mx-auto z-10 hidden lg:block"
              >
                {/* Animated Border Container */}
                <div className="relative rounded-3xl p-[1px]">
                  {/* Image Container */}
                  <motion.div
                    animate={{
                      x: [0, 2, -2, 1, -1, 0],
                      y: [0, -1, 1, -1, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="rounded-3xl overflow-hidden shadow-0xl bg-background aspect-[4/3]"
                  >
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={galleryImages[currentImageIndex]}
                        alt="Gallery Image"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover rounded-2xl cursor-pointer"
                        priority
                        onClick={() =>
                          setSelectedImage(galleryImages[currentImageIndex])
                        }
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Image indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-primary w-6"
                          : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
                />
                <motion.div
                  animate={{
                    y: [0, 8, 0],
                    opacity: [0.2, 0.6, 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary/30 rounded-full blur-sm"
                />
              </motion.div>

              {/* Mobile: Simple Avatar Display */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="lg:hidden flex justify-center"
              >
                <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={galleryImages[0]}
                    alt="Profile Picture"
                    fill
                    className="object-cover"
                    onClick={() => setSelectedImage(galleryImages[0])}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="lg:col-span-2 mt-8 lg:mt-0"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {personalInfo.bioLong
                      .split("\n")
                      .map((paragraph, index) => (
                        <motion.p
                          key={index}
                          className="mb-4 text-base leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 0.7 + index * 0.1,
                          }}
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Mobile Gallery - Below About Me */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-16 lg:hidden"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Moments & Memories</h2>
            <p className="text-muted-foreground text-sm">
              Tap on images to view them in detail
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Image Modal */}
        <AnimatePresence mode="wait">
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative max-w-5xl max-h-[95vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-12 right-0 text-white hover:bg-white/20 z-10"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
                  <Image
                    src={selectedImage}
                    alt="Selected Image"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
    </div>
  );
}
