"use client";

import React, { useState, useCallback } from "react";
import type { ContributionWeek, MonthLabel, ContributionDay } from "@/lib/github";
import { ContributionCell } from "./ContributionCell";
import { ContributionTooltip } from "./ContributionTooltip";

interface ContributionGridProps {
  weeks: ContributionWeek[];
  monthLabels: MonthLabel[];
}

export function ContributionGrid({ weeks, monthLabels }: ContributionGridProps) {
  const [activeDay, setActiveDay] = useState<ContributionDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleHover = useCallback(
    (day: ContributionDay | null, rect: DOMRect | null) => {
      if (day && rect) {
        setActiveDay(day);
        setTooltipPos({
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      } else {
        setActiveDay(null);
      }
    },
    []
  );

  const weekdays = [
    { label: "", row: 0 },
    { label: "Mon", row: 1 },
    { label: "", row: 2 },
    { label: "Wed", row: 3 },
    { label: "", row: 4 },
    { label: "Fri", row: 5 },
    { label: "", row: 6 },
  ];

  return (
    <div className="relative w-full overflow-x-auto pb-1.5 scrollbar-none select-none">
      <div className="min-w-max flex flex-col gap-1.5">
        {/* Month Labels Header Row */}
        <div className="flex text-[10px] font-mono text-muted-foreground/80 pl-7 h-4 relative">
          {monthLabels.map((m, idx) => (
            <span
              key={`${m.month}-${m.weekIndex}-${idx}`}
              className="absolute transform -translate-x-1"
              style={{
                left: `${28 + m.weekIndex * 13}px`,
              }}
            >
              {m.month}
            </span>
          ))}
        </div>

        {/* Calendar Body: Weekdays column + 53 Week Columns */}
        <div className="flex gap-2" role="grid" aria-label="GitHub yearly contribution calendar">
          {/* Weekday Labels Column */}
          <div
            className="flex flex-col gap-[3px] w-5 shrink-0 justify-between text-[9px] font-mono text-muted-foreground/70"
            aria-hidden="true"
          >
            {weekdays.map((w, idx) => (
              <div
                key={idx}
                className="h-[10px] flex items-center leading-none text-right justify-end pr-1"
              >
                {w.label}
              </div>
            ))}
          </div>

          {/* 52/53 Week Columns */}
          <div className="flex gap-[3px]">
            {weeks.map((week, wIdx) => (
              <div
                key={wIdx}
                className="flex flex-col gap-[3px]"
                role="row"
                aria-label={`Week ${wIdx + 1}`}
              >
                {week.days.map((day, dIdx) => (
                  <ContributionCell
                    key={day ? day.date : `empty-${wIdx}-${dIdx}`}
                    day={day}
                    onHover={handleHover}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible Interactive Floating Tooltip */}
      <ContributionTooltip
        date={activeDay?.date || ""}
        count={activeDay?.count || 0}
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={Boolean(activeDay)}
      />
    </div>
  );
}
