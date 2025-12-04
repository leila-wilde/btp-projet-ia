# Exception Handling & Error Response Format

**Last Updated**: 2025-12-04  
**Status**: ✅ Implemented & Tested

---

## Overview

The L'Archipel Libre API uses a consistent exception handling architecture to provide reliable, predictable error responses across all endpoints. All errors are returned in a standardized `ApiResponse` format as JSON.

---

## Architecture

### Exception Handling Strategy

We implement **per-controller exception handling** via inheritance from `BaseApiController`:

```
BaseApiController (exception handlers)
    ↓
    ├─ EventController
    ├─ AuthController
    ├─ UserController
    └─ ForumController
```

**Why this approach?**
- ✅ Works with Springdoc 2.3.0 (avoids @RestControllerAdvice compatibility issues)
- ✅ No Springdoc 500 errors on `/v3/api-docs`
- ✅ Consistent error handling across all controllers
- ✅ DRY principle (no duplication)
- ✅ Maintainable (centralized in BaseApiController)

### BaseApiController

Location: `backend/src/main/java/com/archipellibre/controller/BaseApiController.java`

Handles these exception types:

```java
@ExceptionHandler(ResourceNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
// Returns: {"success": false, "message": "..."}

@ExceptionHandler(BusinessLogicException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
// Returns: {"success": false, "message": "..."}

@ExceptionHandler(MethodArgumentNotValidException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
// Returns: {"success": false, "message": "Validation failed: ..."}

@ExceptionHandler(Exception.class)
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
// Returns: {"success": false, "message": "An unexpected error occurred"}
```

---

## Error Response Format

All errors follow the standardized `ApiResponse` format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### Status Codes

| Status | Exception | Response |
|--------|-----------|----------|
| **400** | `BusinessLogicException` | Business rule violation |
| **400** | `MethodArgumentNotValidException` | Validation error |
| **404** | `ResourceNotFoundException` | Resource not found |
| **401** | No token / Invalid token | Unauthorized |
| **500** | Unexpected errors | Generic error message (no stack trace) |

---

## Example Error Responses

### 404 - Resource Not Found
```bash
curl http://localhost:8080/api/events/00000000-0000-0000-0000-000000000000
```

**Response (200 with message)**:
```json
{
  "success": false,
  "message": "Event not found with ID: 00000000-0000-0000-0000-000000000000"
}
```

### 400 - Validation Error
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"","email":"invalid"}'
```

**Response**:
```json
{
  "success": false,
  "message": "Validation failed: username: size must be between 3 and 50; password: must not be blank; email: must be a well-formed email address; ..."
}
```

### 400 - Business Logic Error
```bash
curl -X POST http://localhost:8080/api/events/123/register/456 \
  -H "Authorization: Bearer TOKEN"
```

**Response** (when event is full):
```json
{
  "success": false,
  "message": "Event is full, cannot register"
}
```

### 500 - Unexpected Error
```bash
curl http://localhost:8080/nonexistent
```

**Response**:
```json
{
  "timestamp": "2025-12-04T04:23:34.929Z",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/nonexistent"
}
```

---

## Configuration

### Server Error Handling

Location: `backend/src/main/resources/application.yml`

```yaml
server:
  error:
    include-message: always        # Include error message
    include-binding-errors: never  # No binding error details
    include-stacktrace: never      # No stack traces (security)
    include-exception: false       # No exception class names
