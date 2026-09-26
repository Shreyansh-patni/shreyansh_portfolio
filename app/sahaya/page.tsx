import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { businesses } from "@/content/businesses";
import { projects } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

const sahayaBusiness = businesses.find((b) => b.id === "sahaya") || {
  id: "sahaya",
  name: "Sahaya",
  website: "https://sahaya.tech",
  shortDescription:
    "Innovation Made Easy. SaaS technology and agency developing products such as NexOrder, Sahaya Inventory, PitchX, Inceptus AI, and AdEase AI.",
  role: "Founder (Shreyansh J. Patni), Co-founder (Naman G. Suthar)",
  status: "Active",
};

const sahayaProjects = projects.filter(
  (p) => p.id === "nexorder" || p.description.includes("Sahaya")
);

export const metadata: Metadata = {
  title: "Sahaya",
  description: sahayaBusiness.shortDescription,
  alternates: {
    canonical: "https://shreyansh.cc/sahaya",
  },
  openGraph: {
    title: "Sahaya — Organization",
    description: sahayaBusiness.shortDescription,
    url: "https://shreyansh.cc/sahaya",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: sahayaBusiness.name,
  url: sahayaBusiness.website,
  description: sahayaBusiness.shortDescription,
  founder: {
    "@type": "Person",
    name: "Shreyansh J. Patni",
    url: "https://shreyansh.cc",
  },
};

export default function SahayaPage() {
  return (
    <main className="max-w-[620px] mx-auto px-5 sm:px-6 pt-10 pb-20 w-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
      </head>

      {/* Top Back Link */}
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
          BUSINESS
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {sahayaBusiness.name}
          </h1>
          {sahayaBusiness.status && (
            <Badge label={sahayaBusiness.status} dotColor="bg-emerald-400" />
          )}
        </div>
        <div className="text-[13px] font-mono text-muted-foreground mb-4">
          {sahayaBusiness.role}
        </div>
        <p className="text-[15px] leading-relaxed text-muted-foreground font-normal mb-6">
          {sahayaBusiness.shortDescription}
        </p>
        <div>
          <a
            href={sahayaBusiness.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-mono text-foreground hover:text-accent font-medium transition-colors border border-border/80 rounded-md px-3.5 py-2 bg-surface hover:bg-surface/80"
          >
            <span>{sahayaBusiness.website}</span>
            <svg
              className="w-3.5 h-3.5 text-muted-foreground stroke-current fill-none hover:text-accent transition-colors"
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
      </header>

      {/* Products & Projects Section */}
      <section className="mb-10">
        <ProjectsSection items={sahayaProjects} />
      </section>

      {/* Bottom Profile Link */}
      <div className="pt-8 mt-10 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-[13px] font-mono text-muted-foreground hover:text-foreground transition-colors"
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
        <Link
          href="/"
          className="text-[13px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          Shreyansh Patni (https://shreyansh.cc)
        </Link>
      </div>
    </main>
  );
}
