"use client";

import { Globe } from "@/components/ui/globe";

export function GlobeFooter() {
  return (
    <footer className="relative flex flex-col items-center justify-center w-full pt-10 pb-12 overflow-hidden">
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-square flex items-center justify-center">
        <Globe />
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/80 bg-surface/60 border border-border/40 px-2.5 py-1 rounded-full shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[rgb(251,100,21)] animate-pulse" />
        <span>Bengaluru, India</span>
      </div>
    </footer>
  );
}
