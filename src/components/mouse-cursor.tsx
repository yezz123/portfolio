"use client";

import { useEffect, useRef, useCallback } from "react";

export function MouseCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const handleMouseMove = useCallback((e: Event) => {
    const mouseEvent = e as MouseEvent;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseEvent.clientX - 12}px, ${mouseEvent.clientY - 12}px)`;
      }
    });
  }, []);

  useEffect(() => {
    // Only add cursor on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={cursorRef}
      className="hidden md:block fixed w-6 h-6 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference will-change-transform"
      style={{
        boxShadow: "0 0 20px hsl(var(--primary) / 0.5)",
        left: 0,
        top: 0,
      }}
    />
  );
}
