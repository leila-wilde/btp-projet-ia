# Frontend to Backend Integration Guide

**Date:** October 31, 2025  
**Status:** ✅ Connected

## Overview

The Angular frontend is now fully connected to the Spring Boot backend with:
- ✅ JWT authentication via HttpInterceptor
- ✅ Automatic Bearer token injection
- ✅ API services for all features
- ✅ Centralized environment configuration
- ✅ localStorage/sessionStorage support

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                Angular Application                   │
├──────────────────────────────────────────────────────┤
│  Components → Services → HttpClient (Interceptor)   │
│                               ↓                       │
│  ┌─────────────────────────────────────────────┐    │
│  │    JwtInterceptor                           │    │
│  │  - Injects Authorization: Bearer {token}   │    │
│  │  - Handles 401 errors (auto-logout)        │    │
│  │  - Retrieved from localStorage/sessionSt.. │    │
│  └─────────────────────────────────────────────┘    │
│                               ↓                       │
└──────────────────────────────────────────────────────┘
                               ↓
        ┌─────────────────────────────────────────┐
        │     HTTP Request with JWT Token         │
        │  Authorization: Bearer {jwt_token}      │
        └─────────────────────────────────────────┘
                               ↓
        ┌─────────────────────────────────────────┐
        │    Spring Boot Backend (Port 8080)      │
        │  - JWT Token Validation                 │
        │  - Authentication & Authorization       │
        │  - Business Logic Processing            │
        │  - Database Persistence                 │
        └─────────────────────────────────────────┘
```

## Services

### 1. AuthService
**Location:** `frontend/src/app/core/services/auth.service.ts`

Handles authentication operations:

```typescript
// Login
authService.login(credentials).subscribe(
  response => console.log('Login successful'),
  error => console.error('Login failed')
);

// Register
authService.register(data).subscribe(
  response => console.log('Registration successful'),
  error => console.error('Registration failed')
);

// Logout
authService.logout();

// Get token
const token = authService.getToken();

// Check authentication
if (authService.isAuthenticated()) {
  // User is authenticated
}

// Get current user
const user = authService.getCurrentUser();

// Subscribe to user changes
authService.currentUser$.subscribe(user => {
  if (user) console.log('User logged in:', user);
  else console.log('User logged out');
});
```

**Backend Endpoints:**
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user
- `GET /api/auth/me` - Get current user (protected)

### 2. UserService
**Location:** `frontend/src/app/core/services/user.service.ts`

Manages user profile operations:

```typescript
// Get current user profile
userService.getCurrentUser().subscribe(user => {
  console.log('Current user:', user);
});

// Get specific user
userService.getUser(userId).subscribe(user => {
  console.log('User:', user);
});

// Update profile
userService.updateUser(userId, { bio: 'New bio' }).subscribe(
  updated => console.log('Profile updated')
);

// Change password
userService.changePassword(current, newPassword).subscribe(
  response => console.log('Password changed')
);

// Get all users (admin)
userService.getAllUsers().subscribe(users => {
  console.log('All users:', users);
});

// Delete user (admin)
userService.deleteUser(userId).subscribe(
  () => console.log('User deleted')
);
```

**Backend Endpoints:**
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/change-password` - Change password
- `GET /api/users` - Get all users (admin)

### 3. EventService
**Location:** `frontend/src/app/core/services/event.service.ts`

Handles event management:

```typescript
// Get all events
eventService.getAllEvents().subscribe(events => {
  console.log('Events:', events);
});

// Get specific event
eventService.getEvent(eventId).subscribe(event => {
  console.log('Event:', event);
});

// Create event
eventService.createEvent({
  title: 'Angular Workshop',
  description: 'Learn Angular basics',
  date: new Date('2025-11-15'),
  location: 'Online',
  capacity: 50
}).subscribe(event => {
  console.log('Event created:', event);
});

// Register for event
eventService.registerForEvent(eventId).subscribe(
  registration => console.log('Registered for event')
);

// Unregister from event
eventService.unregisterFromEvent(eventId).subscribe(
  () => console.log('Unregistered from event')
);

// Get user's registered events
eventService.getUserEvents().subscribe(events => {
  console.log('My events:', events);
});

// Get events by status
eventService.getEventsByStatus('SCHEDULED').subscribe(events => {
  console.log('Scheduled events:', events);
});
```

**Backend Endpoints:**
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event
- `DELETE /api/events/:id/unregister` - Unregister from event
- `GET /api/events/user/registered` - Get user's events

