# Authentication & Authorization Guide

## 🔐 Overview

L'Archipel Libre implements a comprehensive authentication and authorization system using:
- **JWT (JSON Web Tokens)** for stateless authentication
- **BCrypt** for secure password hashing
- **Spring Security** for authorization and access control
- **Role-Based Access Control (RBAC)** for user permissions

## 📋 Architecture

### Components

#### 1. User Entity
Located in: `backend/src/main/java/com/archipellibre/model/User.java`

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;  // BCrypt encoded
    
    @Enumerated(EnumType.STRING)
    private UserRole role;  // USER, MODERATOR, ADMIN
    
    @Column(nullable = false)
    private Boolean active = true;
    // ... timestamps and relationships
}
```

#### 2. JWT Token Provider
Located in: `backend/src/main/java/com/archipellibre/security/JwtTokenProvider.java`

**Responsibilities:**
- Generate JWT tokens with HS512 signature algorithm
- Validate JWT token signatures and expiration
- Extract username claims from tokens

**Key Methods:**
```java
public String generateToken(Authentication authentication)  // Generate JWT
public String getUsernameFromJWT(String token)              // Extract username
public boolean validateToken(String authToken)               // Validate JWT
```

**Dependencies:** JJWT 0.12.3 with Spring Security

#### 3. JWT Authentication Filter
Located in: `backend/src/main/java/com/archipellibre/security/JwtAuthenticationFilter.java`

**Flow:**
1. Intercepts every HTTP request
2. Extracts JWT from Authorization header (`Bearer <token>`)
3. Validates token using JwtTokenProvider
4. Loads UserDetails from database
5. Sets Authentication in SecurityContextHolder
6. Allows request to proceed or denies with 403 Forbidden

#### 4. UserDetails Service
Located in: `backend/src/main/java/com/archipellibre/security/UserDetailsServiceImpl.java`

**Features:**
- Loads user by username OR email (flexible login)
- Implements Spring Security UserDetailsService
- Maps database User entity to Spring UserDetails
- Assigns role-based authorities (ROLE_USER, ROLE_MODERATOR, ROLE_ADMIN)

#### 5. Security Configuration
Located in: `backend/src/main/java/com/archipellibre/config/SecurityConfig.java`

**Features:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();  // BCrypt with strength 10
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        // STATELESS sessions (no cookies)
        // JWT validation on every request
        // Public: /api/auth/**, GET /api/events/**, GET /api/forum/**
        // Protected: All other endpoints require authentication
        // CORS enabled for http://localhost:4200
    }
}
```

#### 6. Authentication Controller
Located in: `backend/src/main/java/com/archipellibre/controller/AuthController.java`

**Endpoints:**

##### POST `/api/auth/register`
Registers a new user account.

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

**Validation:**
- Username: 3-50 characters, unique
- Email: Valid email format, unique
- Password: 6-40 characters, will be BCrypt encoded

**Errors:**
- 400 Bad Request: Username already exists
- 400 Bad Request: Email already in use
- 400 Bad Request: Invalid input format

##### POST `/api/auth/login`
Authenticates user and returns JWT token.

**Request:**
```json
{
  "usernameOrEmail": "johndoe",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Errors:**
- 403 Forbidden: Invalid credentials (username/password mismatch)
- 400 Bad Request: Missing or invalid input

## 🔑 JWT Token Structure

**Algorithm:** HS512 (HMAC with SHA-512)

**Header:**
```json
{
  "alg": "HS512",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "johndoe",
  "iat": 1700000000,
  "exp": 1700086400
}
```

**Secret:** Configured in `application.yml` as `app.jwt.secret` (256+ bits recommended)

**Expiration:** 24 hours by default (configurable via `app.jwt.expiration`)

## 🛡️ Password Security

### BCrypt Hashing
- Algorithm: Bcrypt
- Strength Factor: 10 (default, configurable)
- Salt: Automatically generated per password

**Example:**
```
Plain: "myPassword123"
Hashed: "$2a$10$vLX4Y...truncated...hash"
```

**Verification:**
Spring Security automatically verifies passwords using `PasswordEncoder.matches()` during login.

## 🔒 Access Control

### Public Endpoints (No Authentication Required)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/events/**
GET    /api/forum/**
GET    /api/workshops/**
GET    /swagger-ui/**
GET    /v3/api-docs/**
```

### Protected Endpoints (Authentication Required)
```
All other endpoints under /api/**
Except those explicitly listed above
```

### Role-Based Authorization
Roles available: `USER`, `MODERATOR`, `ADMIN`

**Future enhancement:** Add `@PreAuthorize` annotations for role-specific endpoints:
```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/api/admin/users")
public ResponseEntity<List<User>> getAllUsers() { }
```

## 📝 Configuration

### Application Properties

**File:** `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/archipellibre
    username: ${DB_USERNAME:archipellibre}
    password: ${DB_PASSWORD:changeme}
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

app:
  jwt:
    secret: ${JWT_SECRET:YourSuperSecretKeyForJWTTokenGenerationMustBe256BitsOrMoreForHS512Algorithm}
    expiration: 86400000 # 24 hours in milliseconds
```

### Test Configuration

**File:** `backend/src/test/resources/application-test.yml`

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  
  jpa:
    hibernate:
      ddl-auto: create-drop
    dialect: org.hibernate.dialect.H2Dialect

app:
  jwt:
    secret: TestSecretKeyForJWTTokenGenerationMustBe256BitsOrMoreForHS512AlgorithmTesting
    expiration: 3600000 # 1 hour
