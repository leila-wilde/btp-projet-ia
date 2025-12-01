# Architecture & Code Standards

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (Angular 17)                 │
│  http://localhost:8081                                  │
│  - Components, Services, Guards, Interceptors           │
│  - NgRx state management                                │
│  - Angular Material UI                                  │
└────────────────┬────────────────────────────────────────┘
                 │ REST API with JWT
┌────────────────▼────────────────────────────────────────┐
│                BACKEND (Spring Boot 3.2)                │
│  http://localhost:8080                                  │
│  - REST Controllers                                     │
│  - Services (Business Logic)                            │
│  - Repositories (Database Access)                       │
│  - Security (JWT, Spring Security)                      │
└────────────────┬────────────────────────────────────────┘
                 │ JDBC
┌────────────────▼────────────────────────────────────────┐
│         DATABASE (PostgreSQL 15)                        │
│  localhost:5433                                         │
│  - users, events, forum_threads, workshops, etc.       │
└─────────────────────────────────────────────────────────┘
```

## API Flow

```
1. User enters credentials in Frontend
2. Frontend calls POST /api/auth/login
3. Backend authenticates, returns JWT token
4. Frontend stores JWT in localStorage
5. Frontend includes JWT in Authorization header
6. Backend validates JWT on each request
7. Backend returns data or 401 if token invalid
8. Frontend redirects to login on 401
```

## Database Schema

**users**: id, username, email, password_hash, role, created_at, updated_at
**events**: id, title, description, date, capacity, registered_count, status
**event_registrations**: id, user_id, event_id, registered_at
**forum_threads**: id, title, category, author_id, is_locked, is_pinned
**forum_posts**: id, thread_id, author_id, content, created_at, updated_at
**workshops**: id, title, proposer_id, votes_count, status
**workshop_votes**: id, workshop_id, user_id, vote_type

## Code Standards

### Backend (Java/Spring)

**Package Structure**:
```
com.archipellibre
├── controller       # REST endpoints
├── service          # Business logic
├── repository       # Database queries
├── model            # JPA entities
├── dto              # Request/Response objects
├── security         # JWT, authentication
├── config           # Configuration classes
└── exception        # Custom exceptions
```

**Naming Conventions**:
- Classes: `PascalCase` (e.g., `UserService`)
- Methods: `camelCase` (e.g., `getUserById`)
- Constants: `UPPER_SNAKE_CASE`
- Database columns: `snake_case`

**Best Practices**:
- Use `@Service` for business logic
- Use `@Repository` for database access
- Use `@RestController` for APIs
- Add `@Transactional` on database operations
- Use DTOs for API requests/responses
- Add validation: `@Valid`, `@NotNull`, etc.
- Log important operations
- Handle exceptions gracefully

### Frontend (Angular/TypeScript)

**Module Structure**:
```
src/app
├── core/            # Singleton services, guards, interceptors
├── features/        # Feature modules (events, forum, etc.)
├── shared/          # Shared components, pipes, directives
└── models/          # TypeScript interfaces
```

**Naming Conventions**:
- Classes: `PascalCase` (e.g., `UserService`)
- Methods: `camelCase`
- Files: `kebab-case.ts` (e.g., `user.service.ts`)
- Components: `PascalCase` with `Component` suffix

**Best Practices**:
- Use reactive forms with FormBuilder
- Use RxJS operators (map, switchMap, catchError)
- Unsubscribe from observables (onDestroy)
- Use ChangeDetectionStrategy.OnPush
- Add loading/error states
- Use trackBy in *ngFor for performance
- Type everything (avoid any)

## Security

**Password Hashing**: BCrypt (Spring Security)
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
}
```

**JWT Token**:
- Generated on login
- Expires after 24 hours
- Included in Authorization header: `Bearer <token>`
- Validated by JwtTokenProvider

**CORS Configuration**: Allows localhost:4200, denies other origins
**HTTPS**: Recommended for production (use nginx reverse proxy)

## File Organization

**Important Files**:

Backend:
- `src/main/java/com/archipellibre/controller/AuthController.java` - Auth endpoints
- `src/main/java/com/archipellibre/security/JwtTokenProvider.java` - JWT generation
- `src/main/java/com/archipellibre/config/SecurityConfig.java` - Security config
- `src/main/resources/application.yml` - App config

Frontend:
- `src/app/core/services/auth.service.ts` - Auth service
- `src/app/core/guards/auth.guard.ts` - Route guard
- `src/app/core/interceptors/jwt.interceptor.ts` - JWT interceptor
- `src/app/app.routes.ts` - Route configuration

## Common Operations

### Add New Entity

**Backend**:
1. Create entity in `model/`
2. Create repository extending `JpaRepository`
3. Create DTO in `dto/`
4. Create service in `service/`
5. Create controller in `controller/`
6. Add endpoints

**Frontend**:
1. Create model interface in `models/`
2. Create service in `core/services/`
3. Create components in `features/`
4. Add routes

### API Response Format

**Success**:
```json
{
  "id": "123",
  "username": "john",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Error**:
```json
{
  "error": "Invalid credentials",
  "message": "Username or password incorrect",
  "status": 401
}
```

---

**Key Principle**: Keep it simple, readable, secure. Focus on MVP functionality first, optimize later.
