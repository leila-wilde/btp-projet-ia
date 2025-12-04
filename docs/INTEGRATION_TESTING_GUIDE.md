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

## 🚀 QUICK START (5-Minute Test Flow)

### Minute 1: Start Backend
```bash
# Terminal 1
cd backend
mvn clean install
mvn spring-boot:run

# Wait for: "Application started"
# Verify: curl http://localhost:8080/health
```

### Minute 2: Start Frontend
```bash
# Terminal 2
cd frontend
npm install  # First time only
npm start

# Wait for: "Compiled successfully"
# Browser opens: http://localhost:4200
```

### Minute 3: Register & Login
1. Click "Register"
2. Fill form with test data
3. Submit registration
4. Verify redirect to dashboard
✓ Check: Tokens in localStorage

### Minute 4: Verify JWT Injection
1. Press F12 (open DevTools)
2. Click: Network tab
3. Click: "Events" in navigation
4. Find: GET /api/events
5. Check Request Headers → **Authorization: Bearer eyJ...**
✓ If present: Interceptor working!

### Minute 5: Check Data Loads
1. Events page should display
2. Check Network tab: GET /api/events → **200 OK**
3. Try: Forum page, Profile, etc.
✓ All loading? **Integration successful!** 🎉

---

## 📊 DevTools Essentials

### Network Tab Inspection

**What to look for:**
```
GET /api/events                    [200 OK]
Request Headers:
  Authorization: Bearer eyJ...     ✓
  Content-Type: application/json   ✓
Response:
  {
    "content": [...],
    "totalElements": 42,
    "totalPages": 5
  }                                ✓
```

### Application Tab (Check Tokens)

**Location:** DevTools → Application → Local Storage → http://localhost:4200

**Expected keys:**
- `auth_token` - Current access token (JWT)
- `refresh_token` - Refresh token (optional, JWT)

**Format:** Both should start with `eyJ` (base64 JWT header)

### Console Tab

**Success indicators:**
- ✓ No red error messages
- ✓ No CORS warnings
- ✓ Clean console output

**Common errors to check:**
- ❌ "Cannot read property of undefined"
- ❌ "Access to XMLHttpRequest blocked by CORS"
- ❌ "401 Unauthorized"

---

## 🔧 Advanced Testing Scenarios

### Scenario 1: JWT Token Lifecycle
1. Login successfully
2. Open DevTools → Application
3. View auth_token (note expiration time)
4. Make API requests
5. Token should be valid until expiration
6. After expiration, auto-refresh should trigger

**Watch for in Network tab:**
- POST /api/auth/refresh → 200 OK (token refresh)
- Followed by: Original request → 200 OK (retry with new token)

### Scenario 2: Error Handling
1. **Test 401 (Unauthorized):**
   - Delete auth_token from localStorage
   - Try to navigate/load data
   - Should redirect to login

2. **Test 403 (Forbidden):**
   - As regular user, try admin endpoints
   - Should show "Access Denied"

3. **Test Network Error:**
   - Stop backend (Ctrl+C)
   - Try to load data
   - Should show friendly error message

### Scenario 3: Pagination & Filtering
1. Go to Events page
2. Check Network tab for query parameters
3. Test page navigation
4. Verify results update correctly
5. Check URL parameters: `?page=0&size=10`

### Scenario 4: CRUD Operations
1. Create event (POST /api/events) → 201 Created
2. Read event list (GET /api/events) → 200 OK
3. Update event (PUT /api/events/:id) → 200 OK
4. Delete event (DELETE /api/events/:id) → 204 No Content

---

## ✅ Complete Testing Checklist

### Startup Phase
- ☐ Backend starts without errors
- ☐ Frontend compiles successfully
- ☐ Browser loads http://localhost:4200
- ☐ No console errors on page load

### Authentication Phase
- ☐ Can register new user
- ☐ Tokens stored in localStorage
- ☐ Can login with credentials
- ☐ Redirect to dashboard after login
- ☐ Invalid login shows error message

### API Integration Phase
- ☐ Events page loads with data
- ☐ Forum page loads with threads
- ☐ Profile page displays user info
- ☐ Admin panel accessible (if admin)
- ☐ All API calls include Authorization header

