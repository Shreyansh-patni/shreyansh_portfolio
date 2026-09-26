import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Writing about building products, technology, startups, and experiments.",
};

export default function BlogPage() {
  return (
    <main className="max-w-[620px] mx-auto px-5 sm:px-6 pt-10 pb-20 w-full">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none group-hover:-translate-x-0.5 transition-transform"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back to profile</span>
        </Link>
      </div>

      {/* Page Header */}
      <header className="mb-10">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground font-medium mb-3">
          WRITING &amp; ESSAYS
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Blog
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground font-normal">
          Writing about building products, technology, startups, and experiments.
        </p>
      </header>

      {/* Empty State */}
      <div className="p-8 sm:p-12 rounded-xl bg-surface/40 border border-border/60 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface border border-border/50 flex items-center justify-center text-muted-foreground mx-auto mb-4">
          <svg
            className="w-6 h-6 stroke-current fill-none"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-[14px] font-semibold text-foreground mb-1">
          No posts yet
        </div>
        <p className="text-[13px] text-muted-foreground max-w-xs mx-auto">
          Articles and essays will appear here soon.
        </p>
      </div>
    </main>
  );
}
