import React from "react";
import { projects as defaultProjects, type Project } from "@/content/projects";
import { Badge } from "@/components/ui/Badge";

interface ProjectsSectionProps {
  items?: Project[];
}

export function ProjectsSection({
  items = defaultProjects,
}: ProjectsSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-14" data-purpose="projects-section">
      <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
        PROJECTS
      </div>
      <div className="space-y-7">
        {items.map((project) => (
          <div key={project.id} className="group">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 font-medium text-[14px] text-foreground">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <span>{project.name}</span>
                    <svg
                      className="w-3.5 h-3.5 text-muted-foreground stroke-current fill-none group-hover:text-accent transition-colors"
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
              </div>
              {project.status && (
                <Badge
                  label={project.status}
                  dotColor={
                    project.status === "Active"
                      ? "bg-emerald-400"
                      : "bg-amber-400"
                  }
                />
              )}
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-2">
              {project.description}
            </p>
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono glass-pill text-muted-foreground px-2 py-0.5 rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