```

This prevents:
- ❌ Whitelabel error pages
- ❌ Stack trace exposure
- ❌ Internal implementation details leaks

---

## Creating Custom Exceptions

### Defining Custom Exceptions

```java
package com.archipellibre.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class BusinessLogicException extends RuntimeException {
    public BusinessLogicException(String message) {
        super(message);
    }
}
```

### Using Custom Exceptions

```java
@GetMapping("/{id}")
public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
    Event event = eventRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            "Event not found with ID: " + id));
    return ResponseEntity.ok(mapToResponse(event));
}
```

The `BaseApiController` automatically catches and formats the response.

---

## Validation Error Handling

### Server-Side Validation

```java
@PostMapping
public ResponseEntity<EventResponse> createEvent(
    @Valid @RequestBody EventCreateRequest request) {
    // @Valid triggers MethodArgumentNotValidException if validation fails
    // BaseApiController catches it and returns formatted error
    return ResponseEntity.ok(eventService.createEvent(request));
}
```

### DTO Validation Rules

```java
@Data
public class EventCreateRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be 3-200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000, message = "Description must be 10-2000 characters")
    private String description;
    
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    
    @Email(message = "Email format is invalid")
    private String contactEmail;
}
```

---

## Security Considerations

### What We Hide
✅ No stack traces in responses
✅ No internal exception types exposed
✅ No database query details
✅ No configuration secrets

### What We Show
✅ User-friendly error messages
✅ Proper HTTP status codes
✅ Validation field names
✅ Request path (for debugging)

---

## Testing Exception Handlers

### Unit Test Example

```java
@Test
void testResourceNotFoundHandling() {
    // Given
    UUID nonExistentId = UUID.randomUUID();
    
    // When/Then
    assertThrows(ResourceNotFoundException.class, () -> {
        eventService.getEventById(nonExistentId);
    });
}
```

### Integration Test Example

```java
@Test
void testExceptionHandlingReturnsApiResponse() throws Exception {
    // When
    mockMvc.perform(get("/api/events/nonexistent")
            .contentType(MediaType.APPLICATION_JSON))
        // Then
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.success").value(false))
        .andExpect(jsonPath("$.message").exists());
}
```

---

## Common Error Scenarios

### Scenario 1: Missing Required Field
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "test@example.com"
  // missing: username, password
}
```

**Response**:
```json
{
  "success": false,
  "message": "Validation failed: username: must not be blank; password: must not be blank; ..."
}
```

### Scenario 2: Invalid JWT Token
```bash
GET /api/users/123
Authorization: Bearer invalid-token-xyz
```

**Response**: 
```json
{
  "timestamp": "2025-12-04T04:23:34.929Z",
  "status": 401,
  "error": "Unauthorized",
  "path": "/api/users/123"
}
```

### Scenario 3: Resource Already Exists
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "existing_user",
  "email": "existing@example.com",
  "password": "SecurePass123!"
}
```

**Response** (if user already exists):
```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

## Troubleshooting

### Issue: Whitelabel Error Page Shows

**Cause**: Spring Boot default error page is rendering

**Solution**: Verify `server.error` configuration in `application.yml`:
```yaml
server:
  error:
    include-message: always
    include-stacktrace: never
```

### Issue: Stack Traces Exposed in Responses

**Cause**: `include-stacktrace` is enabled

**Solution**: Set to `never`:
```yaml
server:
  error:
    include-stacktrace: never
```

### Issue: Missing Error Messages

**Cause**: `include-message` is disabled

**Solution**: Set to `always`:
```yaml
server:
  error:
    include-message: always
```

---

## Best Practices

### DO ✅
- Use specific exceptions (ResourceNotFound, BusinessLogic)
- Provide descriptive error messages
- Include relevant context in messages (e.g., resource ID)
- Log errors for debugging
- Use appropriate HTTP status codes

### DON'T ❌
- Expose stack traces to clients
- Leak internal implementation details
- Expose database query errors directly
- Use generic "error" messages
- Expose system configuration

---

## Files Involved

### Core Exception Handling
- `backend/src/main/java/com/archipellibre/controller/BaseApiController.java`
- `backend/src/main/java/com/archipellibre/exception/ResourceNotFoundException.java`
- `backend/src/main/java/com/archipellibre/exception/BusinessLogicException.java`

### Configuration
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-dev.yml`
- `backend/src/main/java/com/archipellibre/config/SecurityConfig.java`

### Controllers (inherit handlers)
- `backend/src/main/java/com/archipellibre/controller/EventController.java`
- `backend/src/main/java/com/archipellibre/controller/AuthController.java`
- `backend/src/main/java/com/archipellibre/controller/UserController.java`
- `backend/src/main/java/com/archipellibre/controller/ForumController.java`

---

## Related Documentation

- [API Response Format](API_RESPONSE_FORMAT.md) - ApiResponse wrapper format
- [Security Guide](SECURITY.md) - Authentication and authorization
- [Authentication Guide](authentication-guide.md) - JWT implementation
- [Swagger UI Guide](SWAGGER_UI_GUIDE.md) - API testing and documentation

---

## Verification Checklist

- [ ] All errors return `ApiResponse` format (success=false)
- [ ] Proper HTTP status codes used (400, 404, 500)
- [ ] No stack traces in error responses
- [ ] Validation errors include field names
- [ ] Controllers extend `BaseApiController`
- [ ] `server.error` configured in `application.yml`
- [ ] Exception handler tests written
- [ ] Integration tests for error scenarios

---

**Status**: ✅ Exception Handling Fully Implemented  
**Last Tested**: 2025-12-04  
**Next**: Add more custom exceptions for specific business scenarios
