"use client";

import React from "react";
import type { ContributionDay } from "@/lib/github";
import { getLevelColorClass } from "@/lib/github";
import { formatDateLabel } from "./ContributionTooltip";

interface ContributionCellProps {
  day: ContributionDay | null;
  onHover: (day: ContributionDay | null, rect: DOMRect | null) => void;
}

export function ContributionCell({ day, onHover }: ContributionCellProps) {
  if (!day) {
    return <div className="w-[10px] h-[10px] rounded-[2px] opacity-0 pointer-events-none" aria-hidden="true" />;
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onHover(day, rect);
  };

  const handleMouseLeave = () => {
    onHover(null, null);
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onHover(day, rect);
  };

  const handleBlur = () => {
    onHover(null, null);
  };

  const formattedDate = formatDateLabel(day.date);
  const ariaLabel =
    day.count === 0
      ? `No contributions on ${formattedDate}`
      : `${day.count} ${
          day.count === 1 ? "contribution" : "contributions"
        } on ${formattedDate}`;

  return (
    <div
      role="gridcell"
      tabIndex={0}
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer transition-transform duration-100 hover:scale-125 hover:z-10 focus-visible:scale-125 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${getLevelColorClass(
        day.level
      )}`}
    />
  );
}
