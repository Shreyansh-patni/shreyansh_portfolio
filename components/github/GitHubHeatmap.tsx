import React from "react";
import type { GitHubActivityData } from "@/lib/github";
import { ContributionGrid } from "./ContributionGrid";
import { ContributionLegend } from "./ContributionLegend";
import { ContributionError } from "./ContributionError";

interface GitHubHeatmapProps {
  data: GitHubActivityData;
}

export function GitHubHeatmap({ data }: GitHubHeatmapProps) {
  if (data.isError || !data.weeks || data.weeks.length === 0) {
    return (
      <ContributionError
        profileUrl={data.profileUrl}
        username={data.username}
      />
    );
  }

  const summaryText =
    data.totalContributions > 0
      ? `${data.totalContributions.toLocaleString()} contributions in the last year`
      : `GitHub activity for @${data.username}`;

  return (
    <div className="relative p-4 rounded-xl bg-surface/40 border border-border/60 transition-all duration-300">
      {/* Dynamic Summary Title */}
      <div className="text-[13px] text-muted-foreground mb-3 font-medium flex items-center justify-between">
        <span>{summaryText}</span>
      </div>

      {/* 7-Row Contribution Calendar */}
      <ContributionGrid
        weeks={data.weeks}
        monthLabels={data.monthLabels}
      />

      {/* Footer Info & Less -> More Legend */}
      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-3 pt-2.5 border-t border-border/40">
        <span>Activity graph</span>
        <ContributionLegend />
      </div>
    </div>
  );
}
