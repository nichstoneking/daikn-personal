# daikn-personal

My personal site — projects, progress, and whatever else I'm building.

Live at [daikn-personal.vercel.app](https://daikn-personal.vercel.app).

## Stack

- **Next.js 15** (App Router) + React 18 + TypeScript
- **Tailwind CSS** for styling
- **Recharts** for the commit-activity chart
- **Framer Motion** for the expand/collapse transitions
- Deployed on **Vercel** (push to `master` deploys)

## Local development

```bash
npm install
npm run dev
```

Create a `.env` with a GitHub token — used server-side by `app/api/repo` to read
commit statistics:

```
GITHUB_KEY=<github personal access token>
```

The token needs read access to repository metadata. Without it the GitHub API
applies unauthenticated rate limits (60 req/hr) and the chart falls back to
placeholder data.

## Layout

```
app/
  page.tsx              home page, project lists
  api/repo/route.ts     GitHub commit-activity aggregation
  components/           navbar, footer, charts, ASCII art
  utils/api.ts          client fetch + per-tab cache
  types/api.ts          shared request/response types
```

## Notes

`/api/repo` fetches `stats/commit_activity` from GitHub (52 weeks of daily
counts), buckets the days into the trailing 12 calendar months, and returns
those alongside the current month's total and its change vs the previous month.
GitHub computes these stats asynchronously and returns `202` while doing so, so
the handler retries before giving up.
