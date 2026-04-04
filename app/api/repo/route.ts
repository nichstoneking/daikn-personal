import { NextRequest, NextResponse } from "next/server";
import type {
  RepositoryRequest,
  RepositoryResponse,
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
  console.log(`Making request to: ${url}`);

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    console.log(
      `GitHub API response status: ${resp.status} (attempt ${attempt + 1})`
    );

    if (resp.status === 202) {
      console.log("GitHub API returned 202 - statistics being computed");
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
      console.error(`Error: status code ${resp.status}\nResponse: ${body}`);
      throw new Error(`GitHub API error: status ${resp.status}`);
    }

    const stats: CommitActivityStats = await resp.json();
    console.log(`Successfully decoded ${stats.length} weeks of commit data`);
    return stats;
  }

  throw new Error("GitHub API still computing statistics after max retries");
}

// Faithful port of the Go calcWkCommitResponse logic
// TODO: make this exact also it doesnt work the way i thought :c
function calcWkCommitResponse(
  stats: CommitActivityStats
): RepositoryResponse {
  const Monthly: number[] = new Array(12).fill(0);
  const daysInMonth: number[] = [
    30, 27, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30,
  ];

  const currentTime = new Date();

  let currMonth = currentTime.getMonth();
  let currDay = currentTime.getDate() - 1;
  let currWk = 51;
  const currYear = currentTime.getFullYear();
  let remainder = currentTime.getDay();

  if (currYear % 4 === 0 && (currYear % 100 !== 0 || currYear % 400 === 0)) {
    daysInMonth[1] = 28;
  }

  if (currWk >= stats.length) {
    currWk = stats.length - 1;
  }
  if (currWk < 0) {
    currWk = 0;
  }

  console.log(stats[currWk].total);

  for (; currMonth >= 0; currMonth--) {
    console.log(currDay, " ", currMonth);
    for (; remainder >= 0; remainder--) {
      if (
        currWk >= 0 &&
        currWk < stats.length &&
        remainder >= 0 &&
        remainder < stats[currWk].days.length
      ) {
        Monthly[currMonth] += stats[currWk].days[remainder];
      }
      currDay--;
    }
    console.log(currDay, " ", currMonth);
    currWk--;

    if (currWk < 0) {
      break;
    }

    for (; currDay > 6; currDay -= 7) {
      if (currWk >= 0 && currWk < stats.length) {
        Monthly[currMonth] += stats[currWk].total;
      }
      currWk--;
      if (currWk < 0) {
        break;
      }
    }
    console.log(currDay, " ", currMonth);
    console.log("final count : ", Monthly[currMonth]);

    remainder = 6 - currDay;
    if (remainder > 6) {
      remainder = 6;
    }
    if (remainder < 0) {
      remainder = 0;
    }

    for (; currDay >= 0; currDay--) {
      const dayIndex = 6 - currDay;
      if (
        currWk >= 0 &&
        currWk < stats.length &&
        dayIndex >= 0 &&
        dayIndex < stats[currWk].days.length
      ) {
        Monthly[currMonth] += stats[currWk].days[dayIndex];
      }
    }

    if (currMonth > 0) {
      currDay = daysInMonth[currMonth - 1] - remainder;
    }
  }

  let accessed = "";
  for (let j = stats.length - 1; j >= 0; j--) {
    if (stats[j].total !== 0) {
      const t = new Date(stats[j].week * 1000);
      accessed = t.toISOString().split("T")[0];
      break;
    }
  }

  const currentMonthIndex = currentTime.getMonth();
  const recent = Monthly[currentMonthIndex];

  let increase: number;
  if (currentMonthIndex === 0) {
    increase = Math.round((recent / 1) * 100) / 100;
  } else {
    increase =
      Math.round(
        ((recent - (currentMonthIndex - 1)) / Monthly[currentMonthIndex]) * 100
      ) / 100;
  }

  const denom = Monthly[10] === 0 ? 1 : Monthly[10];
  increase =
    Math.round(((Monthly[11] - Monthly[10]) / denom) * 100) / 100;

  return {
    recent,
    increase,
    monthly: Monthly,
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

  console.log(
    `Processing request for owner: ${req.owner}, repo: ${req.repo}`
  );

  let repoCommits: CommitActivityStats;
  try {
    repoCommits = await getYrCommits(req);
  } catch (err) {
    console.error(`Error fetching commits: ${err}`);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 404 }
    );
  }

  if (!repoCommits || repoCommits.length === 0) {
    console.log("No commit data received");
    return NextResponse.json(
      { error: "No commit data available" },
      { status: 404 }
    );
  }

  console.log(`Received ${repoCommits.length} weeks of commit data`);

  try {
    const response = calcWkCommitResponse(repoCommits);
    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error(`Panic in calcWkCommitResponse: ${err}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
