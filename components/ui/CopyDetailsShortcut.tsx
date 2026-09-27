"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

export function CopyDetailsShortcut() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside form fields or editable targets
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "c" || e.key === "C") {
        const textToCopy = `${profile.name} — Developer & Founder
${profile.about}

Email
${profile.email}

Location
${profile.location}

Website
https://shreyansh.cc`;

        void navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        const timer = setTimeout(() => setCopied(false), 2500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!copied) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 glass-pill px-4 py-2 rounded-full text-[12px] font-mono text-foreground shadow-lg flex items-center gap-2 transition-all duration-200"
    >
      <svg
        className="w-4 h-4 text-emerald-500 fill-none stroke-current"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>Copied details to clipboard</span>
    </div>
  );
}
