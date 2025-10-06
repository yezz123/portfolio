"use client";

import { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  category: "navigation" | "theme" | "search" | "utility";
  modifier?: "ctrl" | "cmd" | "alt" | "shift";
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const shortcuts: KeyboardShortcut[] = useMemo(
    () => [
      // Navigation shortcuts
      {
        key: "h",
        description: "Go to Home",
        action: () => router.push("/"),
        category: "navigation",
        modifier: "cmd",
      },
      {
        key: "b",
        description: "Go to Blog",
        action: () => router.push("/blog"),
        category: "navigation",
        modifier: "cmd",
      },
      {
        key: "p",
        description: "Go to Projects",
        action: () => router.push("/projects"),
        category: "navigation",
        modifier: "cmd",
      },
      {
        key: "a",
        description: "Go to About",
        action: () => router.push("/about"),
        category: "navigation",
        modifier: "cmd",
      },
      {
        key: "t",
        description: "Go to Talks",
        action: () => router.push("/talks"),
        category: "navigation",
        modifier: "cmd",
      },
      {
        key: "u",
        description: "Go to Uses",
        action: () => router.push("/uses"),
        category: "navigation",
        modifier: "cmd",
      },
      {
        key: "c",
        description: "Go to Contact",
        action: () => router.push("/contact"),
        category: "navigation",
        modifier: "cmd",
      },
      // Theme shortcuts
      {
        key: "d",
        description: "Toggle Dark Mode",
        action: () => setTheme(theme === "dark" ? "light" : "dark"),
        category: "theme",
        modifier: "cmd",
      },
      {
        key: "l",
        description: "Light Mode",
        action: () => setTheme("light"),
        category: "theme",
        modifier: "cmd",
      },
      {
        key: "shift+d",
        description: "Dark Mode",
        action: () => setTheme("dark"),
        category: "theme",
        modifier: "cmd",
      },
      // Utility shortcuts
      {
        key: "k",
        description: "Show Keyboard Shortcuts",
        action: () => {
          // This will be handled by the parent component
          window.dispatchEvent(new CustomEvent("toggle-shortcuts-modal"));
        },
        category: "utility",
        modifier: "cmd",
      },
      {
        key: "escape",
        description: "Close Modals",
        action: () => {
          window.dispatchEvent(new CustomEvent("close-modals"));
        },
        category: "utility",
      },
      {
        key: "g",
        description: "Go to GitHub",
        action: () => window.open("https://github.com/yourusername", "_blank"),
        category: "utility",
        modifier: "cmd",
      },
      {
        key: "shift+g",
        description: "Go to GitHub Profile",
        action: () => window.open("https://github.com/yourusername", "_blank"),
        category: "utility",
        modifier: "cmd",
      },
    ],
    [router, setTheme, theme],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if we're in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdKey = isMac ? event.metaKey : event.ctrlKey;
      const altKey = event.altKey;
      const shiftKey = event.shiftKey;

      // Build the key combination
      let keyCombo = event.key.toLowerCase();
      if (cmdKey) keyCombo = `cmd+${keyCombo}`;
      if (altKey) keyCombo = `alt+${keyCombo}`;
      if (shiftKey) keyCombo = `shift+${keyCombo}`;

      // Find matching shortcut
      const shortcut = shortcuts.find((shortcut) => {
        let shortcutKey = shortcut.key.toLowerCase();
        if (shortcut.modifier === "cmd") {
          shortcutKey = `cmd+${shortcutKey}`;
          if (shortcut.key.includes("shift")) {
            shortcutKey = shortcutKey.replace("shift+", "cmd+shift+");
          }
        }
        return shortcutKey === keyCombo;
      });

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}
