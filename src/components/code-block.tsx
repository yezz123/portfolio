"use client";

import { useEffect } from "react";

export function CodeBlockScript() {
  useEffect(() => {
    const handleCopyClick = (button: HTMLButtonElement) => {
      const code = decodeURIComponent(button.getAttribute("data-code") || "");
      navigator.clipboard
        .writeText(code)
        .then(() => {
          const originalText = button.textContent;
          button.textContent = "Copied!";
          button.classList.add(
            "bg-green-100",
            "text-green-800",
            "dark:bg-green-900",
            "dark:text-green-300",
          );
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove(
              "bg-green-100",
              "text-green-800",
              "dark:bg-green-900",
              "dark:text-green-300",
            );
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy code:", err);
          const originalText = button.textContent;
          button.textContent = "Failed!";
          button.classList.add(
            "bg-red-100",
            "text-red-800",
            "dark:bg-red-900",
            "dark:text-red-300",
          );
          setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove(
              "bg-red-100",
              "text-red-800",
              "dark:bg-red-900",
              "dark:text-red-300",
            );
          }, 2000);
        });
    };

    // Add event listeners to all copy buttons
    const copyButtons = document.querySelectorAll(".code-block-copy");
    copyButtons.forEach((button) => {
      button.addEventListener("click", () =>
        handleCopyClick(button as HTMLButtonElement),
      );
    });

    // Cleanup function
    return () => {
      copyButtons.forEach((button) => {
        button.removeEventListener("click", () =>
          handleCopyClick(button as HTMLButtonElement),
        );
      });
    };
  }, []);

  return null;
}
