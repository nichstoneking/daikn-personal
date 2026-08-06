import type { RepositoryResponse } from "../types/api";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT = 10_000;

type CacheEntry = { data: RepositoryResponse; timestamp: number };

// Per-tab memo so re-expanding a project doesn't refetch. The route handler
// does the real caching; this just avoids a round trip on toggle.
const cache = new Map<string, CacheEntry>();

export const clearCache = () => cache.clear();

export const fetchRepoData = async (
  owner: string,
  repo: string
): Promise<RepositoryResponse> => {
  const key = `${owner}/${repo}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.timestamp < CACHE_TTL) {
    return hit.data;
  }

  const response = await fetch("/api/repo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner, repo }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repo data: ${response.status}`);
  }

  const data = (await response.json()) as RepositoryResponse;
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
