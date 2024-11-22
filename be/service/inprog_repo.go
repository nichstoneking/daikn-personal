package service

import (
	"daikn/be/custom_errors"
	"daikn/be/dto"
	"daikn/be/error_handler"
	"daikn/be/externals"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetInprogRepoData(c *gin.Context) {
retry:
	request := &dto.RepositoryRequest{}
	// validate request
	if err := c.BindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, error_handler.HandleValidationError(err))
		return
	}
	repoCommits, err := externals.GetYrCommits(*request)
	if _, ok := err.(*custom_errors.RetryError); ok {
		fmt.Println("202 recieved retrying...")
		goto retry
	}
	if err != nil {
		c.JSON(http.StatusNotFound, err)
		return
	}

	c.IndentedJSON(http.StatusCreated, calcWkCommitResponse(*repoCommits))
}

func calcWkCommitResponse(stats dto.CommitActivityStats) dto.CommitsWkResponse {
	var response dto.CommitsWkResponse

	// calculate commits by month
	var Monthly []int
	// Jan - Dec
	// TODO: make this exact also it doesnt work the way i thought :c
	Monthly = append(Monthly, stats[0].Total+stats[1].Total+stats[2].Total+stats[3].Total)
	Monthly = append(Monthly, stats[4].Total+stats[5].Total+stats[6].Total+stats[7].Total)
	Monthly = append(Monthly, stats[8].Total+stats[9].Total+stats[10].Total+stats[11].Total+stats[12].Total)
	Monthly = append(Monthly, stats[13].Total+stats[14].Total+stats[15].Total+stats[16].Total)
	Monthly = append(Monthly, stats[17].Total+stats[18].Total+stats[19].Total+stats[20].Total)
	Monthly = append(Monthly, stats[21].Total+stats[22].Total+stats[23].Total+stats[24].Total+stats[25].Total)
	Monthly = append(Monthly, stats[26].Total+stats[27].Total+stats[28].Total+stats[29].Total)
	Monthly = append(Monthly, stats[30].Total+stats[31].Total+stats[32].Total+stats[33].Total)
	Monthly = append(Monthly, stats[34].Total+stats[35].Total+stats[36].Total+stats[37].Total+stats[38].Total)
	Monthly = append(Monthly, stats[39].Total+stats[40].Total+stats[41].Total+stats[42].Total)
	Monthly = append(Monthly, stats[43].Total+stats[44].Total+stats[45].Total+stats[46].Total)
	Monthly = append(Monthly, stats[47].Total+stats[48].Total+stats[49].Total+stats[50].Total+stats[51].Total)
	response.Monthly = Monthly

	for i, j := 0, len(stats)-1; i <= j; j = j - 1 {
		if stats[j].Total != 0 {
			t := time.Unix(stats[j].Week, 0)
			response.Accessed = fmt.Sprint(t.Format("2006-01-02"))
			break
		}
	}

	// get current week and set value to Recent
	response.Recent = Monthly[11]

	// calculate percentage increase in commits and set
	denom := Monthly[10]
	if Monthly[10] == 0 {
		denom = 1
	}
	// gets increase as a float and rounds to 2nd decimal place
	response.Increase = math.Round((float64(Monthly[11]-Monthly[10])/float64(denom))*100) / 100

	return response
}
