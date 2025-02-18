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
		c.JSON(http.StatusBadRequest, errors.HandleValidationError(err))
		return
	}

	repoCommits, err := externals.GetYrCommits(*request)
	if _, ok := err.(*errors.RetryError); ok {
		fmt.Println("202 recieved retrying...")
		goto retry
	}
	if err != nil {
		c.JSON(http.StatusNotFound, err)
		return
	}

	c.IndentedJSON(http.StatusCreated, calcWkCommitResponse(*repoCommits))
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

	fmt.Println(stats[51].Total)

	for ; currMonth >= 0; currMonth-- {
		fmt.Println(currDay, " ", currMonth)
		for ; remainder >= 0; remainder-- {
			Monthly[currMonth] += stats[currWk].Days[remainder]
			currDay--
		}
		fmt.Println(currDay, " ", currMonth)
		currWk--
		for ; currDay > 6; currDay -= 7 {
			Monthly[currMonth] += stats[currWk].Total
			currWk--
		}
		fmt.Println(currDay, " ", currMonth)
		fmt.Println("final count : ", Monthly[currMonth])
		remainder = 6 - currDay
		for ; currDay >= 0; currDay-- {
			Monthly[currMonth] += stats[currWk].Days[6-currDay]
		}
		currDay = daysInMonth[currMonth] - remainder
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
