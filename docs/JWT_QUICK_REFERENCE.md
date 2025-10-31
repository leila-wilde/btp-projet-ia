# JWT Authentication Quick Reference

## 🚀 Quick Start

### 1. Login User
```typescript
// In component
constructor(private authService: AuthService) {}

login(username: string, password: string) {
  this.authService.login({ usernameOrEmail: username, password })
    .subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('Login failed:', err)
    });
}
```

### 2. Protect Routes
```typescript
// In app.routes.ts
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard]
}
```

### 3. Check Authentication
```typescript
// In component or service
if (this.authService.isAuthenticated()) {
  // User is authenticated
}
```

### 4. Display User Info
```typescript
// In template
<div *ngIf="(authService.currentUser$ | async) as user">
  Welcome, {{ user.username }}!
</div>
```

### 5. Make Protected Request
```typescript
// Interceptor automatically adds token!
this.http.get('/api/users/me').subscribe(user => {
  console.log(user);
});
```

### 6. Logout
```typescript
this.authService.logout();
this.router.navigate(['/auth/login']);
```

## 📁 File Structure

```
core/
├── guards/
│   └── auth.guard.ts              (Protects routes)
├── interceptors/
│   └── jwt.interceptor.ts         (Adds token header)
└── services/
    └── auth.service.ts            (Login, register, logout)

features/
├── auth/
│   ├── login/
│   │   └── login.component.ts    (Login form)
│   └── register/
│       └── register.component.ts (Registration form)
└── home/
    └── home.component.ts          (Welcome page)

models/
└── user.model.ts                  (DTOs & interfaces)

app.routes.ts                       (Route configuration)
```

## 🔐 Key APIs

### AuthService
```typescript
// Login
login(credentials: LoginRequest): Observable<JwtResponse>

// Register
register(data: RegisterRequest): Observable<any>

// Logout
logout(): void

// Get current token
getToken(): string | null

// Check if authenticated
isAuthenticated(): boolean

// Get current user
getCurrentUser(): JwtResponse | null

// Observable for reactive updates
currentUser$: Observable<JwtResponse | null>

// Switch storage type
setStorageType(type: 'localStorage' | 'sessionStorage'): void
```

### AuthGuard
```typescript
// Usage in routes
canActivate([AuthGuard])
```

### JwtInterceptor
- ✅ Automatically adds `Authorization: Bearer {token}` to all requests
- ✅ Handles 401 errors (auto-logout + redirect)
- ✅ Transparently injected in AppComponent

## 🎯 Common Patterns

### Pattern 1: Protect Component Behind Login
```typescript
@Component({ ... })
export class DashboardComponent {
  user$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}
}
```

### Pattern 2: Check Auth Before Action
```typescript
export class EventService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  createEvent(event: Event) {
    if (!this.authService.isAuthenticated()) {
      throw new Error('Must be logged in');
    }
    return this.http.post('/api/events', event);
  }
}
```

### Pattern 3: Conditional Navigation
```typescript
export class MyComponent {
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
```

### Pattern 4: Token Refresh (Future)
```typescript
// When implementing token refresh:
export class RefreshTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          return this.authService.refreshToken().pipe(
            switchMap(token => {
              req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              });
              return next.handle(req);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
```

## 🔄 Request Flow

```
User Form Input
      ↓
Component.login(credentials)
      ↓
AuthService.login(credentials)
      ↓
HttpClient.post('/api/auth/login')
      ↓
[JwtInterceptor - adds Authorization header]
      ↓
Backend validates & returns JWT
      ↓
AuthService stores token in localStorage
      ↓
AuthService.currentUser$ emits user data
      ↓
Component redirects to dashboard
      ↓
Next HTTP request...
      ↓
[JwtInterceptor - injects token automatically]
      ↓
Backend processes authenticated request
```

## ⚙️ Configuration

### Change Storage (sessionStorage)
```typescript
// In app initialization
constructor(private authService: AuthService) {
  this.authService.setStorageType('sessionStorage');
}
```

### Custom API URL
```typescript
// In environment.ts
export const environment = {
  apiUrl: 'https://api.example.com',
  jwtTokenKey: 'my_app_token'
};
```

## 🧪 Testing

### Test Login
```typescript
it('should login user', () => {
  const response = { accessToken: 'token', username: 'user' };
  authService.login(creds).subscribe(result => {
    expect(result.accessToken).toBe('token');
  });
  httpMock.expectOne('/api/auth/login').flush(response);
});
```

### Test Protected Request
```typescript
it('should add token to request', () => {
  localStorage.setItem('auth_token', 'test-token');
  http.get('/api/data').subscribe();
  const req = httpMock.expectOne('/api/data');
  expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
});
```

## 🛡️ Security Checklist

- ✅ Password never stored locally (only token)
- ✅ Token cleared on logout
- ✅ 401 errors trigger logout automatically
- ✅ Token injected transparently via interceptor
- ⚠️ TODO: Implement HTTPS only
- ⚠️ TODO: Add token expiration checks
- ⚠️ TODO: Implement refresh tokens
- ⚠️ TODO: Use httpOnly cookies for production

## 🐛 Debug Tips

### Check if Authenticated
```typescript
console.log(this.authService.isAuthenticated());
```

### View Current User
```typescript
console.log(this.authService.getCurrentUser());
```

### Check Token
```typescript
console.log(this.authService.getToken());
```

### View Storage
```typescript
console.log(localStorage.getItem('auth_token'));
```

### Monitor API Calls
```typescript
// In Network tab of DevTools
// Look for Authorization header in request
// Should see: Authorization: Bearer {token}
```

## 📚 Related Files

- Backend Auth: `backend/.../AuthController.java`
- Full Docs: `docs/FRONTEND_JWT_AUTH.md`
- Summary: `docs/FRONTEND_AUTH_SUMMARY.md`
- Contributing: `CONTRIBUTING.md`

## 🚀 Next Steps

1. **Test locally**: `npm start`
2. **Test build**: `npm run build`
3. **Run tests**: `npm run test`
4. **Integrate backend**: Start Spring Boot backend
5. **Try login flow**: Navigate to `/auth/login`
6. **Check DevTools**: Monitor network requests

## 💡 Pro Tips

- Use `authService.currentUser$ | async` in templates for automatic unsubscribe
- Token injection is transparent—no need to manually add headers
- 401 errors automatically redirect to login
- Token is decoded and stored in currentUser$ BehaviorSubject
- Can switch storage type on-demand with `setStorageType()`

## 🆘 Common Issues

### Token Not Injected?
- Check: Is JwtInterceptor registered in AppComponent?
- Check: Does token exist in localStorage/sessionStorage?
- Check: Is request going to correct API?

### 401 Loop?
- Ensure token is valid and not expired
- Check backend is validating JWT correctly
- Verify Authorization header format: `Bearer {token}`

### Route Guard Not Working?
- Check: Is canActivate: [AuthGuard] set in route?
- Check: Is AuthService injected?
- Check: Does getToken() return a value?

---

**Quick Reference Version:** 1.0  
**Last Updated:** 2025-10-31
