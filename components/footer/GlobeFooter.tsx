"use client";

import { Globe } from "@/components/ui/globe";

export function GlobeFooter() {
  return (
    <footer className="relative flex flex-col items-center justify-center w-full pt-10 pb-12 overflow-hidden">
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-square flex items-center justify-center">
        <Globe />
      </div>
      <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono text-foreground/90 glass-pill px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[rgb(251,100,21)] animate-pulse" />
        <span>Bengaluru, India</span>
      </div>
    </footer>
  );
}
