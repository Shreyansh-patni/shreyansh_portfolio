import React from "react";
import {
  businesses as defaultBusinesses,
  type Business,
} from "@/content/businesses";
import { Badge } from "@/components/ui/Badge";

interface BusinessesSectionProps {
  items?: Business[];
}

export function BusinessesSection({
  items = defaultBusinesses,
}: BusinessesSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-14" data-purpose="businesses-section">
      <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
        BUSINESSES
      </div>
      <div className="space-y-7">
        {items.map((biz) => (
          <div key={biz.id} className="group">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 font-medium text-[14px] text-foreground">
                {biz.website ? (
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <span>{biz.name}</span>
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
                  <span>{biz.name}</span>
                )}
              </div>
              {biz.status && (
                <Badge label={biz.status} dotColor="bg-emerald-400" />
              )}
            </div>
            {biz.role && (
              <div className="text-[12px] font-mono text-muted-foreground mb-1.5">
                {biz.role}
              </div>
            )}
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {biz.shortDescription}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
