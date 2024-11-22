package main

import (
	"daikn/be/dto"
	"daikn/be/service"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

var repos = []dto.RepositoryRequest{
	{Owner: "daikonk", Repo: "daikn-personal"},
	{Owner: "daikonk", Repo: "amiami-bot"},
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()

	router.Use(CORSMiddleware())
	router.POST("/repo", service.GetInprogRepoData)

	router.Run()
}
