"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { profile } from "@/content/profile";
import { educationList } from "@/content/education";
import { experiences } from "@/content/experience";
import { businesses } from "@/content/businesses";
import { projects } from "@/content/projects";
import { socialAccounts } from "@/content/social";

function generateProfileText(): string {
  const educationStr = educationList
    .map(
      (e) =>
        `- ${e.institution}: ${e.degree}${
          e.startDate ? ` (${e.startDate}${e.endDate ? ` — ${e.endDate}` : ""})` : ""
        }`
    )
    .join("\n");

  const experienceStr = experiences
    .map(
      (e) =>
        `- ${e.company}: ${e.role}${
          e.startDate
            ? ` (${e.startDate}${e.endDate ? ` — ${e.endDate}` : e.current ? " — NOW" : ""})`
            : ""
        }`
    )
    .join("\n");

  const businessStr = businesses
    .map(
      (b) =>
        `- ${b.name}: ${b.role}${b.website ? ` (${b.website})` : ""}`
    )
    .join("\n");

  const projectsStr = projects
    .map(
      (p) =>
        `- ${p.name}: ${p.description}${p.url ? ` (${p.url})` : ""}`
    )
    .join("\n");

  const socialStr = socialAccounts
    .filter((s) => s.id !== "email")
    .map((s) => `${s.platform}: ${s.url}`)
    .join("\n");

  return `${profile.name}
Developer & Founder

About
${profile.about}

Location
${profile.location}, India

Education
${educationStr}

Experience
${experienceStr}

Business
${businessStr}

Projects
${projectsStr}${
    profile.email
      ? `\n\nEmail\n${profile.email}`
      : ""
  }

Website
https://shreyansh.cc

Social
${socialStr}`;
}

function subscribeDesktopPointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia("(any-hover: hover) and (pointer: fine)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getDesktopPointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(any-hover: hover) and (pointer: fine)").matches;
}

function getDesktopPointerServerSnapshot() {
  return false;
}

export function CopyDetailsShortcut() {
  const [isCopied, setIsCopied] = useState(false);

  const isDesktopPointer = useSyncExternalStore(
    subscribeDesktopPointer,
    getDesktopPointerSnapshot,
    getDesktopPointerServerSnapshot
  );

  const handleCopy = useCallback(async () => {
    try {
      const text = generateProfileText();
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy profile details:", err);
    }
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if Ctrl/Cmd/Alt is pressed (allow browser Ctrl+P or Ctrl+C)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Do not trigger inside input/textarea/select/editable controls
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
        void handleCopy();
      } else if (e.key === "p" || e.key === "P") {
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handlePrint]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  if (!isDesktopPointer) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-40 hidden md:flex items-center gap-2 no-print">
      <button
        type="button"
        onClick={() => void handleCopy()}
        aria-label={isCopied ? "Details Copied" : "Press C to copy details"}
        title="Press C on keyboard to copy profile details"
        className="glass-pill px-3 py-1.5 rounded-full text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer shadow-sm transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        {isCopied ? (
          <span className="flex items-center gap-1.5 text-foreground font-medium">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Details Copied</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 text-foreground font-mono text-[10px] font-semibold border border-border/50">
              C
            </kbd>
            <span>Copy Details</span>
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={handlePrint}
        aria-label="Press P to print portfolio"
        title="Press P on keyboard to print portfolio"
        className="glass-pill px-3 py-1.5 rounded-full text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer shadow-sm transition-all duration-200 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-foreground/10 text-foreground font-mono text-[10px] font-semibold border border-border/50">
            P
          </kbd>
          <span>Print Portfolio</span>
        </span>
      </button>
    </div>
  );
}
