import type {
  RepositoryRequest,
  RepositoryResponse,
  MonthlyCommits,
  CommitActivityStats,
} from "../types/api";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getYrCommits(
  request: RepositoryRequest
): Promise<CommitActivityStats> {
  const token = process.env.GITHUB_KEY;
  const url = `https://api.github.com/repos/${request.owner}/${request.repo}/stats/commit_activity`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      ...(attempt === 0
        ? { next: { revalidate: 3600 } }
        : { cache: "no-store" as const }),
    });

    if (resp.status === 202) {
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw new Error(
        "GitHub API still computing statistics after max retries"
      );
    }

    if (!resp.ok) {
      const body = await resp.text();
      console.error(
        `GitHub API error for ${request.owner}/${request.repo}: ${resp.status} ${body}`
      );
      throw new Error(`GitHub API error: status ${resp.status}`);
    }

    return (await resp.json()) as CommitActivityStats;
  }

  throw new Error("GitHub API still computing statistics after max retries");
}

/**
 * GitHub returns ~52 weeks ending at the current week, so the window always
 * spans two calendar years. Bucket by the real UTC date of each day and emit
 * the trailing 12 months in chronological order — a bare 12-slot array indexed
 * by month number would collide last year's months with this year's.
 */
export function aggregateCommits(
  stats: CommitActivityStats
): RepositoryResponse {
  const byMonth = new Map<string, number>();

  for (const week of stats) {
    for (let day = 0; day < week.days.length; day++) {
      const commits = week.days[day];
      if (!commits) continue;

      const date = new Date((week.week + day * 86400) * 1000);
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + commits);
    }
  }

  const now = new Date();
  const months: MonthlyCommits[] = [];
  for (let offset = 11; offset >= 0; offset--) {
    const cursor = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1)
    );
    const key = `${cursor.getUTCFullYear()}-${cursor.getUTCMonth()}`;
    months.push({
      label: MONTH_LABELS[cursor.getUTCMonth()],
      year: cursor.getUTCFullYear(),
      commits: byMonth.get(key) ?? 0,
    });
  }

  let accessed = "";
  outer: for (let i = stats.length - 1; i >= 0; i--) {
    for (let day = stats[i].days.length - 1; day >= 0; day--) {
      if (stats[i].days[day] > 0) {
        accessed = new Date((stats[i].week + day * 86400) * 1000)
          .toISOString()
          .split("T")[0];
        break outer;
      }
    }
  }

  const recent = months[11].commits;
  const previous = months[10].commits;

  let increase: number;
  if (previous === 0) {
    increase = recent === 0 ? 0 : 1;
  } else {
    increase = Math.round(((recent - previous) / previous) * 100) / 100;
  }

  return { recent, increase, monthly: months, accessed };
}

/**
 * Fetch + aggregate for server rendering. Returns null instead of throwing so
 * a GitHub outage degrades to placeholder data rather than failing the page.
 */
export async function getRepoStats(
  owner: string,
  repo: string
): Promise<RepositoryResponse | null> {
  try {
    const stats = await getYrCommits({ owner, repo });
    if (!Array.isArray(stats) || stats.length === 0) return null;
    return aggregateCommits(stats);
  } catch (err) {
    console.error(`Failed to load commit stats for ${owner}/${repo}:`, err);
    return null;
  }
}
