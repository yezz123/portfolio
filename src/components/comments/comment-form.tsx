"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { AuthButton } from "@/components/auth/auth-button";
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
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    if (!user.id) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          blogId,
          parentId,
          userId: user.id,
          userEmail: user.email,
          userName: user.user_metadata?.name || user.user_metadata?.full_name,
          userAvatar: user.user_metadata?.avatar_url,
        }),
      });

      if (response.ok) {
        setContent("");
        onCommentAdded();
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
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
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim() || isSubmitting}>
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
