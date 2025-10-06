"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";

interface KeyboardShortcutsModalProps {
  shortcuts: KeyboardShortcut[];
  isOpen: boolean;
  onClose: () => void;
}

const categoryIcons = {
  navigation: "🧭",
  theme: "🎨",
  search: "🔍",
  utility: "⚙️",
};

const categoryNames = {
  navigation: "Navigation",
  theme: "Theme",
  search: "Search",
  utility: "Utility",
};

export function KeyboardShortcutsModal({
  shortcuts,
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    },
    {} as Record<string, KeyboardShortcut[]>,
  );

  const formatKeyCombo = (shortcut: KeyboardShortcut) => {
    const keys = [];

    if (shortcut.modifier === "cmd") {
      keys.push(isMac ? "⌘" : "Ctrl");
    }
    if (shortcut.modifier === "alt") {
      keys.push(isMac ? "⌥" : "Alt");
    }
    if (shortcut.modifier === "shift") {
      keys.push("⇧");
    }

    // Handle special keys
    const key = shortcut.key.toLowerCase();
    if (key === "escape") {
      keys.push("Esc");
    } else if (key === " ") {
      keys.push("Space");
    } else {
      keys.push(key.toUpperCase());
    }

    return keys;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {Object.entries(groupedShortcuts).map(
            ([category, categoryShortcuts]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <span className="text-lg">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </span>
                  <h3 className="text-lg font-semibold">
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h3>
                </div>

                <div className="grid gap-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {shortcut.description}
                      </span>

                      <div className="flex items-center gap-1">
                        {formatKeyCombo(shortcut).map((key, keyIndex) => (
                          <div
                            key={keyIndex}
                            className="flex items-center gap-1"
                          >
                            {keyIndex > 0 && (
                              <span className="text-muted-foreground text-xs">
                                +
                              </span>
                            )}
                            <Badge
                              variant="secondary"
                              className="text-xs font-mono px-2 py-1"
                            >
                              {key}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Press{" "}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Esc</kbd> to
            close
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
