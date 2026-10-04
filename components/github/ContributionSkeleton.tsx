import React from "react";

export function ContributionSkeleton() {
  return (
    <div
      className="p-4 rounded-xl bg-surface/40 border border-border/60 animate-pulse"
      aria-busy="true"
      aria-label="Loading GitHub activity"
    >
      <div className="h-4 w-48 bg-surface/80 rounded border border-border/40 mb-4" />
      
      <div className="w-full overflow-hidden">
        <div className="h-3 w-full bg-surface/50 rounded mb-2" />
        <div className="h-24 w-full bg-surface/60 rounded border border-border/30" />
      </div>

      <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-border/40">
        <div className="h-3 w-20 bg-surface/60 rounded" />
        <div className="h-3 w-28 bg-surface/60 rounded" />
      </div>
    </div>
  );
}
