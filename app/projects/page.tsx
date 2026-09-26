import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of software products, prototypes, and experiments I've built.",
};

function getStatusDotColor(status?: string): string {
  switch (status) {
    case "Active":
      return "bg-emerald-400";
    case "In Development":
      return "bg-amber-400";
    case "Prototype":
    default:
      return "bg-sky-400";
  }
}

export default function ProjectsPage() {
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
          WORK &amp; EXPERIMENTS
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Projects
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground font-normal">
          A collection of software products, prototypes, and experiments I&apos;ve built.
        </p>
      </header>

      {/* Project Archive List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <article
            key={project.id}
            className="p-5 rounded-xl bg-surface/40 border border-border/60 group hover:border-border/80 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="font-semibold text-[15px] text-foreground">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline decoration-border underline-offset-4"
                  >
                    <span>{project.name}</span>
                    <svg
                      className="w-3.5 h-3.5 text-muted-foreground stroke-current fill-none group-hover:text-foreground transition-colors"
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
                ) : (
                  <span>{project.name}</span>
                )}
              </h2>

              {project.status && (
                <Badge
                  label={project.status}
                  dotColor={getStatusDotColor(project.status)}
                />
              )}
            </div>

            <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-3">
              {project.description}
            </p>

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono bg-surface text-muted-foreground px-2 py-0.5 border border-border/60 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
