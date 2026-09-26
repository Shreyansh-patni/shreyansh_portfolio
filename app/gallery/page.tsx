import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { galleryItems } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A collection of photos, moments, and visual memories.",
};

export default function GalleryPage() {
  const hasItems = galleryItems && galleryItems.length > 0;

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
          PHOTOS &amp; MOMENTS
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Gallery
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground font-normal">
          A collection of photos, moments, and visual memories.
        </p>
      </header>

      {/* Content Grid or Empty State */}
      {hasItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-xl bg-surface/40 border border-border/60"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-surface">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                />
              </div>
              {item.caption && (
                <p className="p-3 text-[12.5px] text-muted-foreground leading-snug">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-xl bg-surface/40 border border-border/60 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border/50 flex items-center justify-center text-muted-foreground mx-auto mb-4">
            <svg
              className="w-6 h-6 stroke-current fill-none"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <div className="text-[14px] font-semibold text-foreground mb-1">
            No photos yet
          </div>
          <p className="text-[13px] text-muted-foreground max-w-xs mx-auto">
            Photographs and moments will be shared here soon.
          </p>
        </div>
      )}
    </main>
  );
}