```

## 🧪 Integration Tests

Located in: `backend/src/test/java/com/archipellibre/controller/AuthControllerTest.java`

**Test Coverage:**

1. **shouldRegisterNewUser**
   - Register new user
   - Verify 201 Created response
   - Verify success message

2. **shouldNotRegisterUserWithExistingUsername**
   - Attempt duplicate username
   - Verify 400 Bad Request
   - Verify error message

3. **shouldNotRegisterUserWithExistingEmail**
   - Attempt duplicate email
   - Verify 400 Bad Request
   - Verify error message

4. **shouldLoginWithValidCredentials**
   - Login with correct credentials
   - Verify 200 OK response
   - Verify JWT token is returned
   - Verify user details in response

5. **shouldLoginWithEmail**
   - Login using email instead of username
   - Verify successful authentication

6. **shouldNotLoginWithInvalidPassword**
   - Login with wrong password
   - Verify 403 Forbidden response

7. **shouldVerifyPasswordIsEncoded**
   - Register user
   - Retrieve from database
   - Verify password is BCrypt hashed (not plain text)
   - Verify hash starts with `$2a`, `$2b`, or `$2y`

**Running Tests:**
```bash
cd backend
mvn test                              # Run all tests
mvn test -Dtest=AuthControllerTest   # Run only auth tests
```

**Test Database:** H2 in-memory database (no external setup needed)

## 🚀 Usage Examples

### Frontend Integration

**Registering a User:**
```typescript
// Angular example
const registerRequest = {
  username: 'johndoe',
  email: 'john@example.com',
  password: 'SecurePassword123'
};

this.http.post('/api/auth/register', registerRequest).subscribe(
  (response) => console.log('Registration successful'),
  (error) => console.error('Registration failed', error)
);
```

**Logging In:**
```typescript
const loginRequest = {
  usernameOrEmail: 'johndoe',
  password: 'SecurePassword123'
};

this.http.post('/api/auth/login', loginRequest).subscribe(
  (response) => {
    localStorage.setItem('token', response.accessToken);
    // Redirect to dashboard
  },
  (error) => console.error('Login failed', error)
);
```

**Using the Token:**
```typescript
// HttpInterceptor adds token to all requests
const headers = new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

this.http.get('/api/events', { headers }).subscribe(
  (events) => console.log('Events:', events),
  (error) => console.error('Fetch failed', error)
);
```

### Backend Usage

**Accessing Authenticated User:**
```java
@GetMapping("/api/user/profile")
public ResponseEntity<User> getProfile(
    @AuthenticationPrincipal UserDetails userDetails) {
    User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return ResponseEntity.ok(user);
}
```

**Checking Roles:**
```java
@GetMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<User>> getAllUsers() {
    return ResponseEntity.ok(userRepository.findAll());
}
```

## 🔄 Authentication Flow

```
1. User submits credentials to /api/auth/login
        ↓
2. AuthenticationManager validates credentials against UserDetailsServiceImpl
        ↓
3. If valid, JwtTokenProvider generates JWT token
        ↓
4. Token returned to client in response
        ↓
5. Client stores token in localStorage/sessionStorage
        ↓
6. Client includes token in every request: Authorization: Bearer <token>
        ↓
7. JwtAuthenticationFilter intercepts request
        ↓
8. Filter validates token signature and expiration
        ↓
9. If valid, UserDetailsServiceImpl loads user details
        ↓
10. Authentication object set in SecurityContextHolder
        ↓
11. Request proceeds with authenticated context
        ↓
12. Response returned to client
        ↓
13. If token expired or invalid, request denied with 401/403
```

## ⚠️ Security Best Practices

### Implemented ✅
- [x] BCrypt password hashing with strength factor 10
- [x] JWT token signing with HS512 algorithm
- [x] Stateless session management (no server-side sessions)
- [x] CORS configured for specific origin
- [x] CSRF protection disabled for JWT (stateless)
- [x] Passwords never logged or returned in responses
- [x] Role-based authorization support
- [x] Input validation on registration and login

### Recommended for Production 🚀
- [ ] Use HTTPS only (enforce in production)
- [ ] Implement token refresh mechanism (refresh tokens)
- [ ] Add rate limiting on /api/auth endpoints
- [ ] Implement password reset functionality
- [ ] Add two-factor authentication (2FA)
- [ ] Log authentication events for audit trail
- [ ] Implement account lockout after failed login attempts
- [ ] Use environment variables for JWT secret (no hardcoding)
- [ ] Implement CORS with environment-specific origins
- [ ] Add API key rate limiting per user

## 📚 Dependencies

### Core Dependencies
- `spring-boot-starter-security` - Spring Security framework
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (v0.12.3) - JWT library
- `spring-boot-starter-data-jpa` - Database access
- `postgresql` - Production database
- `h2` - Testing database

### Related Dependencies
- `spring-boot-starter-validation` - Input validation
- `lombok` - Reducing boilerplate code

## 🐛 Troubleshooting

### "Invalid JWT signature"
- JWT secret changed but token generated with old secret
- Token corrupted or modified
- **Solution:** Use consistent JWT secret, regenerate token

### "Expired JWT token"
- Token older than 24 hours (default expiration)
- **Solution:** Implement token refresh mechanism or re-login

### "User not found"
- Username in token doesn't exist in database (user deleted)
- **Solution:** Invalidate token when user is deleted

### "CORS blocked request"
- Frontend origin not in CORS allowed list
- **Solution:** Update `corsConfigurationSource()` in SecurityConfig

### "No Authentication found in SecurityContextHolder"
- JWT not included in request header
- JWT filter didn't process request
- **Solution:** Verify Authorization header format: `Bearer <token>`

## 📖 Further Reading

- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JJWT Documentation](https://github.com/jwtk/jjwt)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Last Updated:** 2025-10-31  
**Status:** Complete and tested ✅
