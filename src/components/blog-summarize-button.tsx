"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Bot, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

interface BlogSummarizeButtonProps {
  blogSlug: string;
  content: string;
  title: string;
}

interface SummaryResponse {
  summary: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export function BlogSummarizeButton({
  blogSlug,
  content,
  title,
}: BlogSummarizeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    const cachedSummary = sessionStorage.getItem(`summary-${blogSlug}`);
    if (cachedSummary) {
      try {
        const parsed = JSON.parse(cachedSummary);
        setSummary(parsed.summary);
      } catch {
        // Invalid cache, ignore
      }
    }
  }, [blogSlug]);

  const handleClose = useCallback(() => {
    setShowCard(false);
  }, []);

  // Keyboard shortcuts to close the card
  useEffect(() => {
    if (!showCard) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "q" || event.key === "Q") {
        // Don't close if user is typing in an input/textarea
        const target = event.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable
        ) {
          return;
        }
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCard, handleClose]);

  const handleTurnstileChange = (token: string | null) => {
    setTurnstileToken(token);
    // Auto-trigger summary generation when Turnstile completes
    if (token && showTurnstile && !isLoading) {
      generateSummary(token);
    }
  };

  const generateSummary = async (token?: string | null) => {
    const activeToken = token ?? turnstileToken;

    setIsLoading(true);
    setError(null);

    try {
      const requestBody: {
        content: string;
        title: string;
        type: string;
        turnstileToken?: string;
      } = {
        content,
        title,
        type: "blog",
      };

      if (activeToken) {
        requestBody.turnstileToken = activeToken;
      }

      const response = await fetch("/api/chatgpt/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const data: SummaryResponse = await response.json();

      // Cache in sessionStorage
      sessionStorage.setItem(
        `summary-${blogSlug}`,
        JSON.stringify({
          summary: data.summary,
          timestamp: Date.now(),
        }),
      );

      setSummary(data.summary);
      setShowTurnstile(false);
      resetTurnstile();
    } catch (err) {
      console.error("Error generating summary:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate summary",
      );
      toast.error("Failed to generate summary. Please try again.");
      resetTurnstile();
    } finally {
      setIsLoading(false);
    }
  };

  const resetTurnstile = () => {
    if (turnstileRef.current) {
      turnstileRef.current.reset();
      setTurnstileToken(null);
    }
  };

  const handleGenerateSummary = async () => {
    setShowCard(true);

    // Check if already cached in session
    const cachedSummary = sessionStorage.getItem(`summary-${blogSlug}`);
    if (cachedSummary) {
      try {
        const parsed = JSON.parse(cachedSummary);
        setSummary(parsed.summary);
        return;
      } catch {
        // Invalid cache, continue to generate
      }
    }

    // Check if Turnstile is required and not completed
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setShowTurnstile(true);
      return;
    }

    // If we have token or don't need it, generate summary
    generateSummary();
  };

  return (
    <>
      <Button
        onClick={handleGenerateSummary}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="gap-2 text-sm bg-transparent border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            Summarizing...
          </>
        ) : summary ? (
          <>
            <Sparkles className="w-3 h-3" />
            Show Summary
          </>
        ) : (
          <>
            <Sparkles className="w-3 h-3" />
            Summarize
          </>
        )}
      </Button>

      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 w-full"
          >
            <div className="w-full rounded-2xl border border-black/15 dark:border-white/10 bg-white/70 dark:bg-white/10 backdrop-blur-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Summary
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-transparent text-gray-900 dark:text-white border border-black/15 dark:border-white/15"
                  >
                    ChatGPT
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 hover:bg-white/10 dark:hover:bg-white/10 text-gray-700 dark:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="pt-4">
                {showTurnstile && !turnstileToken ? (
                  <div className="flex flex-col items-center py-4 space-y-3">
                    <p className="text-sm text-gray-800 dark:text-gray-100 text-center">
                      Please complete the verification to generate summary
                    </p>
                    {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                        onSuccess={handleTurnstileChange}
                        onError={() => setTurnstileToken(null)}
                        onExpire={() => setTurnstileToken(null)}
                      />
                    )}
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-3">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                      <p className="text-sm text-gray-800 dark:text-gray-100">
                        Generating summary...
                      </p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-gray-900 dark:text-white text-sm">
                    <p className="font-semibold mb-2">
                      Error generating summary:
                    </p>
                    <p>{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError(null);
                        setShowTurnstile(
                          !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
                        );
                        setTurnstileToken(null);
                        resetTurnstile();
                      }}
                      className="mt-3 border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : summary ? (
                  <div className="space-y-3">
                    <p className="text-base leading-relaxed text-gray-900 dark:text-gray-100">
                      {summary}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10">
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Generated by AI • May not be 100% accurate
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
