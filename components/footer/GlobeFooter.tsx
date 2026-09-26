"use client";

import { Globe } from "@/components/ui/globe";

export function GlobeFooter() {
  return (
    <footer className="relative flex flex-col items-center justify-center w-full pt-10 pb-12 overflow-hidden">
      <div className="relative w-full max-w-[320px] sm:max-w-[380px] aspect-square flex items-center justify-center">
        <Globe />
      </div>
    </footer>
  );
}
