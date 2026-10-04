import { socialAccounts } from "@/content/social";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: (ContributionDay | null)[];
}

export interface MonthLabel {
  month: string;
  weekIndex: number;
}

export interface GitHubActivityData {
  username: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  monthLabels: MonthLabel[];
  profileUrl: string;
  isError?: boolean;
}

const githubSocial = socialAccounts.find(
  (s) => s.id === "github" || s.platform.toLowerCase() === "github"
);

export const GITHUB_CONFIG = {
  username: githubSocial?.username || "Shreyansh-patni",
  profileUrl: githubSocial?.url || "https://github.com/Shreyansh-patni",
  revalidateSeconds: 3600, // Cache for 1 hour
};

export function mapCountToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (!count || count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function getLevelColorClass(level: 0 | 1 | 2 | 3 | 4): string {
  switch (level) {
    case 1:
      return "bg-[#0e4429] dark:bg-[#0e4429] border border-emerald-800/40 light:bg-emerald-200 light:border-emerald-300";
    case 2:
      return "bg-[#006d32] dark:bg-[#006d32] border border-emerald-700/50 light:bg-emerald-400 light:border-emerald-500";
    case 3:
      return "bg-[#26a641] dark:bg-[#26a641] border border-emerald-500/60 light:bg-emerald-600 light:border-emerald-700";
    case 4:
      return "bg-[#39d353] dark:bg-[#39d353] border border-emerald-300/60 light:bg-emerald-800 light:border-emerald-900 shadow-[0_0_8px_rgba(57,211,83,0.25)]";
    case 0:
    default:
      return "bg-white/[0.04] dark:bg-white/[0.04] border border-white/[0.07] light:bg-[#ebedf0] light:border-black/[0.06]";
  }
}

/**
 * Normalizes an array of ContributionDay items into 7-day Sunday..Saturday weeks
 * and calculates month labels aligned with week columns.
 */
export function buildContributionWeeks(days: ContributionDay[]): {
  weeks: ContributionWeek[];
  monthLabels: MonthLabel[];
} {
  if (!days || days.length === 0) {
    return { weeks: [], monthLabels: [] };
  }

  // Ensure days are sorted chronologically ascending
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));

  // Map each day by date string for quick lookup
  const dayMap = new Map<string, ContributionDay>();
  for (const day of sorted) {
    dayMap.set(day.date, day);
  }

  const startDate = new Date(`${sorted[0].date}T00:00:00`);
  const endDate = new Date(`${sorted[sorted.length - 1].date}T00:00:00`);

  // Start from Sunday of the start week
  const curr = new Date(startDate);
  curr.setDate(curr.getDate() - curr.getDay());

  const weeks: ContributionWeek[] = [];
  const monthLabels: MonthLabel[] = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let lastLabeledMonth = -1;
  let weekIdx = 0;

  while (curr <= endDate || curr.getDay() !== 0) {
    const weekDays: (ContributionDay | null)[] = [];
    let weekMonth = -1;
    let hasFirstOfMonth = false;

    for (let d = 0; d < 7; d++) {
      const dateStr = curr.toISOString().split("T")[0];
      const foundDay = dayMap.get(dateStr);

      if (curr >= startDate && curr <= endDate) {
        weekDays.push(
          foundDay || {
            date: dateStr,
            count: 0,
            level: 0,
          }
        );
      } else {
        // Outside the exact 1-year boundary
        weekDays.push(null);
      }

      if (curr.getDate() === 1 && curr >= startDate && curr <= endDate) {
        hasFirstOfMonth = true;
        weekMonth = curr.getMonth();
      }

      curr.setDate(curr.getDate() + 1);
    }

    // Determine month label for this week column
    // If week contains the 1st of a month or starts a new month
    const midWeekDate = new Date(curr);
    midWeekDate.setDate(midWeekDate.getDate() - 4);
    const candidateMonth = midWeekDate.getMonth();

    if (
      (hasFirstOfMonth && weekMonth !== lastLabeledMonth) ||
      (candidateMonth !== lastLabeledMonth && weekIdx > 0)
    ) {
      const monthToLabel = hasFirstOfMonth ? weekMonth : candidateMonth;
      // Avoid labeling if too close to previous label (less than 2 weeks)
      const lastLabel = monthLabels[monthLabels.length - 1];
      if (!lastLabel || weekIdx - lastLabel.weekIndex >= 2) {
        monthLabels.push({
          month: monthNames[monthToLabel],
          weekIndex: weekIdx,
        });
        lastLabeledMonth = monthToLabel;
      }
    }

    weeks.push({ days: weekDays });
    weekIdx++;

    // Safety guard
    if (weekIdx > 60) break;
  }

  return { weeks, monthLabels };
}

/**
 * Fetches real contribution data from GitHub using GraphQL API (if token available),
 * falling back to GitHub's public contribution HTML endpoint or proxy.
 */
