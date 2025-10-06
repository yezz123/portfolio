"use client";

import { sendGAEvent } from "@next/third-parties/google";

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>,
) => {
  try {
    if (parameters) {
      sendGAEvent(parameters);
    }
  } catch (error) {
    console.warn("Analytics event failed:", error);
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent("page_view", {
    page_title: pageName,
    page_location: window.location.href,
    page_path: window.location.pathname,
  });
};

export const trackContactFormSubmission = (formName: string) => {
  trackEvent("form_submission", {
    event_category: "Engagement",
    event_label: `Contact Form: ${formName}`,
    form_name: formName,
  });
};

export const trackResumeDownload = () => {
  trackEvent("file_download", {
    event_category: "Engagement",
    event_label: "Resume Download",
    file_name: "resume.pdf",
  });
};

export const trackThemeToggle = (newTheme: string) => {
  trackEvent("theme_toggle", {
    event_category: "Appearance",
    event_label: `Theme changed to ${newTheme}`,
    new_theme: newTheme,
  });
};

export const trackCalBooking = () => {
  trackEvent("cal_booking_attempt", {
    event_category: "Engagement",
    event_label: "Cal.com Booking Initiated",
  });
};

export const trackBlogPostInteraction = (
  slug: string,
  interactionType: "like" | "dislike",
) => {
  trackEvent("blog_interaction", {
    event_category: "Engagement",
    event_label: `Blog Post: ${slug}`,
    interaction_type: interactionType,
  });
};

export const trackProjectClick = (projectName: string, url: string) => {
  trackEvent("project_click", {
    event_category: "Engagement",
    event_label: `Project: ${projectName}`,
    link_url: url,
  });
};

export const trackSocialLinkClick = (platform: string, url: string) => {
  trackEvent("social_link_click", {
    event_category: "Engagement",
    event_label: `Social: ${platform}`,
    link_url: url,
  });
};

export const trackKeyboardShortcut = (shortcut: string) => {
  trackEvent("keyboard_shortcut_used", {
    event_category: "Engagement",
    event_label: `Shortcut: ${shortcut}`,
  });
};
