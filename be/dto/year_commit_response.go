package dto

type CommitActivityStats []WeeklyCommitActivity

// WeeklyCommitActivity represents the commit activity for a single week
type WeeklyCommitActivity struct {
	Week  int64 `json:"week"`  // Unix timestamp for the start of the week
	Total int   `json:"total"` // Total number of commits in the week
	Days  []int `json:"days"`  // Number of commits for each day of the week (0-6)
}
