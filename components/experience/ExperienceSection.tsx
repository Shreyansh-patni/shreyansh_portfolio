import React from "react";
import {
  experiences as defaultExperiences,
  type Experience,
} from "@/content/experience";
import { Timeline } from "@/components/timeline/Timeline";
import { TimelineEntry } from "@/components/timeline/TimelineEntry";
import { BlurFade } from "@/components/ui/blur-fade";

interface ExperienceSectionProps {
  items?: Experience[];
}

function formatDateRange(item: Experience): string {
  if (item.current) {
    return `${item.startDate} — NOW`;
  }
  if (item.endDate) {
    return `${item.startDate} — ${item.endDate}`;
  }
  return item.startDate;
}

export function ExperienceSection({
  items = defaultExperiences,
}: ExperienceSectionProps) {
  return (
    <BlurFade delay={0.1} inView>
      <section className="mb-14" data-purpose="experience-timeline">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
          EXPERIENCE
        </div>
        <Timeline>
          {items.map((item) => (
            <TimelineEntry
              key={item.id}
              date={formatDateRange(item)}
              title={item.role}
              subtitlePrefix="at"
              badgeLabel={item.company}
              badgeUrl={item.companyUrl}
              badgeDotColor="bg-emerald-400"
              logo={item.logo}
              description={item.description}
            />
          ))}
        </Timeline>
      </section>
    </BlurFade>
  );
}
