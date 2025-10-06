"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Github, Mail, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/ui/x-icon";
import { PersonalInfo } from "@/lib/data";
import Image from "next/image";

export function HeroSection() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);

  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const response = await fetch("/api/personal-info");
        if (response.ok) {
          const info = await response.json();
          setPersonalInfo(info);
        }
      } catch (error) {
        console.error("Error loading personal info:", error);
      }
    };
    loadPersonalInfo();
  }, []);

  if (!personalInfo) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  const socialLinks = [
    {
      name: "GitHub",
      href: `https://github.com/${personalInfo.github}`,
      icon: Github,
    },
    { name: "Email", href: `mailto:${personalInfo.email}`, icon: Mail },
    {
      name: "LinkedIn",
      href: `https://linkedin.com/in/${personalInfo.linkedin}`,
      icon: Linkedin,
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/${personalInfo.twitter}`,
      icon: XIcon,
    },
  ];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 z-0 w-full h-full"
        style={{ contain: "layout style" }}
      >
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mx-auto flex items-center justify-center"
            role="img"
            aria-label="Portfolio logo"
          >
            <motion.div
              animate={{
                rotate: [0, 3, -3, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/icon.svg"
                alt="Yasser Tahiri Portfolio Logo"
                className="w-32 h-32 object-contain"
                width={128}
                height={128}
                priority
                sizes="(max-width: 768px) 100px, 128px"
                style={{ width: "180px", height: "180px" }}
              />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.h1
              animate={{
                rotate: [0, 2, -2, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-5xl md:text-7xl font-bold text-foreground"
              id="main-heading"
            >
              {personalInfo.name}
            </motion.h1>
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden lg:block"
            >
              <Image
                src="/icons/wave.png"
                alt="Waving hand emoji"
                width={60}
                height={60}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
                priority
                sizes="(max-width: 1024px) 48px, 64px"
                style={{ width: "auto", height: "auto" }}
              />
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            {personalInfo.title}
          </motion.h2>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {personalInfo.bio}
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center space-x-4"
          >
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.name}
                  variant="outline"
                  size="sm"
                  asChild
                  className="rounded-full"
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                </Button>
              );
            })}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <a href="/projects" aria-label="View featured projects">
                View My Work
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/about" aria-label="Learn more about Yasser Tahiri">
                Learn More
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center space-y-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
