"use client";

import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCalBooking } from "@/lib/analytics";
import dynamic from "next/dynamic";

// Lazy load motion components
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  },
);
const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  {
    ssr: false,
  },
);

interface CalBadgeProps {
  calUsername: string;
  eventTypeId?: string;
  className?: string;
}

export function CalBadge({
  calUsername,
  eventTypeId,
  className = "",
}: CalBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load Cal.com after user interaction to improve performance
    if (isOpen && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isOpen, isLoaded]);

  const calUrl = eventTypeId
    ? `https://cal.com/${calUsername}/${eventTypeId}`
    : `https://cal.com/${calUsername}`;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Floating Action Button */}
      <MotionDiv
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <MotionDiv
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={() => {
              setIsOpen(true);
              trackCalBooking();
            }}
            size="lg"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book a Call
          </Button>
        </MotionDiv>
      </MotionDiv>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsOpen(false)}
          >
            <MotionDiv
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Schedule a Meeting</h3>
                </div>
                <MotionDiv
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </MotionDiv>
              </div>

              {/* Cal.com Embed */}
              <div className="p-4">
                {isLoaded ? (
                  <iframe
                    src={`https://cal.com/${calUsername}?embed=true&theme=light`}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    title="Cal.com Booking"
                    className="rounded-lg"
                    loading="lazy"
                    allow="camera; microphone; clipboard-write"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>

              {/* Alternative Link */}
              <div className="p-4 border-t bg-muted/30">
                <p className="text-sm text-muted-foreground text-center mb-2">
                  Having trouble with the embedded calendar?
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={calUrl} target="_blank" rel="noopener noreferrer">
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simplified version for inline use
export function CalInlineButton({
  calUsername,
  eventTypeId,
  children,
}: CalBadgeProps & { children?: React.ReactNode }) {
  const calUrl = eventTypeId
    ? `https://cal.com/${calUsername}/${eventTypeId}`
    : `https://cal.com/${calUsername}`;

  return (
    <Button asChild variant="outline">
      <a href={calUrl} target="_blank" rel="noopener noreferrer">
        <Calendar className="w-4 h-4 mr-2" />
        {children || "Book a Call"}
      </a>
    </Button>
  );
}
