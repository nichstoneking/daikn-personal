import { NextRequest, NextResponse } from "next/server";
import { getYrCommits, aggregateCommits } from "../../lib/github";
import { getProjects } from "../../data/repository";
import type { RepositoryRequest, CommitActivityStats } from "../../types/api";

/**
 * Commit activity for a project.
 *
 * The home page renders these stats server-side, so this route exists for
 * client-side refreshes only. Requests are restricted to repos that actually
 * appear on the site — otherwise this is an open proxy onto GitHub's API
 * burning our rate limit for anyone who finds it.
 */

async function isAllowed(owner: string, repo: string): Promise<boolean> {
  const projects = await getProjects();
  return projects.some(
    (p) =>
      p.repo?.owner.toLowerCase() === owner.toLowerCase() &&
      p.repo?.name.toLowerCase() === repo.toLowerCase()
  );
}

export async function GET(request: NextRequest) {
  const owner = request.nextUrl.searchParams.get("owner");
  const repo = request.nextUrl.searchParams.get("repo");

  const errors: { field: string; message: string }[] = [];
  if (!owner) errors.push({ field: "owner", message: "This field is required" });
  if (!repo) errors.push({ field: "repo", message: "This field is required" });
  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (!(await isAllowed(owner!, repo!))) {
    return NextResponse.json(
      { error: "Unknown repository" },
      { status: 404 }
    );
  }

  const req: RepositoryRequest = { owner: owner!, repo: repo! };

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
    return NextResponse.json(aggregateCommits(repoCommits), { status: 200 });
  } catch (err) {
    console.error(`Failed to aggregate commit stats: ${err}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
