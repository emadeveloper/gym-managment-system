package com.backend.presentation.exception;

import com.backend.domain.exception.InvalidEmailException;
import com.backend.domain.exception.InvalidCredentialsException;
import com.backend.domain.exception.InvalidPasswordException;
import com.backend.domain.exception.UserAlreadyExistsException;
import com.backend.domain.exception.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /* ---------------------------------------------------------------------- */
    /* AUTHENTICATION ERRORS (401 Unauthorized)                             */
    /* ---------------------------------------------------------------------- */

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiError> handleUserNotFound(UsernameNotFoundException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildErrorResponse("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }

    /* ---------------------------------------------------------------------- */
    /* VALIDATION ERRORS (400 Bad Request)                                  */
    /* ---------------------------------------------------------------------- */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                "Validation failed",
                errors
        ));
    }

    @ExceptionHandler(InvalidEmailException.class)
    public ResponseEntity<ApiError> handleInvalidEmail(InvalidEmailException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ApiError> handleInvalidPassword(InvalidPasswordException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /* ---------------------------------------------------------------------- */
    /* NOT FOUND ERRORS (404 Not Found)                                     */
    /* ---------------------------------------------------------------------- */

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiError> handleUserNotFoundDomain(UserNotFoundException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /* ---------------------------------------------------------------------- */
    /* CONFLICT ERRORS (409 Conflict)                                       */
    /* ---------------------------------------------------------------------- */

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.CONFLICT);
    }

    /* ---------------------------------------------------------------------- */
    /* GENERIC ERROR (500 Internal Server Error)                            */
    /* ---------------------------------------------------------------------- */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex) {
        log.error("Unhandled exception", ex);
        return buildErrorResponse(
                "An unexpected error occurred. Please try again later.",
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    /* ---------------------------------------------------------------------- */
    /* HELPER METHOD                                                         */
    /* ---------------------------------------------------------------------- */

    private ResponseEntity<ApiError> buildErrorResponse(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(new ApiError(
                status.value(),
                message,
                Map.of(
                        "error", status.getReasonPhrase(),
                        "timestamp", LocalDateTime.now().toString()
                )
        ));
    }
}
