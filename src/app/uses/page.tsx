"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UsesItem } from "@/lib/data";
import Image from "next/image";

export default function UsesPage() {
  const [deskItems, setDeskItems] = useState<UsesItem[]>([]);
  const [homeItems, setHomeItems] = useState<UsesItem[]>([]);
  const [toolsItems, setToolsItems] = useState<UsesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deskResponse, homeResponse, toolsResponse] = await Promise.all([
          fetch("/api/uses?category=desk"),
          fetch("/api/uses?category=home"),
          fetch("/api/uses?category=tools"),
        ]);

        if (deskResponse.ok) {
          const desk = await deskResponse.json();
          setDeskItems(desk);
        }

        if (homeResponse.ok) {
          const home = await homeResponse.json();
          setHomeItems(home);
        }

        if (toolsResponse.ok) {
          const tools = await toolsResponse.json();
          setToolsItems(tools);
        }
      } catch (error) {
        console.error("Error loading uses data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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

  const categories = [
    { name: "Desk Setup", items: deskItems, icon: "💻" },
    { name: "Home Setup", items: homeItems, icon: "🏠" },
    { name: "Tools & Apps", items: toolsItems, icon: "🛠️" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            What I Use
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            My setup, tools, and everything I use for development and
            productivity.
          </motion.p>
        </div>

        {/* Office Setup Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex justify-center">
            <div
              className="relative w-full max-w-4xl cursor-pointer group"
              onClick={() => setIsImageModalOpen(true)}
            >
              <Image
                src="/images/uses/office.png"
                alt="Office Setup"
                width={800}
                height={600}
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

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-8">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {category.name}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: categoryIndex * 0.1 + itemIndex * 0.05,
                    }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <CardTitle className="text-lg">
                                {item.url ? (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                  >
                                    {item.name}
                                  </a>
                                ) : (
                                  item.name
                                )}
                              </CardTitle>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {categoryIndex < categories.length - 1 && (
                <Separator className="mt-12" />
              )}
            </motion.section>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                This page is inspired by{" "}
                <a
                  href="https://uses.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  uses.tech
                </a>
                . Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
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
                  src="/images/uses/office.png"
                  alt="Office Setup - Full Size"
                  width={1200}
                  height={900}
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
