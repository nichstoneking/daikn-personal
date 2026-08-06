import { NextRequest, NextResponse } from "next/server";
import type {
  RepositoryRequest,
  RepositoryResponse,
  MonthlyCommits,
  CommitActivityStats,
  ErrorMsg,
} from "../../types/api";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleValidationError(body: unknown): ErrorMsg {
  const errors: ErrorMsg["errors"] = [];
  const req = body as Record<string, unknown> | null | undefined;

  if (!req || typeof req !== "object") {
    errors.push({
      field: "request",
      message: "Invalid or missing JSON body",
    });
    return { errors };
  }

  if (!req.owner || typeof req.owner !== "string") {
    errors.push({ field: "Owner", message: "This field is required" });
  }
  if (!req.repo || typeof req.repo !== "string") {
    errors.push({ field: "Repo", message: "This field is required" });
  }

  return { errors };
}

function validateRequest(body: unknown): body is RepositoryRequest {
  if (!body || typeof body !== "object") return false;
  const req = body as Record<string, unknown>;
  return (
    typeof req.owner === "string" &&
    req.owner.length > 0 &&
    typeof req.repo === "string" &&
    req.repo.length > 0
  );
}

async function getYrCommits(
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
      // Stats are recomputed by GitHub at most hourly; no point hammering it.
      next: { revalidate: 3600 },
    });

    // 202 means GitHub is computing the stats and the body is empty.
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

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

// GitHub returns ~52 weeks ending at the current week, so the window always
// spans two calendar years. Bucket by the real UTC date of each day and emit
// the trailing 12 months in chronological order — a bare 12-slot array indexed
// by month number would collide last year's months with this year's.
function calcWkCommitResponse(
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

  // Walk the last 12 months oldest-to-newest, anchored on today.
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

  // Most recent day with any commit activity.
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

  // Fractional change vs last month. No baseline to divide by means "all new",
  // which reads as +100% rather than a division by zero.
  let increase: number;
  if (previous === 0) {
    increase = recent === 0 ? 0 : 1;
  } else {
    increase = Math.round(((recent - previous) / previous) * 100) / 100;
  }

  return {
    recent,
    increase,
    monthly: months,
    accessed,
  };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "request", message: "Invalid or missing JSON body" }] },
      { status: 400 }
    );
  }

  if (!validateRequest(body)) {
    return NextResponse.json(handleValidationError(body), { status: 400 });
  }

  const req: RepositoryRequest = {
    owner: (body as RepositoryRequest).owner,
    repo: (body as RepositoryRequest).repo,
  };

  let repoCommits: CommitActivityStats;
  try {
    repoCommits = await getYrCommits(req);
  } catch (err) {
    console.error(`Error fetching commits: ${err}`);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 502 }
    );
  }

  if (!Array.isArray(repoCommits) || repoCommits.length === 0) {
    return NextResponse.json(
      { error: "No commit data available" },
      { status: 404 }
    );
  }

  try {
    const response = calcWkCommitResponse(repoCommits);
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error(`Failed to aggregate commit stats: ${err}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
