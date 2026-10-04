import React from "react";
import { getGitHubActivityData } from "@/lib/github";
import { GitHubHeatmap } from "./GitHubHeatmap";
import { ContributionError } from "./ContributionError";

export async function GitHubActivitySection() {
  const data = await getGitHubActivityData();

  return (
    <section className="mb-14" data-purpose="github-activity-section">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground font-medium">
          GITHUB
        </div>
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>@{data.username}</span>
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

      {data.isError && (!data.weeks || data.weeks.length === 0) ? (
        <ContributionError
          profileUrl={data.profileUrl}
          username={data.username}
        />
      ) : (
        <GitHubHeatmap data={data} />
      )}
    </section>
  );
}
