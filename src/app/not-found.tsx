"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-8xl font-bold text-primary mb-4"
          >
            404
          </motion.div>

          {/* Error Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl font-bold mb-4"
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-muted-foreground mb-8"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 p-4 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center justify-center mb-2">
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">
                Looking for something?
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Try visiting our{" "}
              <Link href="/blog" className="text-primary hover:underline">
                blog
              </Link>
              ,{" "}
              <Link href="/projects" className="text-primary hover:underline">
                projects
              </Link>
              , or{" "}
              <Link href="/about" className="text-primary hover:underline">
                about page
              </Link>
              .
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
