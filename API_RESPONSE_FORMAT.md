# API Response Format Standard

**Last Updated**: 2025-12-04  
**Version**: 1.0  
**Status**: Documented (Implementation pending)

---

## Overview

All L'Archipel Libre API endpoints follow a consistent response format using `ApiResponseWrapper<T>`. This ensures:
- Uniform response structure across all endpoints
- Predictable error handling
- Clear success/failure indication
- Consistent pagination format
- ISO 8601 timestamps on all responses

---

## Response Structure

### Basic Format

```json
{
  "success": boolean,           // true for success, false for error
  "message": "string",          // Human-readable result message
  "data": T,                    // Actual response data (optional)
  "errors": ["string"],         // Validation errors (optional, error only)
  "pagination": { ... },        // Pagination metadata (optional, lists only)
  "timestamp": "ISO-8601"       // When response was generated
}
```

---

## Response Types

### 1. Success - Single Resource

**Used for**: GET single item, POST/PUT operations

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER",
    "active": true,
    "createdAt": "2025-12-04T02:47:27Z",
    "updatedAt": "2025-12-04T02:47:27Z"
  },
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**HTTP Status**: `200 OK` (GET), `201 Created` (POST), `200 OK` (PUT)

---

### 2. Success - Message Only

**Used for**: DELETE operations, status checks, simple confirmations

```json
{
  "success": true,
  "message": "Password changed successfully",
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**HTTP Status**: `200 OK` or `204 No Content`

---

### 3. Success - Paginated List

**Used for**: GET endpoints that return multiple items

```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Tech Meetup",
      "description": "Community gathering",
      "startTime": "2025-12-20T18:00:00Z",
      "endTime": "2025-12-20T20:00:00Z",
      "location": "Paris",
      "status": "SCHEDULED",
      "maxParticipants": 50,
      "participantCount": 12
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Workshop: Angular Best Practices",
      "description": "Advanced Angular patterns",
      "startTime": "2025-12-21T10:00:00Z",
      "endTime": "2025-12-21T12:00:00Z",
      "location": "Lyon",
      "status": "SCHEDULED",
      "maxParticipants": 30,
      "participantCount": 25
    }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 156,
    "totalPages": 16
  },
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**HTTP Status**: `200 OK`

**Query Parameters**:
- `page`: Page number (0-indexed, default: 0)
- `size`: Items per page (default: 10, max: 100)
- `sort`: Sort criteria (e.g., `sort=createdAt,desc`)

---

### 4. Success - Simple List (Non-Paginated)

**Used for**: Small lists that don't need pagination

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    { "id": "...", "username": "user1", "role": "USER" },
    { "id": "...", "username": "user2", "role": "MODERATOR" }
  ],
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**HTTP Status**: `200 OK`

---

### 5. Error - Single Error

**Used for**: Resource not found, unauthorized, simple validation errors

```json
{
  "success": false,
  "message": "User not found",
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**HTTP Status**: `404 Not Found`

**Common Messages**:
- "User not found" → `404 Not Found`
- "Invalid credentials" → `401 Unauthorized`
- "Access denied" → `403 Forbidden`
- "Username already exists" → `400 Bad Request`

---

### 6. Error - Validation Errors

**Used for**: Form submission errors, multiple validation failures

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "username: must not be blank",
    "email: must be a valid email format",
    "password: must be at least 8 characters",
    "password: must contain at least one uppercase letter"
  ],
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**HTTP Status**: `400 Bad Request`

---

## HTTP Status Codes

| Status | Meaning | When to Use |
|--------|---------|------------|
| `200` | OK | Successful GET, PUT, PATCH, DELETE |
| `201` | Created | Successful POST (resource created) |
| `204` | No Content | Successful DELETE (no response body) |
| `400` | Bad Request | Invalid input, validation errors |
| `401` | Unauthorized | Missing/invalid authentication |
| `403` | Forbidden | Authenticated but no permission |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource already exists |
| `500` | Server Error | Unexpected server error |

---

## Controller Implementation Guide

### Single Resource Endpoint

```java
@GetMapping("/{id}")
public ResponseEntity<ApiResponseWrapper<UserResponse>> getUserById(@PathVariable UUID id) {
    User user = userService.getUserById(id);
    UserResponse response = mapToResponse(user);
    return ResponseEntity.ok(
        ApiResponseWrapper.success(response, "User retrieved successfully")
    );
}
```

### Paginated List Endpoint

```java
@GetMapping
public ResponseEntity<ApiResponseWrapper<List<EventResponse>>> getAllEvents(Pageable pageable) {
    Page<Event> page = eventService.getAllEvents(pageable);
    List<EventResponse> data = page.map(this::mapToResponse).getContent();
    
    return ResponseEntity.ok(
        ApiResponseWrapper.success(
            data,
            "Events retrieved successfully",
            ApiResponseWrapper.PaginationInfo.from(page)
        )
    );
}
```

### Create Endpoint

```java
@PostMapping
public ResponseEntity<ApiResponseWrapper<UserResponse>> createUser(
        @Valid @RequestBody CreateUserRequest request) {
    User created = userService.createUser(request);
    UserResponse response = mapToResponse(created);
    
    return ResponseEntity.status(HttpStatus.CREATED).body(
        ApiResponseWrapper.success(response, "User created successfully")
    );
}
```

### Delete Endpoint

```java
@DeleteMapping("/{id}")
public ResponseEntity<ApiResponseWrapper<Void>> deleteUser(@PathVariable UUID id) {
    userService.deleteUser(id);
    return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
        ApiResponseWrapper.success("User deleted successfully")
    );
}
```

### Error Handling

```java
@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity<ApiResponseWrapper<Void>> handleNotFound(
        ResourceNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        ApiResponseWrapper.error(ex.getMessage())
    );
}

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ApiResponseWrapper<Void>> handleValidation(
        MethodArgumentNotValidException ex) {
    List<String> errors = ex.getBindingResult().getAllErrors().stream()
        .map(error -> error.getObjectName() + ": " + error.getDefaultMessage())
        .collect(Collectors.toList());
    
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
        ApiResponseWrapper.error("Validation failed", errors)
    );
}
```

---

## Frontend Usage Examples

### Handling Success Response

```typescript
// Service
getUser(id: string): Observable<ApiResponse<User>> {
  return this.http.get<ApiResponse<User>>(`/api/users/${id}`);
}

