export interface RepositoryRequest {
  owner: string;
  repo: string;
}

export interface RepositoryResponse {
  recent: number;
  increase: number;
  monthly: number[]; // length 12
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
