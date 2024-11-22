package externals

import (
	"daikn/be/custom_errors"
	"daikn/be/dto"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func GetYrCommits(request dto.RepositoryRequest) (*dto.CommitActivityStats, error) {
	token := os.Getenv("GITHUB_KEY")

	stats := dto.CommitActivityStats{}

	// create http client
	client := &http.Client{}

	// build http request
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/stats/commit_activity", request.Owner, request.Repo)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Printf("Error building request: %v\n", err)
		return nil, err
	}
	req.Header.Add("Accept", "application/vnd.github+json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Add("X-GitHub-Api-Version", "2022-11-28")

	// make http request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusAccepted {
		return nil, &custom_errors.RetryError{}
	}

	// Check status code
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("Error: status code %d\nResponse: %s\n", resp.StatusCode, string(body))
		return nil, err
	}

	if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
		fmt.Printf("Error decoding response: %v\n", err)
		return nil, err
	}

	return &stats, nil
}
