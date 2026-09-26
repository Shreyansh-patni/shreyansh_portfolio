import React from "react";
import {
  educationList as defaultEducationList,
  type Education,
} from "@/content/education";
import { Timeline } from "@/components/timeline/Timeline";
import { TimelineEntry } from "@/components/timeline/TimelineEntry";

interface EducationSectionProps {
  items?: Education[];
}

function formatEducationDate(item: Education): string {
  if (item.startDate && item.endDate) {
    return `${item.startDate} — ${item.endDate}`;
  }
  if (item.startDate) {
    return item.startDate;
  }
  if (item.endDate) {
    return item.endDate;
  }
  return "";
}

export function EducationSection({
  items = defaultEducationList,
}: EducationSectionProps) {
  return (
    <section className="mb-14" data-purpose="education-timeline">
      <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
        EDUCATION
      </div>
      <Timeline>
        {items.map((item) => (
          <TimelineEntry
            key={item.id}
            date={formatEducationDate(item)}
            title={item.degree}
            subtitlePrefix="at"
            badgeLabel={item.institution}
            badgeUrl={item.url}
            badgeDotColor="bg-blue-500"
            description={item.description}
          />
        ))}
      </Timeline>
    </section>
  );
}
