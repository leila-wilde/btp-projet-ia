package com.archipellibre.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Standardized API Response Wrapper
 * 
 * All API endpoints should return responses wrapped in this format.
 * 
 * SUCCESS RESPONSE EXAMPLES:
 * 
 * Single Resource:
 * {
 *   "success": true,
 *   "message": "User retrieved successfully",
 *   "data": { "id": "...", "username": "john" },
 *   "timestamp": "2025-12-04T02:47:27Z"
 * }
 * 
 * Message Only:
 * {
 *   "success": true,
 *   "message": "Password changed successfully",
 *   "timestamp": "2025-12-04T02:47:27Z"
 * }
 * 
 * Paginated List:
 * {
 *   "success": true,
 *   "message": "Events retrieved successfully",
 *   "data": [ { "id": "...", "title": "Event 1" }, ... ],
 *   "pagination": {
 *     "page": 0,
 *     "size": 10,
 *     "totalElements": 100,
 *     "totalPages": 10
 *   },
 *   "timestamp": "2025-12-04T02:47:27Z"
 * }
 * 
 * ERROR RESPONSE EXAMPLES:
 * 
 * Single Error:
 * {
 *   "success": false,
 *   "message": "User not found",
 *   "timestamp": "2025-12-04T02:47:27Z"
 * }
 * 
 * Validation Errors:
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": [
 *     "username: must not be blank",
 *     "email: must be a valid email",
 *     "password: must be at least 6 characters"
 *   ],
 *   "timestamp": "2025-12-04T02:47:27Z"
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponseWrapper<T> {
    
    /**
     * Indicates success (true) or failure (false) of the request
     */
    private Boolean success;
    
    /**
     * Human-readable message describing the operation result
     * Examples: "User created successfully", "Invalid credentials", "Resource not found"
     */
    private String message;
    
    /**
     * The actual response data (entity, list, or null if not applicable)
     */
    private T data;
    
    /**
     * Validation or error details (only in error responses with multiple errors)
     */
    private java.util.List<String> errors;
    
    /**
     * Pagination metadata (only for paginated list endpoints)
     */
    private PaginationInfo pagination;
    
    /**
     * ISO 8601 timestamp when response was generated
     */
    private LocalDateTime timestamp;
    
    // ===== FACTORY METHODS =====
    
    /**
     * Success response with single data object
     * @param data The response data
     * @param message Success message
     * @return ApiResponseWrapper with data
     */
    public static <T> ApiResponseWrapper<T> success(T data, String message) {
        return ApiResponseWrapper.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Success response with just a message (no data)
     * @param message Success message
     * @return ApiResponseWrapper with message only
     */
    public static <T> ApiResponseWrapper<T> success(String message) {
        return ApiResponseWrapper.<T>builder()
                .success(true)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Success response with data and pagination info
     * @param data The list of items
     * @param message Success message
     * @param pagination Pagination metadata
     * @return ApiResponseWrapper with paginated data
     */
    public static <T> ApiResponseWrapper<T> success(T data, String message, PaginationInfo pagination) {
        return ApiResponseWrapper.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .pagination(pagination)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Error response with single error message
     * @param message Error description
     * @return ApiResponseWrapper indicating failure
     */
    public static <T> ApiResponseWrapper<T> error(String message) {
        return ApiResponseWrapper.<T>builder()
                .success(false)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Error response with multiple validation errors
     * @param message Main error message (e.g., "Validation failed")
     * @param errors List of specific error details
     * @return ApiResponseWrapper with validation errors
     */
    public static <T> ApiResponseWrapper<T> error(String message, java.util.List<String> errors) {
        return ApiResponseWrapper.<T>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    /**
     * Pagination metadata for list responses
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaginationInfo {
        /**
         * Current page number (0-indexed)
         */
        private Integer page;
        
        /**
         * Number of items per page
         */
        private Integer size;
        
        /**
         * Total number of items across all pages
         */
        private Long totalElements;
        
        /**
         * Total number of pages
         */
        private Integer totalPages;
        
        /**
         * Convert Spring's Page object to PaginationInfo
         * @param page Spring Page object
         * @return PaginationInfo instance
         */
        public static PaginationInfo from(org.springframework.data.domain.Page<?> page) {
            return PaginationInfo.builder()
                    .page(page.getNumber())
                    .size(page.getSize())
                    .totalElements(page.getTotalElements())
                    .totalPages(page.getTotalPages())
                    .build();
        }
    }
}
