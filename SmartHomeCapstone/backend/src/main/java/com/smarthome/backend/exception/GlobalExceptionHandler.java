package com.smarthome.backend.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

        /** Handle validation errors */
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<Map<String, Object>> handleValidationExceptions(
                        MethodArgumentNotValidException ex) {
                Map<String, Object> response = new HashMap<>();
                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult()
                                .getAllErrors()
                                .forEach(
                                                (error) -> {
                                                        String fieldName = ((FieldError) error).getField();
                                                        String errorMessage = error.getDefaultMessage();
                                                        errors.put(fieldName, errorMessage);
                                                });

                response.put("timestamp", LocalDateTime.now());
                response.put("status", HttpStatus.BAD_REQUEST.value());
                response.put("error", "Validation Failed");
                response.put("message", "Invalid input data");
                response.put("details", errors);

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        /** Handle general runtime exceptions */
        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
                Map<String, Object> response = new HashMap<>();

                response.put("timestamp", LocalDateTime.now());
                response.put("status", HttpStatus.BAD_REQUEST.value());
                response.put("error", "Bad Request");
                response.put("message", ex.getMessage());

                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        /** Handle general exceptions */
        @ExceptionHandler(Exception.class)
        public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
                Map<String, Object> response = new HashMap<>();

                response.put("timestamp", LocalDateTime.now());
                response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
                response.put("error", "Internal Server Error");
                response.put("message", "An unexpected error occurred");

                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
}
