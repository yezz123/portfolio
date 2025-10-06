"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { trackResumeDownload } from "@/lib/analytics";

export function ResumeDownload() {
  const handleDownloadResume = () => {
    // Google Docs export URL for PDF
    const googleDocId = "18JKFzH1atSveH-NF0Pz6VJSEaNjoKgr2ClcPVji9QVA";
    const exportUrl = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;

    // Track resume download
    trackResumeDownload();

    // Open in new tab for download
    window.open(exportUrl, "_blank");
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      <Button
        onClick={handleDownloadResume}
        className="flex items-center gap-2 relative overflow-hidden group"
        size="lg"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Download className="w-4 h-4" />
        </motion.div>
        Download Resume
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <FileText className="w-4 h-4" />
        </motion.div>
      </Button>
    </motion.div>
  );
}
