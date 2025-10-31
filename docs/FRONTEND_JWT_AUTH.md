# Angular JWT Authentication

## Overview

This document describes the minimal JWT authentication implementation for the Archipel Libre Angular frontend.

## Components

### 1. AuthService (`core/services/auth.service.ts`)

Centralized authentication service handling:
- **Login**: POST credentials, stores JWT token
- **Register**: Creates new user account
- **Logout**: Clears token and user data
- **Token Management**: Get/check token, decode JWT payload
- **Storage Options**: Supports localStorage (default) or sessionStorage

**Key Methods:**
```typescript
login(credentials: LoginRequest): Observable<JwtResponse>
register(data: RegisterRequest): Observable<any>
logout(): void
getToken(): string | null
isAuthenticated(): boolean
getCurrentUser(): JwtResponse | null
setStorageType(type: 'localStorage' | 'sessionStorage'): void
```

**Token Storage:**
- Default: localStorage (persistent across sessions)
- Alternative: sessionStorage (cleared on browser close)
- Switch with: `authService.setStorageType('sessionStorage')`

**BehaviorSubject:**
- `currentUser$`: Observable for reactive user state updates
- Component can subscribe: `this.authService.currentUser$ | async`

### 2. JwtInterceptor (`core/interceptors/jwt.interceptor.ts`)

Automatically injects JWT token into request headers.

**Features:**
- Adds `Authorization: Bearer {token}` to all HTTP requests
- Handles 401 errors: logs out user and redirects to login
- Non-intrusive: only adds header if token exists

**Registration in AppComponent:**
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }
]
```

### 3. AuthGuard (`core/guards/auth.guard.ts`)

Protects routes requiring authentication.

**Usage in Routes:**
```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard]
}
```

**Behavior:**
- Allows navigation if authenticated
- Redirects to `/auth/login` if not authenticated
- Stores `returnUrl` query param for post-login redirect

### 4. Components

#### LoginComponent (`features/auth/login/login.component.ts`)
- Username/Email + Password form
- Error handling and loading state
- Redirects to returnUrl after successful login

#### RegisterComponent (`features/auth/register/register.component.ts`)
- Username, Email, Password form
- Input validation (email format, min password length)
- Success message with redirect to login

#### HomeComponent (`features/home/home.component.ts`)
- Displays logged-in user info
- Logout button
- Shows login link for unauthenticated users

## Routing

App routes defined in `app.routes.ts`:
- `/` - Home (public)
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Protected route example

## Integration Flow

1. **Bootstrap (main.ts)**
   - Provides router and animations
   - Registers JwtInterceptor globally

2. **AppComponent**
   - Renders `<router-outlet>`
   - Provides HTTP_INTERCEPTORS

3. **Interceptor Flow**
   ```
   HttpRequest → JwtInterceptor (adds token) → Backend API
   Response → Error handling (401 → logout + redirect)
   ```

4. **Auth Flow**
   ```
   Login Form → AuthService.login() → Store token
   → Update currentUser$ BehaviorSubject
   → Navigate to dashboard
   
   Protected Route → AuthGuard checks → isAuthenticated()
   → JwtInterceptor injects token → Request succeeds
   ```

## Environment Configuration

**development (environment.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  jwtTokenKey: 'auth_token'
};
```

**production (environment.prod.ts)**
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  jwtTokenKey: 'auth_token'
};
```

## Backend API Expectations

### Login Endpoint
```
POST /api/auth/login
Body: { usernameOrEmail: string, password: string }
Response: {
  accessToken: string,
  tokenType?: string,
  username: string,
  email: string,
  role: string
}
```

### Register Endpoint
```
POST /api/auth/register
Body: { username: string, email: string, password: string }
Response: { message: string } or success confirmation
```

### Protected Routes
```
GET /api/users/me (requires Authorization header)
GET /api/events
GET /api/forum/threads
```

All protected routes require: `Authorization: Bearer {token}`

## Usage Examples

### In Components

**Subscribe to user state:**
```typescript
constructor(private authService: AuthService) {}

ngOnInit() {
  this.currentUser$ = this.authService.currentUser$;
}

// In template
{{ (currentUser$ | async)?.username }}
```

**Check authentication:**
```typescript
if (this.authService.isAuthenticated()) {
  // User is logged in
}
```

**Get current user:**
```typescript
const user = this.authService.getCurrentUser();
```

**Logout:**
```typescript
this.authService.logout();
```

### Configure Storage Type

```typescript
// Use sessionStorage instead of localStorage
this.authService.setStorageType('sessionStorage');
```

## Security Considerations

✅ **Implemented:**
- JWT tokens injected automatically via interceptor
- 401 errors trigger logout for token expiration
- Password sent only to backend (never stored in frontend)
- Token stored in localStorage (consider httpOnly cookies for production)

⚠️ **Production Considerations:**
- Use httpOnly cookies instead of localStorage for better security
- Implement token refresh mechanism (refresh token endpoint)
- Add CORS configuration on backend
- Validate JWT expiration (check token exp claim)
- Implement rate limiting on auth endpoints
- Add CSRF protection if using cookies

## Testing

Example test for AuthService:
```typescript
it('should store token on login', (done) => {
  const mockResponse = {
    accessToken: 'test-token',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER'
  };

  authService.login(credentials).subscribe(() => {
    expect(localStorage.getItem(environment.jwtTokenKey)).toBe('test-token');
    expect(authService.isAuthenticated()).toBe(true);
    done();
  });
});
```

## File Structure

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── jwt.interceptor.ts
│   └── services/
│       └── auth.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   └── register/
│   │       └── register.component.ts
│   └── home/
│       └── home.component.ts
├── models/
│   └── user.model.ts
├── app.routes.ts
└── app.component.ts
```

## Next Steps

1. Add token refresh mechanism (refresh tokens)
2. Implement role-based access control (RoleGuard)
3. Add profile/settings components
4. Implement password reset functionality
5. Add user profile editing
6. Set up HTTP interceptor error handling (global error notifications)
7. Add logout from other sessions (token revocation)
8. Implement "Remember Me" functionality

## Related Files

- Backend Auth Controller: `backend/src/main/java/com/archipellibre/controller/AuthController.java`
- JWT Token Provider: `backend/src/main/java/com/archipellibre/security/JwtTokenProvider.java`
- User Model: `backend/src/main/java/com/archipellibre/model/User.java`
