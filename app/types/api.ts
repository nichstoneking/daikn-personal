export interface RepositoryRequest {
  owner: string;
  repo: string;
}

export interface MonthlyCommits {
  label: string;
  year: number;
  commits: number;
}

export interface RepositoryResponse {
  recent: number;
  increase: number;
  monthly: MonthlyCommits[];
  accessed: string;
}

export interface WeeklyCommitActivity {
  week: number;
  total: number;
  days: number[];
}

export type CommitActivityStats = WeeklyCommitActivity[];

export interface ErrorResponse {
  field: string;
  message: string;
}

export interface ErrorMsg {
  errors: ErrorResponse[];
}
