"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { AuthButton } from "@/components/auth/auth-button";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { Send } from "lucide-react";

interface CommentFormProps {
  blogId: string;
  parentId?: string;
  onCommentAdded: () => void;
  placeholder?: string;
}

export function CommentForm({
  blogId,
  parentId,
  onCommentAdded,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const { user } = useAuth();

  const handleTurnstileChange = (token: string | null) => {
    setTurnstileToken(token);
  };

  const resetTurnstile = () => {
    if (turnstileRef.current) {
      turnstileRef.current.reset();
      setTurnstileToken(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    // Require Turnstile token only if Turnstile is configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      return;
    }

    if (!user.id) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate all required fields before sending
      const requestBody = {
        content: content.trim(),
        blogId,
        ...(parentId && { parentId }),
        userId: user.id,
        userEmail: user.email,
        userName: user.user_metadata?.name || user.user_metadata?.full_name,
        userAvatar: user.user_metadata?.avatar_url,
        ...(turnstileToken && { turnstileToken }),
      };

      // Double-check all required fields
      if (!requestBody.content || !requestBody.blogId || !requestBody.userId) {
        console.error("Missing required fields:", {
          content: !!requestBody.content,
          blogId: !!requestBody.blogId,
          userId: !!requestBody.userId,
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setContent("");
        resetTurnstile();
        onCommentAdded();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Failed to add comment:",
          errorData.error || "Unknown error",
        );
        resetTurnstile();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-3">
          Please sign in with GitHub to leave a comment.
        </p>
        <AuthButton />
      </div>
    );
  }

  // Additional check for user ID
  if (!user.id) {
    return (
      <div className="p-4 border rounded-lg bg-muted/50">
        <p className="text-sm text-muted-foreground mb-3">
          Authentication error. Please try signing in again.
        </p>
        <AuthButton />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[100px]"
        disabled={isSubmitting}
      />

      {/* Turnstile */}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <div className="flex flex-col items-center py-3">
          <p className="text-sm text-muted-foreground mb-2">
            Please complete the verification to submit your comment
          </p>
          <div className="flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={handleTurnstileChange}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            !content.trim() ||
            (!turnstileToken && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) ||
            isSubmitting
          }
        >
          {isSubmitting ? (
            "Posting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {parentId ? "Reply" : "Comment"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
