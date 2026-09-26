import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a project, idea, collaboration, or just want to connect? Get in touch.",
};

export default function ContactPage() {
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
          GET IN TOUCH
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Let&apos;s work together.
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground font-normal">
          Have a project, idea, collaboration, or just want to connect?
        </p>
      </header>

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-xl bg-surface/40 border border-border/60">
        <ContactForm />
      </div>
    </main>
  );
}
