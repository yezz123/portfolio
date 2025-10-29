"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Github, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AuthButton() {
  const { user, loading, signInWithGitHub, signOut } = useAuth();

  if (loading) {
    return (
      <Button disabled>
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user.user_metadata?.name?.charAt(0) || user.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Button variant="ghost" onClick={signOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" onClick={signInWithGitHub}>
      <Github className="w-4 h-4 mr-2" />
      Sign in with GitHub
    </Button>
  );
}
