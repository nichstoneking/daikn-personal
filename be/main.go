package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	_ "github.com/joho/godotenv/autoload"
)

type Repository struct {
	Owner string `json:"owner" binding:"required"`
	Repo  string `json:"repo" binding:"required"`
}

type ErrorMsg struct {
	Errors []ErrorResponse `json:"errors"`
}

type ErrorResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type ParticipationStats struct {
	All   []int `json:"all"`   // all commit counts
	Owner []int `json:"owner"` // owner commit counts
}

var repos = []Repository{
	{Owner: "daikonk", Repo: "daikn-personal"},
	{Owner: "daikonk", Repo: "amiami-bot"},
}

func HandleValidationError(err error) ErrorMsg {
	var errors []ErrorResponse

	// Check if the error is a validator.ValidationErrors
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			error := ErrorResponse{
				Field:   e.Field(),
				Message: getErrorMsg(e),
			}
			errors = append(errors, error)
		}
	} else {
		// Handle non-validation errors (like malformed JSON)
		errors = append(errors, ErrorResponse{
			Field:   "request",
			Message: err.Error(),
		})
	}

	return ErrorMsg{
		Errors: errors,
	}
}

func getErrorMsg(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	default:
		return "Invalid value"
	}
}

func getRepositoryData(c *gin.Context) {
	token := os.Getenv("GITHUB_KEY")

	var newRepository Repository

	// validate payload
	if err := c.BindJSON(&newRepository); err != nil {
		c.JSON(http.StatusBadRequest, HandleValidationError(err))
		return
	}

	// create http client
	client := &http.Client{}

	// build http request
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/stats/participation", newRepository.Owner, newRepository.Repo)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Printf("Error building request: %v\n", err)
		c.JSON(http.StatusInternalServerError, err)
	}
	req.Header.Add("Accept", "application/vnd.github+json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Add("X-GitHub-Api-Version", "2022-11-28")

	// make http request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("Error: status code %d\nResponse: %s\n", resp.StatusCode, string(body))
		c.JSON(http.StatusNotFound, string(body))
		return
	}

	var stats ParticipationStats
	if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
		fmt.Printf("Error decoding response: %v\n", err)
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.IndentedJSON(http.StatusCreated, stats)
}

func getRepositories(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, repos)
}

func main() {
	router := gin.Default()
	router.GET("/repos", getRepositories)
	router.POST("/repo", getRepositoryData)

	router.Run("localhost:8080")
}