### 4. ForumService
**Location:** `frontend/src/app/core/services/forum.service.ts`

Manages forum discussions:

```typescript
// Threads
forumService.getAllThreads().subscribe(threads => {
  console.log('Threads:', threads);
});

forumService.getThreadsByCategory('General').subscribe(threads => {
  console.log('Category threads:', threads);
});

forumService.createThread({
  title: 'Angular Tips',
  category: 'Technology',
  content: 'How to optimize Angular performance'
}).subscribe(thread => {
  console.log('Thread created:', thread);
});

// Posts
forumService.getThreadPosts(threadId).subscribe(posts => {
  console.log('Thread posts:', posts);
});

forumService.createPost({
  threadId: threadId,
  content: 'Great discussion!'
}).subscribe(post => {
  console.log('Post created:', post);
});

// User's threads and posts
forumService.getUserThreads().subscribe(threads => {
  console.log('My threads:', threads);
});

forumService.getUserPosts().subscribe(posts => {
  console.log('My posts:', posts);
});
```

**Backend Endpoints:**
- `GET /api/forum/threads` - Get all threads
- `POST /api/forum/threads` - Create thread
- `GET /api/forum/threads/:id` - Get thread by ID
- `PUT /api/forum/threads/:id` - Update thread
- `DELETE /api/forum/threads/:id` - Delete thread
- `POST /api/forum/threads/:id/pin` - Pin/unpin thread
- `POST /api/forum/threads/:id/lock` - Lock/unlock thread
- `GET /api/forum/threads/:id/posts` - Get thread posts
- `POST /api/forum/posts` - Create post
- `PUT /api/forum/posts/:id` - Update post
- `DELETE /api/forum/posts/:id` - Delete post
- `GET /api/forum/user/threads` - Get user's threads
- `GET /api/forum/user/posts` - Get user's posts

### 5. WorkshopService
**Location:** `frontend/src/app/core/services/workshop.service.ts`

Manages workshop proposals:

```typescript
// Get all proposals
workshopService.getAllProposals().subscribe(proposals => {
  console.log('Proposals:', proposals);
});

// Create proposal
workshopService.createProposal({
  title: 'Advanced TypeScript',
  description: 'Deep dive into TypeScript'
}).subscribe(proposal => {
  console.log('Proposal created:', proposal);
});

// Vote for proposal
workshopService.voteProposal(proposalId).subscribe(
  proposal => console.log('Voted for proposal')
);

// Admin operations
workshopService.approveProposal(proposalId).subscribe(
  proposal => console.log('Proposal approved')
);

workshopService.rejectProposal(proposalId).subscribe(
  proposal => console.log('Proposal rejected')
);

// Get proposals by status
workshopService.getProposalsByStatus('PROPOSED').subscribe(proposals => {
  console.log('Proposed workshops:', proposals);
});

// Get user's proposals
workshopService.getUserProposals().subscribe(proposals => {
  console.log('My proposals:', proposals);
});
```

**Backend Endpoints:**
- `GET /api/workshops` - Get all proposals
- `POST /api/workshops` - Create proposal
- `GET /api/workshops/:id` - Get proposal by ID
- `PUT /api/workshops/:id` - Update proposal
- `DELETE /api/workshops/:id` - Delete proposal
- `POST /api/workshops/:id/vote` - Vote for proposal
- `POST /api/workshops/:id/approve` - Approve proposal (admin)
- `POST /api/workshops/:id/reject` - Reject proposal (admin)
- `GET /api/workshops?status=:status` - Get by status
- `GET /api/workshops/user/proposals` - Get user's proposals

## JWT Token Management

### Token Storage

The frontend supports two storage options:

```typescript
// Use localStorage (default, persistent)
authService.setStorageType('localStorage');

// Use sessionStorage (session only)
authService.setStorageType('sessionStorage');
```

### Token Flow

1. **Login Request**
   ```
   POST /api/auth/login
   {
     "usernameOrEmail": "user@example.com",
     "password": "password123"
   }
   ```

2. **Server Response**
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "tokenType": "Bearer",
     "username": "user",
     "email": "user@example.com",
     "role": "USER"
   }
   ```

3. **Token Storage**
   - Token stored in localStorage with key: `auth_token`
   - Current user stored in AuthService BehaviorSubject

4. **Automatic Injection**
   - JwtInterceptor automatically injects token in all HTTP requests
   - Header: `Authorization: Bearer {token}`

5. **Error Handling**
   - If 401 Unauthorized received, JwtInterceptor auto-logs out user
   - User redirected to `/auth/login`

## Environment Configuration

### Development

**File:** `frontend/src/environments/environment.ts`

```typescript
apiUrl: 'http://localhost:8080/api',
jwtTokenKey: 'auth_token'
```

### Production

**File:** `frontend/src/environments/environment.prod.ts`

```typescript
apiUrl: '/api',  // Relative path (served from same domain)
jwtTokenKey: 'auth_token'
```

## Using Services in Components

### Example 1: Login Component

```typescript
import { AuthService } from '@core/services';

