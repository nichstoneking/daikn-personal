export interface RepositoryRequest {
  owner: string;
  repo: string;
}

export interface MonthlyCommits {
  label: string; // "Jan", "Feb", ...
  year: number;
  commits: number;
}

export interface RepositoryResponse {
  recent: number;
  increase: number;
  monthly: MonthlyCommits[]; // trailing 12 months, oldest -> newest
  accessed: string;
}

export interface WeeklyCommitActivity {
  week: number; // Unix timestamp for the start of the week
  total: number; // Total number of commits in the week
  days: number[]; // Number of commits for each day of the week (0-6, Sun-Sat)
}

export type CommitActivityStats = WeeklyCommitActivity[];

export interface ErrorResponse {
  field: string;
  message: string;
}

export interface ErrorMsg {
  errors: ErrorResponse[];
}
