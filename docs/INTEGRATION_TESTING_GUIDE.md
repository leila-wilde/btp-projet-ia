# Frontend-Backend Integration Testing Guide

**Date:** October 31, 2025  
**Status:** ✅ Connected & Ready for Testing

## Quick Start Testing

### Prerequisites
- Spring Boot backend running on http://localhost:8080
- Angular frontend running on http://localhost:4200
- Test user account (or create one via registration)

### Test Scenarios

#### Scenario 1: Authentication Flow

```bash
# 1. Start backend
cd backend
java -jar target/archipel-libre-backend-0.1.0-SNAPSHOT.jar

# 2. Start frontend (new terminal)
cd frontend
npm start

# 3. Navigate to http://localhost:4200/auth/login
# 4. Enter test credentials
# 5. Open DevTools (F12) → Network tab
# 6. Look for Authorization header in requests
```

**Expected Results:**
- ✅ Login successful
- ✅ Token stored in localStorage
- ✅ Redirected to dashboard
- ✅ All subsequent requests have `Authorization: Bearer {token}`

#### Scenario 2: API Connectivity

**Test with cURL (Terminal):**

```bash
# 1. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'

# Response should include accessToken
# Copy the token for next step

# 2. Test protected endpoint (replace TOKEN)
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer TOKEN"

# Should return current user info
```

**Test with Postman:**

1. Create POST request to `http://localhost:8080/api/auth/login`
2. Body → Raw → JSON:
   ```json
   {
     "usernameOrEmail": "testuser",
     "password": "password123"
   }
   ```
3. Send → Copy `accessToken`
4. Create GET request to `http://localhost:8080/api/users/me`
5. Headers → Add:
   - Key: `Authorization`
   - Value: `Bearer {accessToken}`
6. Send → Should return user info

#### Scenario 3: Frontend Service Testing

**In Browser Console (http://localhost:4200):**

```typescript
// Inject services (requires Angular running)
const authService = ng.probe(document.body).injector.get('AuthService');
const userService = ng.probe(document.body).injector.get('UserService');
const eventService = ng.probe(document.body).injector.get('EventService');

// Test Auth Service
authService.getCurrentUser(); // Should return logged-in user
authService.getToken(); // Should return JWT token
authService.isAuthenticated(); // Should return true

// Test User Service
userService.getCurrentUser().subscribe(user => {
  console.log('Current user:', user);
});

// Test Event Service
eventService.getAllEvents().subscribe(events => {
  console.log('Events:', events);
});
```

#### Scenario 4: Full User Journey

1. **Registration**
   - Go to http://localhost:4200/auth/register
   - Fill form with test data
   - Submit
   - ✅ Should redirect to login

2. **Login**
   - Go to http://localhost:4200/auth/login
   - Enter credentials
   - Submit
   - ✅ Should redirect to dashboard
   - ✅ Token in localStorage

3. **Browse Events** (if event component exists)
   - Navigate to events page
   - ✅ Should load events from backend
   - ✅ Should display event list

4. **Logout**
   - Click logout button
   - ✅ Token should be cleared from localStorage
   - ✅ Should redirect to login
   - ✅ Subsequent requests should fail with 401

## Network Inspection

### Check JWT Token Injection

1. Open DevTools (F12)
2. Go to **Network** tab
3. Make any API request (e.g., navigate to events)
4. Click on the request in Network tab
5. Look for **Authorization header**

**Expected:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTcwODk5NTY4MX0.xxx...
```

### Check localStorage

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Local Storage**
4. Click `http://localhost:4200`
5. Look for `auth_token` entry

**Expected:**
```
Key: auth_token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIs...
```

## Error Testing

### Test 401 Error Handling

1. Login to get token
2. Open DevTools Console
3. Clear localStorage:
   ```javascript
   localStorage.removeItem('auth_token');
   ```
4. Make an API call from the app
5. ✅ Should trigger auto-logout
6. ✅ Should redirect to login

### Test Invalid Credentials

1. Go to login page
2. Enter wrong password
3. ✅ Should show error message
4. ✅ Should not redirect
5. ✅ localStorage should remain empty

### Test Network Error

1. Stop backend (Ctrl+C)
2. Try to login
3. ✅ Should show error message
4. ✅ Frontend should handle gracefully

## Integration Points Checklist

- [ ] Login endpoint (`POST /api/auth/login`)
- [ ] Register endpoint (`POST /api/auth/register`)
- [ ] Get current user (`GET /api/users/me`)
- [ ] JWT token injection via interceptor
- [ ] 401 error handling and auto-logout
- [ ] Token storage in localStorage
- [ ] Events API (`GET /api/events`)
- [ ] Forum API (`GET /api/forum/threads`)
- [ ] Workshop API (`GET /api/workshops`)

## Troubleshooting

### Issue: CORS Error

**Error Message:** `Access to XMLHttpRequest at 'http://localhost:8080/api/...' from origin 'http://localhost:4200' has been blocked by CORS policy`

**Solution:**
1. Verify backend CORS configuration is enabled
2. Check that Security config allows http://localhost:4200
3. Restart backend

**Backend Fix:** `SecurityConfig.java`
```java
.cors(cors -> cors.configurationSource(request -> {
  CorsConfiguration config = new CorsConfiguration();
  config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
  config.setAllowedMethods(Arrays.asList("*"));
  config.setAllowedHeaders(Arrays.asList("*"));
  return config;
}))
```

### Issue: Token Not Being Sent

**Debug:**
1. Check console: `localStorage.getItem('auth_token')`
2. Should not return `null` after login
3. Check Network tab for Authorization header
4. Verify JwtInterceptor is registered in AppComponent

**Frontend Fix:** Ensure in `app.component.ts`:
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }
]
```

### Issue: 401 Loop After Login

**Possible Causes:**
1. Token is invalid/expired
2. Backend not validating correctly
3. Token format incorrect

**Debug:**
1. Check token in localStorage
2. Use https://jwt.io to decode token
3. Verify expiration time
4. Check backend logs for validation errors

## Performance Testing

### Check API Response Times

1. Open DevTools → Network tab
2. Perform typical operations
3. Check response times:
   - Login: < 500ms
   - List events: < 1000ms
   - Get user: < 500ms

### Monitor Bundle Size

```bash
cd frontend
npm run build

