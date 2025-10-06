"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ThumbsDown,
  ThumbsUp,
  Facebook,
  Twitter,
  Link,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogInteractionsProps {
  blogId: string;
  initialLikes: number;
  initialDislikes: number;
  blogTitle: string;
  blogUrl: string;
}

export function BlogInteractions({
  blogId,
  initialLikes,
  initialDislikes,
  blogTitle,
  blogUrl,
}: BlogInteractionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleReaction = async (action: "like" | "dislike") => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/${blogId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        if (action === "like") {
          setLikes(likes + 1);
          toast.success("Thanks for the like! 👍");
        } else {
          setDislikes(dislikes + 1);
          toast.success("Feedback received! 👎");
        }
      } else {
        toast.error("Failed to update reaction");
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(blogUrl);
    const encodedTitle = encodeURIComponent(blogTitle);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "reddit":
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case "copy":
        navigator.clipboard.writeText(blogUrl);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="py-8 border-t border-border">
      <div className="flex items-center justify-between">
        {/* Like/Dislike Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReaction("like")}
            disabled={isLoading}
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 hover:text-green-700 dark:hover:bg-green-950 dark:hover:border-green-800 dark:hover:text-green-300"
          >
            <motion.div
              animate={{ scale: isLoading ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              <ThumbsUp className="w-4 h-4" />
            </motion.div>
            {likes}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReaction("dislike")}
            disabled={isLoading}
            className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-300"
          >
            <motion.div
              animate={{ scale: isLoading ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              <ThumbsDown className="w-4 h-4" />
            </motion.div>
            {dislikes}
          </Button>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Share:</span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("facebook")}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:border-blue-800 dark:hover:text-blue-300"
          >
            <Facebook className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:border-blue-800 dark:hover:text-blue-300"
          >
            <Twitter className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("reddit")}
            className="flex items-center gap-2 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 dark:hover:bg-orange-950 dark:hover:border-orange-800 dark:hover:text-orange-300"
          >
            <Globe className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("copy")}
            className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700 dark:hover:bg-gray-950 dark:hover:border-gray-800 dark:hover:text-gray-300"
          >
            <Link className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
