# Swagger UI / OpenAPI Documentation

**Status**: ✅ Enabled and Configured  
**Version**: Springdoc-OpenAPI 2.6.0 with Spring Boot 3.5.0  
**Last Updated**: 2025-12-04

---

## Accessing Swagger UI

### Development

Access the interactive API documentation at:

```
http://localhost:8080/swagger-ui.html
```

### API Endpoints

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`
- **OpenAPI YAML**: `http://localhost:8080/v3/api-docs.yaml`

---

## What's Available in Swagger

### All API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

#### Users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/username/{username}` - Get user by username
- `GET /api/users/search` - Search users
- `GET /api/users` - List all users (admin only)
- `GET /api/users/role/{role}` - Get users by role
- `PUT /api/users/{id}/profile` - Update profile
- `PATCH /api/users/{id}/password` - Change password
- `POST /api/users/{id}/promote` - Promote to moderator
- `POST /api/users/{id}/demote` - Demote to user
- `POST /api/users/{id}/deactivate` - Deactivate user
- `DELETE /api/users/{id}` - Delete user

#### Events
- `GET /api/events` - List all events (paginated)
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event (admin only)
- `GET /api/events/status/{status}` - Get events by status
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/organizer/{organizerId}` - Get events by organizer
- `GET /api/events/participant/{userId}` - Get user's registered events
- `POST /api/events/{eventId}/register/{userId}` - Register for event
- `POST /api/events/{eventId}/unregister/{userId}` - Unregister from event
- `GET /api/events/{eventId}/stats` - Get event statistics

#### Forum
- `GET /api/forum/threads` - List forum threads (paginated)
- `GET /api/forum/threads/{id}` - Get thread by ID
- `POST /api/forum/threads` - Create forum thread
- `PUT /api/forum/threads/{id}` - Update thread
- `DELETE /api/forum/threads/{id}` - Delete thread (moderator+)
- `GET /api/forum/threads/category/{category}` - Get threads by category
- `POST /api/forum/threads/{id}/pin` - Pin thread (moderator+)
- `POST /api/forum/threads/{id}/lock` - Lock thread (moderator+)
- `POST /api/forum/threads/{threadId}/posts` - Create forum post
- `GET /api/forum/posts/{id}` - Get post by ID
- `PUT /api/forum/posts/{id}` - Update post
- `DELETE /api/forum/posts/{id}` - Delete post (moderator+)
- `POST /api/forum/posts/{id}/flag` - Flag post for moderation

---

## Authentication in Swagger

### Using Bearer Token

1. Click the **Authorize** button at top-right
2. Enter your JWT token in the format: `eyJhbGc...` (token only, no "Bearer " prefix)
3. Click **Authorize**
4. All requests will now include the Authorization header

### Getting a Token

1. Use `POST /api/auth/login` endpoint
2. Provide username/email and password
3. Response will contain `accessToken`
4. Copy token to Authorize dialog

---

## Request/Response Examples

### Example: Login and Get Events

**1. Login**

Request:
```bash
POST /api/auth/login
{
  "usernameOrEmail": "john@example.com",
  "password": "SecurePassword123!"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "timestamp": "2025-12-04T02:52:00Z"
}
```

**2. Copy token to Swagger Authorize**

Copy the `accessToken` value

**3. Get Events List**

Request:
```bash
GET /api/events?page=0&size=10
```

Response:
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
      "status": "SCHEDULED",
      "maxParticipants": 50,
      "participantCount": 12
    }
  ],
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 156,
    "totalPages": 16
  },
  "timestamp": "2025-12-04T02:52:00Z"
}
```

---

## Configuration

### Application Configuration

Location: `backend/src/main/resources/application.yml`

```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operationsSorter: method
    tagsSorter: alpha
```

### OpenAPI Bean Configuration

Location: `backend/src/main/java/com/archipellibre/config/OpenApiConfig.java`

Features:
- Project title and description
- Contact information
- License information
- JWT Bearer authentication scheme
- Security requirement on all endpoints

---

## Troubleshooting

### Swagger UI Not Loading

**Problem**: Page shows blank or 404

