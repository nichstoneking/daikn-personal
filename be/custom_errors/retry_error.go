package custom_errors

type RetryError struct{}

func (m *RetryError) Error() string {
	return ""
}
