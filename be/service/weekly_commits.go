package service

import (
	"daikn/be/dto"
	"daikn/be/error_handler"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func GetWkCommits(c *gin.Context) {
	token := os.Getenv("GITHUB_KEY")

	var request dto.RepositoryRequest

	// validate payload
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, error_handler.HandleValidationError(err))
		return
	}

	// create http client
	client := &http.Client{}

	// build http request
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/stats/participation", request.Owner, request.Repo)
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

	var stats dto.ParticipationStats
	if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
		fmt.Printf("Error decoding response: %v\n", err)
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.IndentedJSON(http.StatusCreated, calcWkCommitResponse(stats))
}

func calcWkCommitResponse(stats dto.ParticipationStats) dto.CommitsWkResponse {
	var response dto.CommitsWkResponse

	// get current week and set value to Recent
	response.Recent = stats.All[51]

	// calculate percentage increase in commits and set
	denom := stats.All[50]
	if stats.All[50] == 0 {
		denom = 1
	}
	// gets increase as a float and rounds to 2nd decimal place
	response.Increase = math.Round((float64(stats.All[51]-stats.All[50])/float64(denom))*100) / 100

	// calculate commits by month
	var Monthly []int
	// Jan - Dec
	// TODO: make this exact also it doesnt work the way i thought :c
	Monthly = append(Monthly, stats.All[0]+stats.All[1]+stats.All[2]+stats.All[3])
	Monthly = append(Monthly, stats.All[4]+stats.All[5]+stats.All[6]+stats.All[7])
	Monthly = append(Monthly, stats.All[8]+stats.All[9]+stats.All[10]+stats.All[11]+stats.All[12])
	Monthly = append(Monthly, stats.All[13]+stats.All[14]+stats.All[15]+stats.All[16])
	Monthly = append(Monthly, stats.All[17]+stats.All[18]+stats.All[19]+stats.All[20])
	Monthly = append(Monthly, stats.All[21]+stats.All[22]+stats.All[23]+stats.All[24]+stats.All[25])
	Monthly = append(Monthly, stats.All[26]+stats.All[27]+stats.All[28]+stats.All[29])
	Monthly = append(Monthly, stats.All[30]+stats.All[31]+stats.All[32]+stats.All[33])
	Monthly = append(Monthly, stats.All[34]+stats.All[35]+stats.All[36]+stats.All[37]+stats.All[38])
	Monthly = append(Monthly, stats.All[39]+stats.All[40]+stats.All[41]+stats.All[42])
	Monthly = append(Monthly, stats.All[43]+stats.All[44]+stats.All[45]+stats.All[46])
	Monthly = append(Monthly, stats.All[47]+stats.All[48]+stats.All[49]+stats.All[50]+stats.All[51])
	response.Monthly = Monthly

	response.Views = 132

	return response
}
