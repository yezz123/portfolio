"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentForm } from "./comment-form";
import { Reply } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  blogId: string;
  onCommentAdded: () => void;
}

export function CommentItem({
  comment,
  blogId,
  onCommentAdded,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user } = useAuth();

  const isAuthor = user?.id === comment.user.id;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback>
            {comment.user.name?.charAt(0) || comment.user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {comment.user.name || comment.user.email}
            </span>
            {isAuthor && (
              <Badge variant="secondary" className="text-xs">
                Author
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-xs"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-11">
          <CommentForm
            blogId={blogId}
            parentId={comment.id}
            onCommentAdded={() => {
              setShowReplyForm(false);
              onCommentAdded();
            }}
            placeholder={`Reply to ${comment.user.name || comment.user.email}...`}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              blogId={blogId}
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
