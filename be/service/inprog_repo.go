package service

import (
	"daikn/be/dto"
	"daikn/be/errors"
	"daikn/be/externals"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

func GetInprogRepoData(c *gin.Context) {
retry:
	request := &dto.RepositoryRequest{}
	// validate request
	if err := c.ShouldBindBodyWith(&request, binding.JSON); err != nil {
		fmt.Printf("Request validation error: %v\n", err)
		c.JSON(http.StatusBadRequest, errors.HandleValidationError(err))
		return
	}

	fmt.Printf("Processing request for owner: %s, repo: %s\n", request.Owner, request.Repo)

	repoCommits, err := externals.GetYrCommits(*request)
	if _, ok := err.(*errors.RetryError); ok {
		fmt.Println("202 received retrying...")
		goto retry
	}
	if err != nil {
		fmt.Printf("Error fetching commits: %v\n", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if repoCommits == nil {
		fmt.Println("No commit data received")
		c.JSON(http.StatusNotFound, gin.H{"error": "No commit data available"})
		return
	}

	fmt.Printf("Received %d weeks of commit data\n", len(*repoCommits))

	// Add recovery for potential panics in calcWkCommitResponse
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Panic in calcWkCommitResponse: %v\n", r)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
	}()

	response := calcWkCommitResponse(*repoCommits)
	c.IndentedJSON(http.StatusCreated, response)
}

func calcWkCommitResponse(stats dto.CommitActivityStats) dto.RepositoryResponse {
	var response dto.RepositoryResponse
	var Monthly [12]int
	daysInMonth := [12]int{30, 27, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30}
	// TODO: make this exact also it doesnt work the way i thought :c

	currentTime := time.Now()

	currMonth := int(currentTime.Month()) - 1
	currDay := int(currentTime.Day()) - 1
	currWk := 51
	currYear := int(currentTime.Year())
	remainder := int(currentTime.Weekday())

	if currYear%4 == 0 && (currYear%100 != 0 || currYear%400 == 0) {
		daysInMonth[1] = 28
	}

	// Add bounds checking to prevent array out of bounds errors
	if currWk >= len(stats) {
		currWk = len(stats) - 1
	}
	if currWk < 0 {
		currWk = 0
	}

	fmt.Println(stats[currWk].Total)

	for ; currMonth >= 0; currMonth-- {
		fmt.Println(currDay, " ", currMonth)
		for ; remainder >= 0; remainder-- {
			// Add bounds checking for Days array
			if currWk >= 0 && currWk < len(stats) && remainder >= 0 && remainder < len(stats[currWk].Days) {
				Monthly[currMonth] += stats[currWk].Days[remainder]
			}
			currDay--
		}
		fmt.Println(currDay, " ", currMonth)
		currWk--

		// Add bounds checking for currWk
		if currWk < 0 {
			break
		}

		for ; currDay > 6; currDay -= 7 {
			if currWk >= 0 && currWk < len(stats) {
				Monthly[currMonth] += stats[currWk].Total
			}
			currWk--
			if currWk < 0 {
				break
			}
		}
		fmt.Println(currDay, " ", currMonth)
		fmt.Println("final count : ", Monthly[currMonth])

		// Fix the remainder calculation to ensure it stays within bounds
		remainder = 6 - currDay
		if remainder > 6 {
			remainder = 6
		}
		if remainder < 0 {
			remainder = 0
		}

		for ; currDay >= 0; currDay-- {
			// Add bounds checking for Days array
			dayIndex := 6 - currDay
			if currWk >= 0 && currWk < len(stats) && dayIndex >= 0 && dayIndex < len(stats[currWk].Days) {
				Monthly[currMonth] += stats[currWk].Days[dayIndex]
			}
		}

		// Ensure currMonth bounds
		if currMonth > 0 {
			currDay = daysInMonth[currMonth-1] - remainder
		}
	}

	response.Monthly = Monthly

	// find most recent access
	for i, j := 0, len(stats)-1; i <= j; j = j - 1 {
		if stats[j].Total != 0 {
			t := time.Unix(stats[j].Week, 0)
			response.Accessed = fmt.Sprint(t.Format("2006-01-02"))
			break
		}
	}

	// get current week and set value to Recent
	response.Recent = Monthly[int(currentTime.Month())-1]

	// calculate percentage increase in commits and set
	if int(currentTime.Month())-1 == 0 {
		response.Increase = math.Round((float64(response.Recent)/float64(1))*100) / 100
	} else {
		response.Increase = math.Round(((float64(response.Recent)-float64(int(currentTime.Month())-2))/float64(Monthly[int(currentTime.Month())-1]))*100) / 100
	}
	denom := Monthly[10]
	if Monthly[10] == 0 {
		denom = 1
	}
	// gets increase as a float and rounds to 2nd decimal place
	response.Increase = math.Round((float64(Monthly[11]-Monthly[10])/float64(denom))*100) / 100

	return response
}