**Solutions**:
1. Check Springdoc dependency is enabled in pom.xml
2. Verify Spring Boot is running: `mvn spring-boot:run`
3. Check port is 8080: `curl http://localhost:8080/swagger-ui.html`
4. Clear browser cache (Ctrl+F5)

### Authorization Not Working

**Problem**: Token accepted but endpoints still return 401

**Solutions**:
1. Verify token is valid (not expired)
2. Check token doesn't include "Bearer " prefix in Authorize dialog
3. Ensure endpoint requires authentication
4. Check JWT secret is configured: `echo $JWT_SECRET`

### Missing Endpoints

**Problem**: Expected endpoint not showing in Swagger

**Solutions**:
1. Verify controller has `@RestController` annotation
2. Check method has `@GetMapping`, `@PostMapping`, etc.
3. Rebuild: `mvn clean compile`
4. Restart Spring Boot

---

## Best Practices

✅ **DO**:
- Use descriptive endpoint descriptions
- Document request/response models
- Include example values
- Document validation rules
- Note required parameters
- Specify error responses

❌ **DON'T**:
- Expose sensitive information in docs
- Document internal implementation details
- Include production secrets in examples

---

## API Documentation Standards

### Endpoint Annotation Example

```java
@GetMapping("/{id}")
@Operation(summary = "Get user by ID", 
    description = "Retrieve a specific user's profile information")
@ApiResponse(responseCode = "200", 
    description = "User found and returned successfully",
    content = @Content(mediaType = "application/json",
        schema = @Schema(implementation = UserResponse.class)))
@ApiResponse(responseCode = "404", 
    description = "User not found")
public ResponseEntity<ApiResponseWrapper<UserResponse>> getUserById(
    @PathVariable 
    @Parameter(description = "User ID")
    UUID id) {
    ...
}
```

### Request Body Example

```java
@PostMapping
public ResponseEntity<ApiResponseWrapper<UserResponse>> createUser(
    @Valid @RequestBody 
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
        description = "User details to create",
        content = @Content(mediaType = "application/json",
            examples = @ExampleObject(value = "{\"username\": \"john\", \"email\": \"john@example.com\"}")))
    CreateUserRequest request) {
    ...
}
```

---

## Files Modified/Created

### Modified
- `backend/pom.xml`
  - Uncommented springdoc-openapi dependency
  - Updated version to 2.6.0 (compatible with Spring Boot 3.5.0)
  - Removed unnecessary exclusions

### Created
- `backend/src/main/java/com/archipellibre/config/OpenApiConfig.java`
  - OpenAPI bean configuration
  - JWT authentication scheme setup
  - Project metadata

### Already Present
- `backend/src/main/resources/application.yml`
  - Springdoc configuration
  - Swagger UI path settings

---

## Next Steps

### Phase 1: Complete Documentation (Recommended)

Add `@Operation` and `@ApiResponse` annotations to all endpoints:
- EventController (18 endpoints)
- UserController (14 endpoints)
- ForumController (20 endpoints)
- AuthController (3 endpoints)

**Effort**: 4-6 hours
**Benefit**: Fully documented API in Swagger

### Phase 2: Model Documentation

Add `@Schema` annotations to response DTOs:
- UserResponse, EventResponse, ForumThreadResponse, ForumPostResponse
- Add field descriptions and examples

**Effort**: 2-3 hours
**Benefit**: Better request/response documentation

### Phase 3: Examples & Testing

Add example requests/responses:
- Common workflows
- Error scenarios
- Pagination examples

**Effort**: 2-3 hours
**Benefit**: Developers can copy-paste examples

---

## Verification

### Test Endpoints in Swagger

```bash
# Start backend
cd backend && mvn spring-boot:run

# Open browser
http://localhost:8080/swagger-ui.html

# Test endpoints:
1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/events (with token)
4. POST /api/events (with token)
```

---

## Resources

- [Springdoc-OpenAPI Documentation](https://springdoc.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Guide](https://swagger.io/tools/swagger-ui/)
- [Spring Boot 3.5.0 Release Notes](https://spring.io/blog/2025/03/06/spring-boot-3-5-0-released)

---

**Status**: ✅ Swagger UI Configured and Ready  
**Access**: http://localhost:8080/swagger-ui.html  
**Next**: Add endpoint documentation annotations (Phase 1)
