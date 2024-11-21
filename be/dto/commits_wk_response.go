package dto

type CommitsWkResponse struct {
	Recent   int     `json:"recent"`
	Increase float64 `json:"increase"`
	Monthly  []int   `json:"monthly"`
	Accessed string  `json:"accessed"`
}