// Component
this.userService.getUser(userId).subscribe({
  next: (response: ApiResponse<User>) => {
    if (response.success) {
      this.user = response.data;
      this.showMessage(response.message);
    }
  },
  error: (error) => {
    this.showError(error.error?.message || 'Unknown error');
  }
});
```

### Handling Paginated List

```typescript
// Service
getEvents(page: number = 0, size: number = 10): 
  Observable<ApiResponse<Event[]>> {
  return this.http.get<ApiResponse<Event[]>>(
    `/api/events?page=${page}&size=${size}`
  );
}

// Component
this.eventService.getEvents(pageIndex, pageSize).subscribe({
  next: (response) => {
    this.events = response.data;
    this.totalItems = response.pagination.totalElements;
    this.pageCount = response.pagination.totalPages;
  }
});
```

### Handling Validation Errors

```typescript
this.userService.register(formData).subscribe({
  next: (response) => {
    this.showMessage(response.message);
  },
  error: (error) => {
    if (error.error?.errors && Array.isArray(error.error.errors)) {
      // Multiple validation errors
      error.error.errors.forEach(err => this.showError(err));
    } else {
      // Single error
      this.showError(error.error?.message);
    }
  }
});
```

---

## API Response Wrapper Class

**Location**: `backend/src/main/java/com/archipellibre/dto/ApiResponseWrapper.java`

**Type Parameters**: 
- `<T>` - The type of data in the response (User, Event, List<Event>, etc.)

**Factory Methods**:
- `success(T data, String message)` - Success with data
- `success(String message)` - Success without data
- `success(T data, String message, PaginationInfo)` - Success with pagination
- `error(String message)` - Single error
- `error(String message, List<String> errors)` - Multiple errors

**Nested Class**:
- `PaginationInfo` - Pagination metadata with `from(Page<?> page)` converter

---

## Migration Guide

### From Old Format to New Format

**Old** (inconsistent):
```java
// Different response types across endpoints
return ResponseEntity.ok(user);                    // Raw data
return ResponseEntity.ok(new ApiResponse(...));    // Message only
return ResponseEntity.ok(page.map(...));           // Page without metadata
```

**New** (standardized):
```java
// All endpoints use consistent wrapper
return ResponseEntity.ok(ApiResponseWrapper.success(user, "User retrieved"));
return ResponseEntity.ok(ApiResponseWrapper.success("Operation completed"));
return ResponseEntity.ok(ApiResponseWrapper.success(data, "Items retrieved", 
    ApiResponseWrapper.PaginationInfo.from(page)));
```

---

## Examples by Endpoint

### Authentication

**POST /api/auth/register**

Success (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "timestamp": "2025-12-04T02:47:27Z"
}
```

Error (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "username: Username already exists",
    "email: Email already in use"
  ],
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**POST /api/auth/login**

Success (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "timestamp": "2025-12-04T02:47:27Z"
}
```

### Events

**GET /api/events?page=0&size=10**

Success (200):
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 156,
    "totalPages": 16
  },
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**POST /api/events**

Success (201):
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Tech Meetup",
    "status": "SCHEDULED"
  },
  "timestamp": "2025-12-04T02:47:27Z"
}
```

**DELETE /api/events/{id}**

Success (204):
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "timestamp": "2025-12-04T02:47:27Z"
}
```

---

## Testing

### Unit Test Example

```java
@Test
void testGetUserSuccess() {
    User user = User.builder().username("john").build();
    when(userService.getUserById(userId)).thenReturn(user);
    
    ApiResponseWrapper<UserResponse> response = controller.getUserById(userId);
    
    assertThat(response.getSuccess()).isTrue();
    assertThat(response.getMessage()).contains("successfully");
    assertThat(response.getData()).isNotNull();
    assertThat(response.getTimestamp()).isNotNull();
}

@Test
void testValidationError() {
    ApiResponseWrapper<Void> response = 
        ApiResponseWrapper.error("Validation failed", 
            List.of("email: must be valid"));
    
    assertThat(response.getSuccess()).isFalse();
    assertThat(response.getErrors()).hasSize(1);
}
```

---

## Best Practices

✅ **DO**:
- Always wrap responses in `ApiResponseWrapper`
- Include meaningful messages (not generic "OK")
- Use appropriate HTTP status codes
- Provide pagination for list endpoints
- Return specific error messages
- Include validation details in error responses

❌ **DON'T**:
- Return raw data without wrapper
- Use generic "Success" or "Error" messages
- Forget pagination metadata on lists
- Include sensitive data in error messages
- Inconsistent response formats per controller

---

## Deployment Checklist

- [ ] All controllers updated to use `ApiResponseWrapper`
- [ ] Exception handlers return wrapped responses
- [ ] Pagination implemented on all list endpoints
- [ ] Test cases updated to verify wrapper format
- [ ] Frontend services updated to handle new format
- [ ] API documentation updated with examples
- [ ] Backend tests passing (91/91)
- [ ] Frontend tests passing (247/247)

---

**Status**: Documented, pending implementation  
**Estimated Implementation**: 1-2 days  
**Priority**: High (improves consistency and maintainability)
