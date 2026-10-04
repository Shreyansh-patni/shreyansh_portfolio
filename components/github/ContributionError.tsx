import React from "react";
import { GITHUB_CONFIG } from "@/lib/github";

interface ContributionErrorProps {
  profileUrl?: string;
  username?: string;
}

export function ContributionError({
  profileUrl = GITHUB_CONFIG.profileUrl,
  username = GITHUB_CONFIG.username,
}: ContributionErrorProps) {
  return (
    <div className="p-4 rounded-xl bg-surface/40 border border-border/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[13px] text-muted-foreground font-medium">
            GitHub activity is temporarily unavailable.
          </div>
          <div className="text-[12px] text-muted-foreground/70 mt-0.5">
            Check recent code and commits directly on GitHub.
          </div>
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
        >
          <span>@{username}</span>
          <svg
            className="w-3.5 h-3.5 text-muted-foreground/70 stroke-current fill-none group-hover:text-foreground transition-colors"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
