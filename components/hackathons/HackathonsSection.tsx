import React from "react";
import {
  hackathons as defaultHackathons,
  type Hackathon,
} from "@/content/hackathons";
import { Timeline } from "@/components/timeline/Timeline";
import { TimelineEntry } from "@/components/timeline/TimelineEntry";

interface HackathonsSectionProps {
  items?: Hackathon[];
}

export function HackathonsSection({
  items = defaultHackathons,
}: HackathonsSectionProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="mb-14" data-purpose="hackathons-timeline">
      <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground mb-6 font-medium">
        HACKATHONS
      </div>
      <Timeline>
        {items.map((item) => (
          <TimelineEntry
            key={item.id}
            date={item.date || ""}
            title={item.name}
            subtitlePrefix={item.result ? `— ${item.result}` : ""}
            badgeLabel={item.result || "Hackathon"}
            badgeUrl={item.url}
            badgeDotColor="bg-orange-500"
            description={item.description || ""}
          />
        ))}
      </Timeline>
    </section>
  );
}
