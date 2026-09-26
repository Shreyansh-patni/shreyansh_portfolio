export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface GitHubActivityData {
  username: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  profileUrl: string;
}

const GITHUB_USERNAME = "Shreyansh-patni";
const REVALIDATE_SECONDS = 3600;

function mapCountToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

export async function getGitHubActivityData(): Promise<GitHubActivityData> {
  const profileUrl = `https://github.com/${GITHUB_USERNAME}`;

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
          variables: { username: GITHUB_USERNAME },
        }),
        next: { revalidate: REVALIDATE_SECONDS },
      });

      if (response.ok) {
        const json = await response.json();
        const calendar =
          json?.data?.user?.contributionsCollection?.contributionCalendar;
        if (calendar) {
          const weeks: ContributionWeek[] = calendar.weeks.map(
            (w: {
              contributionDays: Array<{
                date: string;
                contributionCount: number;
              }>;
            }) => ({
              days: w.contributionDays.map((d) => ({
                date: d.date,
                count: d.contributionCount,
                level: mapCountToLevel(d.contributionCount),
              })),
            })
          );

          return {
            username: GITHUB_USERNAME,
            totalContributions: calendar.totalContributions || 0,
            weeks,
            profileUrl,
          };
        }
      }
    }

    // Try reliable public contribution calendar API fallback
    const fallbackRes = await fetch(
      `https://github-contributions.vercel.app/api/v1/${GITHUB_USERNAME}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (fallbackData && Array.isArray(fallbackData.contributions)) {
        const rawDays: Array<{ date: string; count: number }> =
          fallbackData.contributions;
        // Sort ascending by date (chronological order)
        const sortedDays = [...rawDays].sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        // Take the last 52 weeks (364 days)
        const recentDays = sortedDays.slice(-364);

        const weeks: ContributionWeek[] = [];
        for (let i = 0; i < recentDays.length; i += 7) {
          weeks.push({
            days: recentDays.slice(i, i + 7).map((d) => ({
              date: d.date,
              count: d.count || 0,
              level: mapCountToLevel(d.count || 0),
            })),
          });
        }

        const total = Array.isArray(fallbackData.years)
          ? fallbackData.years.reduce(
              (sum: number, y: { total?: number }) => sum + (y.total || 0),
              0
            )
          : recentDays.reduce((sum, d) => sum + (d.count || 0), 0);

        return {
          username: GITHUB_USERNAME,
          totalContributions: total,
          weeks,
          profileUrl,
        };
      }
    }

    return {
      username: GITHUB_USERNAME,
      totalContributions: 0,
      weeks: [],
      profileUrl,
    };
  } catch (error) {
    console.error("Failed to fetch GitHub activity:", error);
    return {
      username: GITHUB_USERNAME,
      totalContributions: 0,
      weeks: [],
      profileUrl,
    };
  }
}
