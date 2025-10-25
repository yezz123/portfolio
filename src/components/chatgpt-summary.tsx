"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, X, Bot, Shield } from "lucide-react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { toast } from "sonner";

interface ChatGPTSummaryProps {
  content: string;
  title: string;
  className?: string;
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

export function ChatGPTSummary({
  content,
  title,
  className = "",
}: ChatGPTSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const handleTurnstileChange = (token: string | null) => {
    setTurnstileToken(token);
  };

  const resetTurnstile = () => {
    if (turnstileRef.current) {
      turnstileRef.current.reset();
      setTurnstileToken(null);
    }
  };

  const handleGenerateSummary = async () => {
    // Check if Turnstile is completed
    if (!turnstileToken) {
      toast.error("Please complete the verification");
      setShowTurnstile(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chatgpt/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          title,
          type: "blog",
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate summary");
      }

      const data: SummaryResponse = await response.json();
      setSummary(data.summary);
      setIsExpanded(true);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate summary",
      );
      // Reset Turnstile on error
      resetTurnstile();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSummary(null);
    setError(null);
    setShowTurnstile(false);
    resetTurnstile();
  };

  return (
    <div className={`chatgpt-summary ${className}`}>
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <Button
              onClick={handleGenerateSummary}
              disabled={isLoading}
              variant="outline"
              className="w-full justify-center gap-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Summarize with ChatGPT
                </>
              )}
            </Button>

            {/* Turnstile Widget */}
            {showTurnstile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-2"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Please verify you're human to continue</span>
                </div>
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={handleTurnstileChange}
                  onError={() => setTurnstileToken(null)}
                  onExpire={() => setTurnstileToken(null)}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (summary || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-lg">AI Summary</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      ChatGPT
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    <p className="font-medium mb-2">
                      Error generating summary:
                    </p>
                    <p>{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSummary}
                      className="mt-3"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {summary}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-purple-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Generated by AI • May not be 100% accurate
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowTurnstile(true);
                          resetTurnstile();
                          handleGenerateSummary();
                        }}
                        className="text-xs"
                      >
                        Regenerate
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