# Check dist folder size
du -sh dist/
# Should be around 344 KB raw, ~91 KB gzipped
```

## Load Testing with Multiple Requests

**Frontend Script:**
```typescript
// In browser console
async function testLoad() {
  const headers = {
    'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
  };
  
  for (let i = 0; i < 10; i++) {
    const start = performance.now();
    const response = await fetch('http://localhost:8080/api/events', { headers });
    const end = performance.now();
    console.log(`Request ${i+1}: ${end - start}ms`);
  }
}

testLoad();
```

## Integration Test Checklist

### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Token stored in localStorage
- [ ] Logout clears token
- [ ] Invalid login shows error
- [ ] 401 errors trigger logout

### API Communication
- [ ] Requests include Authorization header
- [ ] API responses are correct format
- [ ] Error responses handled
- [ ] Network timeouts handled

### User Experience
- [ ] Protected routes work
- [ ] Login redirects on success
- [ ] Logout redirects to login
- [ ] User info displays correctly
- [ ] Form validation works

### Security
- [ ] Password not stored locally
- [ ] Token expires properly
- [ ] 401 redirects to login
- [ ] CORS headers correct
- [ ] No token in URL/query string

## Success Criteria

✅ **All these should pass:**

1. User can login with valid credentials
2. Token appears in localStorage after login
3. Authorization header sent in all requests
4. Protected endpoints return data correctly
5. 401 errors trigger auto-logout
6. User can logout and token is cleared
7. Build succeeds without errors
8. Bundle size is reasonable (~91 KB gzipped)
9. No CORS errors
10. All services communicate correctly

## Deployment Verification

Before deploying to production:

1. Test with production environment config
2. Verify API URL is correct
3. Test with production backend
4. Check certificate validity (HTTPS)
5. Verify CORS settings for production domain
6. Test all features end-to-end
7. Monitor performance metrics
8. Check error logging

## Next Steps

1. ✅ Run integration tests
2. ✅ Fix any issues found
3. ✅ Test all features thoroughly
4. ✅ Performance testing
5. ✅ Security review
6. ✅ Deploy to staging
7. ✅ Final testing
8. ✅ Deploy to production

---

**Documentation Version:** 1.0  
**Last Updated:** 2025-10-31  
**Status:** Ready for Integration Testing
