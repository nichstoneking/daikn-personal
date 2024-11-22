package dto

type ParticipationStats struct {
	All   []int `json:"all"`   // all commit counts
	Owner []int `json:"owner"` // owner commit counts
}
