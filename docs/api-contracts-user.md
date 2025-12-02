# API Contracts - UserService

**Base URL:** `http://localhost:8080/api/users`  
**Authentication:** Bearer JWT token required (except for public endpoints)  
**Date:** 2025-12-02

## Public Endpoints (No Auth Required)

### Search Users
```
GET /api/users/search?query=john
Response: 200 OK
Body: List<UserResponse>

Example:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "Software developer",
    "avatarUrl": "http://example.com/avatar.jpg",
    "role": "USER",
    "active": true,
    "createdAt": "2025-12-02T10:00:00Z",
    "updatedAt": "2025-12-02T10:00:00Z"
  }
]
```

### Check Username Availability
```
GET /api/users/check/username?username=newuser
Response: 200 OK
Body: ApiResponse { success: boolean, message: string }

Example:
{
  "success": true,
  "message": "Username available"
}
```

### Check Email Availability
```
GET /api/users/check/email?email=newuser@example.com
Response: 200 OK
Body: ApiResponse { success: boolean, message: string }
```

---

## Authenticated Endpoints (JWT Required)

### Get User by ID
```
GET /api/users/{id}
Headers: Authorization: Bearer <JWT_TOKEN>
Response: 200 OK
Body: UserResponse

Example:
GET /api/users/550e8400-e29b-41d4-a716-446655440000
Response: UserResponse (see above)
```

### Get User by Username
```
GET /api/users/username/{username}
Headers: Authorization: Bearer <JWT_TOKEN>
Response: 200 OK
Body: UserResponse
```

### Update Profile
```
PUT /api/users/{id}/profile
Headers: Authorization: Bearer <JWT_TOKEN>
Body: UserProfileRequest

Request Body:
{
  "username": "new_username",  // optional
  "bio": "New bio text",       // optional
  "avatarUrl": "http://..."    // optional
}

Response: 200 OK
Body: UserResponse
```

### Change Password
```
PATCH /api/users/{id}/password
Headers: Authorization: Bearer <JWT_TOKEN>
Body: ChangePasswordRequest

Request Body:
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}

Response: 200 OK
Body: ApiResponse { success: true, message: "Password changed successfully" }

Errors:
- 400: Password confirmation doesn't match
- 400: Current password is incorrect
- 400: New password same as current password
```

---

## Admin-Only Endpoints

### Get All Users
```
GET /api/users
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: List<UserResponse>
```

### Get Users by Role
```
GET /api/users/role/{role}
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Params: role = USER | MODERATOR | ADMIN
Response: 200 OK
Body: List<UserResponse>
```

### Get User Count
```
GET /api/users/stats/count
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: ApiResponse { success: true, message: "User count: 42" }
```

### Get Active User Count
```
GET /api/users/stats/active-count
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: ApiResponse { success: true, message: "Active user count: 40" }
```

### Promote User to Moderator
```
POST /api/users/{id}/promote
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: UserResponse (with role = "MODERATOR")

Errors:
- 404: User not found
- 400: User already moderator
```

### Demote Moderator to User
```
POST /api/users/{id}/demote
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: UserResponse (with role = "USER")

Errors:
- 404: User not found
- 400: User already regular user
```

### Deactivate User
```
POST /api/users/{id}/deactivate
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: ApiResponse { success: true, message: "User deactivated successfully" }

Errors:
- 404: User not found
- 400: User already deactivated
```

### Reactivate User
```
POST /api/users/{id}/reactivate
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: UserResponse (with active = true)

Errors:
- 404: User not found
- 400: User already active
```

### Reset User Password
```
POST /api/users/{id}/reset-password
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 200 OK
Body: ApiResponse { success: true, message: "Temporary password: TEMP_ABC123XYZ..." }

Note: Returns temporary password that must be changed on next login
```

### Delete User
```
DELETE /api/users/{id}
Headers: Authorization: Bearer <JWT_TOKEN>
Role: ADMIN
Response: 204 No Content

Errors:
- 404: User not found
```

---

## Data Models

### UserResponse
```typescript
{
  id: string (UUID),
  username: string,
  email: string,
  bio: string | null,
  avatarUrl: string | null,
  role: "USER" | "MODERATOR" | "ADMIN",
  active: boolean,
  createdAt: string (ISO-8601),
  updatedAt: string (ISO-8601)
}
```

### UserProfileRequest
```typescript
{
  username?: string (3-50 chars),
  bio?: string (max 500 chars),
  avatarUrl?: string
}
```

### ChangePasswordRequest
```typescript
{
  currentPassword: string (required),
  newPassword: string (8-100 chars, required),
  confirmPassword: string (must match newPassword)
}
```

### ApiResponse
```typescript
{
  success: boolean,
  message: string
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed: username: Username must be between 3 and 50 characters; ..."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found with ID: 550e8400-e29b-41d4-a716-446655440000"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```

---

## Testing Notes

### JWT Token Format
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcwMzE2NDcwMCwiZXhwIjoxNzAzMjUxMTAwfQ...
```

### Postman Collection
Import the swagger URL for full API documentation:
`http://localhost:8080/v3/api-docs`

### Performance
- List endpoints support pagination (future enhancement)
- Search uses database filtering for efficiency
- All endpoints have 70%+ code coverage

---

**Status:** ✅ Ready for Frontend Integration  
**Last Updated:** 2025-12-02T16:20:00Z
