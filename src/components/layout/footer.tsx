"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart, Gamepad2 } from "lucide-react";
import { PersonalInfo } from "@/lib/data";
import { loadConfig } from "@/lib/yaml-loader";
import Image from "next/image";
import { XIcon } from "@/components/ui/x-icon";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterConfig {
  copyright?: string;
  madeWith?: string;
  pages?: FooterLink[];
  resources?: FooterLink[];
}

export function Footer() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load personal info
        const personalResponse = await fetch("/api/personal-info");
        if (personalResponse.ok) {
          const info = await personalResponse.json();
          setPersonalInfo(info);
        }

        // Load footer config
        const config = await loadConfig();
        setFooterConfig(config.footer || null);
      } catch (error) {
        console.error("Error loading footer data:", error);
      }
    };
    loadData();
  }, []);

  const socialLinks = personalInfo
    ? [
        {
          name: "GitHub",
          href: `https://github.com/${personalInfo.github}`,
          icon: Github,
        },
        {
          name: "X (Twitter)",
          href: `https://twitter.com/${personalInfo.twitter}`,
          icon: XIcon,
        },
        {
          name: "LinkedIn",
          href: `https://linkedin.com/in/${personalInfo.linkedin}`,
          icon: Linkedin,
        },
        ...(personalInfo.steam
          ? [
              {
                name: "Steam",
                href: `https://steamcommunity.com/id/${personalInfo.steam}`,
                icon: Gamepad2,
              },
            ]
          : []),
        { name: "Email", href: `mailto:${personalInfo.email}`, icon: Mail },
      ]
    : [];

  const footerLinks: { pages: FooterLink[]; resources: FooterLink[] } =
    footerConfig
      ? {
          pages: footerConfig.pages || [],
          resources: footerConfig.resources || [],
        }
      : {
          pages: [
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: "Projects", href: "/projects" },
            { name: "Blog", href: "/blog" },
            { name: "Talks", href: "/talks" },
          ],
          resources: [
            { name: "OSS", href: "/oss" },
            { name: "Uses", href: "/uses" },
            { name: "Tags", href: "/tags" },
            { name: "Contact", href: "/contact" },
          ],
        };
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div
                animate={{
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/icon.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </motion.div>
              <span className="font-bold text-xl">
                {personalInfo?.name || "Portfolio"}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {personalInfo?.bio ||
                "Full Stack Developer passionate about creating amazing digital experiences with modern technologies. Building the future, one line of code at a time."}
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              {footerLinks.pages.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {personalInfo?.name || "Portfolio"}.{" "}
            {footerConfig?.copyright || "All rights reserved."}
          </p>
          <p className="text-muted-foreground text-sm flex items-center mt-2 md:mt-0">
            {footerConfig?.madeWith || (
              <>
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> using
                Next.js
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
