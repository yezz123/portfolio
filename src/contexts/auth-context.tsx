"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  supabase,
  onAuthStateChange,
  signInWithGitHub as supabaseSignInWithGitHub,
  signOut as supabaseSignOut,
} from "@/lib/supabase-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Also listen for storage changes (when auth happens in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key ===
        "sb-" +
          process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] +
          "-auth-token"
      ) {
        getInitialSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const signInWithGitHub = async () => {
    const { error } = await supabaseSignInWithGitHub();
    if (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const signOut = async () => {
    const { error } = await supabaseSignOut();
    if (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const value = {
    user,
    loading,
    signInWithGitHub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
