import React from "react";
import { Badge } from "@/components/ui/Badge";

export interface TimelineEntryProps {
  date: string;
  title: string;
  subtitlePrefix?: string;
  badgeLabel: string;
  badgeUrl?: string;
  badgeDotColor?: string;
  description: string;
}

export function TimelineEntry({
  date,
  title,
  subtitlePrefix = "at",
  badgeLabel,
  badgeUrl,
  badgeDotColor = "bg-emerald-400",
  description,
}: TimelineEntryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 sm:gap-4">
      <div className="text-[12px] font-mono text-muted-foreground sm:pt-0.5">
        {date}
      </div>
      <div className="sm:col-span-3">
        <div className="flex flex-wrap items-center gap-1.5 font-medium text-[13px] text-foreground mb-1">
          <span>
            {title} {subtitlePrefix}
          </span>
          <Badge label={badgeLabel} url={badgeUrl} dotColor={badgeDotColor} />
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
