import React from "react";
import { getGitHubActivityData } from "@/lib/github";

function getLevelColor(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
    case 1:
      return "bg-emerald-950/60 dark:bg-emerald-900/60 border border-emerald-800/40";
    case 2:
      return "bg-emerald-700/80 dark:bg-emerald-700/90";
    case 3:
      return "bg-emerald-500";
    case 4:
      return "bg-emerald-400";
    case 0:
    default:
      return "bg-surface border border-border/50";
  }
}

export async function GitHubActivitySection() {
  const data = await getGitHubActivityData();

  if (!data) {
    return null;
  }

  return (
    <section className="mb-14" data-purpose="github-activity-section">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground font-medium">
          GITHUB
        </div>
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>@{data.username}</span>
          <svg
            className="w-3.5 h-3.5 text-muted-foreground/70 stroke-current fill-none group-hover:text-foreground transition-colors"
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
      </div>

      <div className="p-4 rounded-xl bg-surface/40 border border-border/60">
        <div className="text-[13px] text-muted-foreground mb-3 font-medium">
          {data.totalContributions > 0
            ? `${data.totalContributions} contributions in the last year`
            : `GitHub activity for @${data.username}`}
        </div>

        {data.weeks && data.weeks.length > 0 && (
          <div className="w-full overflow-x-auto pb-2 scrollbar-none">
            <div className="flex gap-[3px] min-w-max">
              {data.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.days.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.count} contributions on ${day.date}`}
                      aria-label={`${day.count} contributions on ${day.date}`}
                      className={`w-[10px] h-[10px] rounded-[2px] ${getLevelColor(
                        day.level
                      )} transition-colors`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-3 pt-2 border-t border-border/40">
          <span>Activity graph</span>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-surface border border-border/50" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950/60 border border-emerald-800/40" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700/80" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
