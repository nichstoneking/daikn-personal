package error_handler

import "github.com/go-playground/validator/v10"

type ErrorMsg struct {
	Errors []ErrorResponse `json:"errors"`
}

type ErrorResponse struct {
	Field   string `json:"field"`
	Message string `json:"message"`
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
