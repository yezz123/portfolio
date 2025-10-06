"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { XIcon } from "@/components/ui/x-icon";
import { PersonalInfo } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [navigationItems, setNavigationItems] = useState<
    Array<{ name: string; href: string; icon: string }>
  >([]);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personalResponse, navResponse] = await Promise.all([
          fetch("/api/personal-info"),
          fetch("/api/navigation"),
        ]);

        if (personalResponse.ok) {
          const personal = await personalResponse.json();
          setPersonalInfo(personal);
        }

        if (navResponse.ok) {
          const navItems = await navResponse.json();
          setNavigationItems(navItems);
        }
      } catch (error) {
        console.error("Error loading navigation data:", error);
      }
    };
    loadData();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Focus first menu item when menu opens
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
        { name: "Email", href: `mailto:${personalInfo.email}`, icon: Mail },
      ]
    : [];

  return (
    <nav
      className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50"
      style={{ contain: "layout style" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              animate={{
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/icon.svg"
                alt="Logo"
                width={32}
                height={32}
                className="w-12 h-12 object-contain"
              />
            </motion.div>
            <span className="font-bold text-xl">
              {personalInfo?.name || "Portfolio"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("toggle-shortcuts-modal"))
              }
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4" />
            </Button>
            <ThemeToggle />
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <Button
            ref={menuButtonRef}
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border"
              role="menu"
              aria-labelledby="mobile-menu-button"
            >
              <div className="py-4 space-y-4">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.name}
                    ref={index === 0 ? firstMenuItemRef : undefined}
                    href={item.href}
                    className={cn(
                      "block text-base font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                    tabIndex={0}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <Link
                          key={social.name}
                          href={social.href}
                          className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
                          aria-label={social.name}
                        >
                          <Icon className="w-5 h-5" />
                        </Link>
                      );
                    })}
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
