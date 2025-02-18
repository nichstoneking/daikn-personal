package dto

type RepositoryResponse struct {
	Recent   int     `json:"recent"`
	Increase float64 `json:"increase"`
	Monthly  [12]int `json:"monthly"`
	Accessed string  `json:"accessed"`
}
