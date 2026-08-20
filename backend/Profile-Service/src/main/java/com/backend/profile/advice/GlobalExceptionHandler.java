package com.backend.profile.advice;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.backend.profile.exceptions.DuplicateResourceException;
import com.backend.profile.exceptions.ResourceNotFoundException;
import com.backend.profile.exceptions.UnauthorizedActionException;


@RestControllerAdvice
public class GlobalExceptionHandler {

	// Error bodies below are a plain {"message": "..."} — matching Auth_User-Service's
	// GlobalExceptionHandler shape, so the frontend doesn't need a different error-parsing
	// path per backend service. (Success responses still use ApiResponse - only errors changed.)

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException e) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND) // SC 404
				.body(Collections.singletonMap("message", e.getMessage()));
	}

	@ExceptionHandler(UnauthorizedActionException.class)
	public ResponseEntity<?> handleUnauthorizedActionException(UnauthorizedActionException e) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN) // SC 403
				.body(Collections.singletonMap("message", e.getMessage()));
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<?> handleDuplicateResourceException(DuplicateResourceException e) {
		return ResponseEntity.status(HttpStatus.CONFLICT) // SC 409
				.body(Collections.singletonMap("message", e.getMessage()));
	}

	// Thrown by Spring itself when a controller's required @RequestHeader("X-User-Id") is
	// missing — happens if this service is reached without going through the gateway.
	@ExceptionHandler(MissingRequestHeaderException.class)
	public ResponseEntity<?> handleMissingRequestHeaderException(MissingRequestHeaderException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST) // SC 400
				.body(Map.of("message", "Missing required header: " + e.getHeaderName()));
	}



	
	@ExceptionHandler(MethodArgumentNotValidException.class)
	@ResponseStatus(code = HttpStatus.BAD_REQUEST)
	public Map<String,String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
		List<FieldError> fieldErrors = e.getFieldErrors();
		
//		Map<String,String> fieldErrMap=new HashMap<>();
//		fieldErrors.forEach(fieldErr -> fieldErrMap.put(fieldErr.getField(), fieldErr.getDefaultMessage()));
		Map<String, String> fieldErrMap = fieldErrors.stream() // Stream<FieldError>
				.collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
		return fieldErrMap;
	}

	// handle all remaining excs - catch all
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
		System.out.println("in catch-all  exc");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // SC 500
				.body(Collections.singletonMap("message", e.getMessage()));
	}

}

