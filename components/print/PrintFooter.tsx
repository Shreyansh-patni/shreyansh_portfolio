import React from "react";

export function PrintFooter() {
  return (
    <footer className="pt-8 pb-12 border-t border-slate-200 mt-12 flex flex-col items-center justify-center gap-3 text-center">
      <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Bengaluru, India</span>
      </div>
      <p className="text-[12px] font-mono text-slate-500">
        Shreyansh Patni — Developer &amp; Founder
      </p>
    </footer>
  );
}
