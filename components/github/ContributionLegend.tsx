import React from "react";
import { getLevelColorClass } from "@/lib/github";

export function ContributionLegend() {
  const levels: Array<0 | 1 | 2 | 3 | 4> = [0, 1, 2, 3, 4];

  return (
    <div
      className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground select-none"
      aria-label="Contribution activity legend"
    >
      <span>Less</span>
      <div className="flex items-center gap-1" role="presentation">
        {levels.map((lvl) => (
          <div
            key={lvl}
            className={`w-[10px] h-[10px] rounded-[2px] ${getLevelColorClass(lvl)}`}
            title={`Level ${lvl}`}
            aria-label={`Contribution level ${lvl}`}
          />
        ))}
      </div>
      <span>More</span>
    </div>
  );
}