export async function getGitHubActivityData(): Promise<GitHubActivityData> {
  const { username, profileUrl, revalidateSeconds } = GITHUB_CONFIG;

  // 1. Try GitHub GraphQL API if GITHUB_TOKEN is configured
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "ShreyanshPatni-Portfolio",
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
        next: { revalidate: revalidateSeconds },
      });

      if (response.ok) {
        const json = await response.json();
        const calendar =
          json?.data?.user?.contributionsCollection?.contributionCalendar;

        if (calendar && Array.isArray(calendar.weeks)) {
          const days: ContributionDay[] = [];
          for (const w of calendar.weeks) {
            for (const d of w.contributionDays) {
              days.push({
                date: d.date,
                count: d.contributionCount || 0,
                level: mapCountToLevel(d.contributionCount || 0),
              });
            }
          }

          const { weeks, monthLabels } = buildContributionWeeks(days);

          return {
            username,
            totalContributions: calendar.totalContributions || 0,
            weeks,
            monthLabels,
            profileUrl,
          };
        }
      }
    }
  } catch (error) {
    console.error("GitHub GraphQL fetch failed, attempting public fallback:", error);
  }

  // 2. Fetch directly from GitHub public user contributions endpoint
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://shreyansh.cc)",
      },
      next: { revalidate: revalidateSeconds },
    });

    if (res.ok) {
      const html = await res.text();

      // Extract tooltips map
      const tooltipMap = new Map<string, string>();
      const tipRegex = /<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/gi;
      let tipMatch: RegExpExecArray | null;
      while ((tipMatch = tipRegex.exec(html)) !== null) {
        tooltipMap.set(tipMatch[1], tipMatch[2].trim());
      }

      // Extract days from td elements
      const cellRegex = /<td\s+([^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*)>/gi;
      let cellMatch: RegExpExecArray | null;
      const days: ContributionDay[] = [];

      while ((cellMatch = cellRegex.exec(html)) !== null) {
        const attrs = cellMatch[1];
        const dateMatch = attrs.match(/data-date="([^"]+)"/);
        const levelMatch = attrs.match(/data-level="([0-9]+)"/);
        const idMatch = attrs.match(/id="([^"]+)"/);

        if (dateMatch) {
          const date = dateMatch[1];
          const rawLevel = levelMatch ? parseInt(levelMatch[1], 10) : 0;
          const level = (rawLevel >= 0 && rawLevel <= 4 ? rawLevel : 0) as 0 | 1 | 2 | 3 | 4;
          const id = idMatch ? idMatch[1] : "";
          const tip = id ? tooltipMap.get(id) || "" : "";

          const countMatch = tip.match(/([0-9,]+)\s+contribution/i);
          const count = countMatch ? parseInt(countMatch[1].replace(/,/g, ""), 10) : 0;

          days.push({
            date,
            count: count || (level > 0 ? level * 2 : 0),
            level,
          });
        }
      }

      if (days.length > 0) {
        // Parse total contributions from page or sum
        const totalMatch =
          html.match(/([0-9,]+)\s+contributions?\s+in\s+the\s+last\s+year/i) ||
          html.match(/([0-9,]+)\s+contributions/i);
        const totalFromHtml = totalMatch
          ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
          : 0;
        const totalCount =
          totalFromHtml > 0
            ? totalFromHtml
            : days.reduce((sum, d) => sum + d.count, 0);

        const { weeks, monthLabels } = buildContributionWeeks(days);

        return {
          username,
          totalContributions: totalCount,
          weeks,
          monthLabels,
          profileUrl,
        };
      }
    }
  } catch (error) {
    console.error("GitHub public contributions scraping failed:", error);
  }

  // 3. Fallback to public JSON API
  try {
    const fallbackRes = await fetch(
      `https://github-contributions.vercel.app/api/v1/${username}`,
      {
        next: { revalidate: revalidateSeconds },
      }
    );

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData && Array.isArray(fallbackData.contributions)) {
        const rawDays: Array<{ date: string; count: number }> = fallbackData.contributions;
        const sortedDays = [...rawDays].sort((a, b) => a.date.localeCompare(b.date));
        const recentDays = sortedDays.slice(-365);

        const days: ContributionDay[] = recentDays.map((d) => ({
          date: d.date,
          count: d.count || 0,
          level: mapCountToLevel(d.count || 0),
        }));

        const total = days.reduce((sum, d) => sum + d.count, 0);
        const { weeks, monthLabels } = buildContributionWeeks(days);

        return {
          username,
          totalContributions: total,
          weeks,
          monthLabels,
          profileUrl,
        };
      }
    }
  } catch (error) {
    console.error("GitHub fallback API failed:", error);
  }

  // 4. Return graceful fallback error state if everything is offline
  return {
    username,
    totalContributions: 0,
    weeks: [],
    monthLabels: [],
    profileUrl,
    isError: true,
  };
}
