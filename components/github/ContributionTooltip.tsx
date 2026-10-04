import React from "react";

interface ContributionTooltipProps {
  date: string;
  count: number;
  x: number;
  y: number;
  visible: boolean;
}

export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ContributionTooltip({
  date,
  count,
  x,
  y,
  visible,
}: ContributionTooltipProps) {
  if (!visible || !date) return null;

  const dateFormatted = formatDateLabel(date);
  const contributionText =
    count === 0
      ? "No contributions"
      : count === 1
      ? "1 contribution"
      : `${count} contributions`;

  return (
    <div
      role="tooltip"
      aria-hidden={!visible}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -100%) translateY(-8px)",
      }}
      className="pointer-events-none fixed z-50 px-2.5 py-1.5 rounded-lg bg-surface/95 border border-border/80 text-foreground text-xs shadow-xl backdrop-blur-md transition-opacity duration-150 whitespace-nowrap animate-in fade-in-0 zoom-in-95"
    >
      <div className="font-medium text-[12px] leading-tight text-foreground">
        <span className="font-semibold text-emerald-500 dark:text-emerald-400">
          {contributionText}
        </span>{" "}
        <span className="text-muted-foreground">on {dateFormatted}</span>
      </div>
      {/* Downward pointing tooltip caret */}
      <div
        className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-surface border-r border-b border-border/80"
        aria-hidden="true"
      />
    </div>
  );
}