@Component({...})
export class LoginComponent {
  credentials = { usernameOrEmail: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
```

### Example 2: Events List Component

```typescript
import { EventService } from '@core/services';
import { Event } from '@models/domain.model';

@Component({...})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load events:', error);
        this.loading = false;
      }
    });
  }

  registerEvent(eventId: string) {
    this.eventService.registerForEvent(eventId).subscribe({
      next: () => {
        alert('Registered for event');
        this.loadEvents();
      },
      error: (error) => {
        alert('Failed to register: ' + error.error?.message);
      }
    });
  }
}
```

### Example 3: Forum Thread Component

```typescript
import { ForumService } from '@core/services';
import { ForumThread, ForumPost } from '@models/domain.model';

@Component({...})
export class ThreadComponent implements OnInit {
  thread: ForumThread | null = null;
  posts: ForumPost[] = [];
  newPostContent = '';

  constructor(
    private forumService: ForumService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const threadId = this.route.snapshot.paramMap.get('id');
    if (threadId) {
      this.loadThread(threadId);
    }
  }

  loadThread(threadId: string) {
    this.forumService.getThread(threadId).subscribe(
      thread => this.thread = thread
    );

    this.forumService.getThreadPosts(threadId).subscribe(
      posts => this.posts = posts
    );
  }

  addPost() {
    if (!this.thread) return;

    this.forumService.createPost({
      threadId: this.thread.id,
      content: this.newPostContent
    }).subscribe({
      next: (post) => {
        this.posts.push(post);
        this.newPostContent = '';
      }
    });
  }
}
```

## Error Handling

### Standard Error Response

Backend returns consistent error format:

```json
{
  "timestamp": "2025-10-31T10:04:04.443Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid input",
  "path": "/api/auth/login"
}
```

### Handling Errors

```typescript
this.service.getData().subscribe({
  next: (data) => {
    // Success
  },
  error: (error) => {
    if (error.status === 401) {
      // Unauthorized - handled by interceptor
    } else if (error.status === 403) {
      // Forbidden
      console.error('Access denied');
    } else if (error.status === 404) {
      // Not found
      console.error('Resource not found');
    } else if (error.status === 400) {
      // Bad request
      console.error('Invalid input:', error.error.message);
    } else {
      // Server error
      console.error('Server error:', error);
    }
  },
  complete: () => {
    // Cleanup
  }
});
```

## Testing APIs

### Using Postman/Insomnia

1. **Login**
   ```
   POST http://localhost:8080/api/auth/login
   Body:
   {
     "usernameOrEmail": "testuser",
     "password": "password123"
   }
   ```

2. **Get Token from Response**
   - Copy `accessToken` from response

3. **Use Token in Other Requests**
   ```
   Header: Authorization: Bearer {accessToken}
   GET http://localhost:8080/api/users/me
   ```

## Deployment

### Local Development

```bash
# Terminal 1: Start Backend
java -jar backend/target/archipel-libre-backend-0.1.0-SNAPSHOT.jar

# Terminal 2: Start Frontend
cd frontend && npm start
```

Access: `http://localhost:4200`

### Docker

```bash
docker-compose up --build
```

### Production

Frontend uses relative API URL (`/api`) in production, so both frontend and backend must be served from the same domain.

## Security

✅ **Implemented:**
- JWT Bearer token authentication
- HTTP interceptor automatic token injection
- 401 error handling (auto-logout)
- CORS configured on backend
- Passwords never stored locally

⚠️ **Recommendations:**
- Use HTTPS in production
- Implement token refresh mechanism
- Add token expiration checks
- Use httpOnly cookies for sensitive deployments
- Implement rate limiting

## Summary

✅ **Status:** Frontend fully connected to backend  
✅ **JWT:** Automatic token injection via interceptor  
✅ **Storage:** localStorage/sessionStorage support  
✅ **Services:** 5 complete API services  
✅ **Configuration:** Environment-based API URLs  
✅ **Error Handling:** Centralized error management  
✅ **Ready for:** Production deployment