### JWT Injection Phase
- ☐ Authorization header format: `Bearer eyJ...`
- ☐ Header present in all protected requests
- ☐ Token stored correctly in localStorage
- ☐ Refresh token present (if implemented)

### Error Handling Phase
- ☐ 401 errors redirect to login
- ☐ 403 errors show access denied
- ☐ 404 errors show not found
- ☐ Network errors show friendly message
- ☐ Connection refused handled gracefully

### Data Operations Phase
- ☐ Can create events
- ☐ Can edit events
- ☐ Can delete events
- ☐ Pagination works
- ☐ Filtering works
- ☐ Search works

### Network Monitoring Phase
- ☐ All requests show correct status codes
- ☐ Response bodies are valid JSON
- ☐ Response times < 1000ms
- ☐ No CORS errors
- ☐ No failed requests

---

## 🐛 Troubleshooting Guide

### Problem: "net::ERR_CONNECTION_REFUSED"
**Where:** Network tab or Console
**Cause:** Backend not running
**Fix:**
```bash
# Check if backend running
curl http://localhost:8080/health

# If failed, start backend
cd backend
mvn spring-boot:run
```

### Problem: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Where:** Console (red error)
**Cause:** Backend CORS not configured
**Fix:**
1. Check backend SecurityConfig
2. Verify http://localhost:4200 in allowed origins
3. Restart backend

### Problem: "401 Unauthorized"
**Where:** Network tab Response status
**Cause:** No valid JWT token
**Fix:**
```bash
# In DevTools Console:
localStorage.getItem('auth_token')
# If null, token not stored
# Solution: Login again
```

### Problem: "Cannot read property 'X' of undefined"
**Where:** Console (red error)
**Cause:** Trying to access null/undefined data
**Fix:**
1. Check if API returned data
2. Verify in Network tab Response
3. Add null checks in component

### Problem: Page loading forever
**Cause:** Backend not responding
**Fix:**
1. Check Network tab for failed requests
2. Restart backend
3. Refresh page

---

## 🎯 Success Criteria

✅ **Integration is working when you see:**

1. **Network Tab:**
   - POST /api/auth/register → 201 Created
   - GET /api/events → 200 OK
   - GET /api/forum/threads → 200 OK
   - All requests have Authorization header

2. **Application Tab:**
   - auth_token exists (starts with eyJ)
   - refresh_token exists (starts with eyJ)
   - Both valid until expiration

3. **Console Tab:**
   - No red error messages
   - Maybe some yellow warnings (normal)
   - Clean output

4. **UI/UX:**
   - Can register user
   - Can login user
   - Dashboard loads
   - Events/Forum/Admin pages load
   - No "loading forever" states
   - Logout works

---

## 📈 Performance Baselines

**Expected response times:**
- Login: < 500ms
- Get user: < 500ms
- List events: < 1000ms
- List forum threads: < 1000ms
- Create event: < 500ms

**Bundle size (Frontend):**
- Raw: ~344 KB
- Gzipped: ~91 KB

**Database queries:**
- Should complete < 100ms
- Check with DevTools Performance tab

---

## 🔐 Security Verification

✓ **Check these security aspects:**

1. **Authentication:**
   - JWT tokens stored securely
   - Passwords never in localStorage
   - Login/logout works correctly

2. **Authorization:**
   - Protected routes require login
   - Admin endpoints block non-admins
   - 401/403 handled properly

3. **Token Security:**
   - Tokens have expiration time
   - Refresh tokens work
   - Logout clears tokens

4. **Data Protection:**
   - User data not exposed in URLs
   - No sensitive data in LocalStorage
   - CORS headers correct

---

## Next Steps

1. ✅ Run integration tests (use Quick Start flow)
2. ✅ Fix any issues found (use troubleshooting guide)
3. ✅ Test all features thoroughly (use checklist)
4. ✅ Performance testing (monitor with DevTools)
5. ✅ Security review (verify all checks pass)
6. ✅ Deploy to staging (use deployment guide)
7. ✅ Final testing (repeat full checklist)
8. ✅ Deploy to production (follow DEPLOYMENT guide)

---

**Documentation Version:** 2.0  
**Last Updated:** 2025-12-03  
**Status:** Complete - Ready for Integration Testing  
**All Guides:** Quick Start (5 min) | Thorough (15-20 min) | Full (see SETUP_SUMMARY.md)
