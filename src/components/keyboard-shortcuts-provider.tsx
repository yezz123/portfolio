"use client";

import { useState, useEffect } from "react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { KeyboardShortcutsModal } from "@/components/keyboard-shortcuts-modal";

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
}

export function KeyboardShortcutsProvider({
  children,
}: KeyboardShortcutsProviderProps) {
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const shortcuts = useKeyboardShortcuts();

  useEffect(() => {
    const handleToggleShortcutsModal = () => {
      setIsShortcutsModalOpen((prev) => !prev);
    };

    const handleCloseModals = () => {
      setIsShortcutsModalOpen(false);
    };

    window.addEventListener(
      "toggle-shortcuts-modal",
      handleToggleShortcutsModal,
    );
    window.addEventListener("close-modals", handleCloseModals);

    return () => {
      window.removeEventListener(
        "toggle-shortcuts-modal",
        handleToggleShortcutsModal,
      );
      window.removeEventListener("close-modals", handleCloseModals);
    };
  }, []);

  return (
    <>
      {children}
      <KeyboardShortcutsModal
        shortcuts={shortcuts}
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </>
  );
}
