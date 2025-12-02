# Development Guide

## Project Structure

```
backend/          # Spring Boot API
  src/
    controllers/  # REST endpoints
    services/     # Business logic
    models/       # JPA entities
    security/     # JWT, authentication
    repository/   # Database queries

frontend/         # Angular 17 app
  src/
    app/
      core/       # Services, guards, interceptors
      features/   # Feature modules
      models/     # TypeScript interfaces

database/         # PostgreSQL
docker-compose.yml
```

## Development Workflow

### Start Development

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run
# Swagger: http://localhost:8080/swagger-ui.html

# Terminal 2: Frontend
cd frontend
npm start
# App: http://localhost:4200

# Terminal 3: Database
docker-compose up postgres pgadmin
# pgAdmin: http://localhost:5050
```

### Code Changes

**Backend**: Changes auto-reload (Hot Swap)
**Frontend**: Changes auto-reload (Watch mode)

### Testing

**Backend Tests**:
```bash
cd backend
mvn test
```

**Frontend Tests**:
```bash
cd frontend
npm test
```

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/main/java/com/archipellibre/config/SecurityConfig.java` | JWT, CORS, auth config |
| `backend/src/main/java/com/archipellibre/security/JwtTokenProvider.java` | JWT token generation |
| `frontend/src/app/core/services/auth.service.ts` | Auth service |
| `frontend/src/app/core/guards/auth.guard.ts` | Route protection |

## Existing Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Users (partial - needs completion)
- `GET /api/users` - List users (admin only)
- `GET /api/users/{id}` - Get user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Events (partial - needs completion)
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Forum (partial - needs completion)
- `GET /api/forum/threads` - List threads
- `POST /api/forum/threads` - Create thread
- `GET /api/forum/threads/{id}/posts` - Get posts
- `POST /api/forum/posts` - Create post

### Workshops (partial - needs completion)
- `GET /api/workshops` - List proposals
- `POST /api/workshops` - Create proposal
- `POST /api/workshops/{id}/vote` - Vote on proposal
- `POST /api/workshops/{id}/approve` - Approve (admin)

## Database Schema

**Core Tables**: users, events, event_registrations, forum_threads, forum_posts, workshops, workshop_votes

**Connection**: 
- Host: localhost:5433
- User: archipellibre
- Password: changeme

## Common Tasks

### Add New Endpoint

**Backend**:
1. Create DTO in `src/main/java/com/archipellibre/dto/`
2. Create service method in `src/main/java/com/archipellibre/service/`
3. Add controller method in `src/main/java/com/archipellibre/controller/`
4. Test in Swagger

**Frontend**:
1. Create service method in `src/app/core/services/`
2. Create component in `src/app/features/`
3. Add route in `src/app/app.routes.ts`
4. Test in browser

### Debug API

```bash
# Check logs
docker-compose logs backend

# Check database
docker exec archipellibre-db psql -U archipellibre -d archipellibre -c "SELECT * FROM users;"

# Test endpoint
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Database Queries

```bash
# Connect to database
docker exec -it archipellibre-db psql -U archipellibre -d archipellibre

# Common queries
SELECT * FROM users;
SELECT * FROM events;
SELECT * FROM forum_threads;
UPDATE users SET password_hash = 'NEW_HASH' WHERE username = 'testuser';
```

## Current Features Status

**Completed**: 
- ✅ User authentication with JWT
- ✅ Spring Boot 3.5.0 upgrade
- ✅ Angular 17 frontend with Material UI
- ✅ Core entities (User, Event, Forum, Workshop)
- ✅ Docker containerization

**In Progress / Needs Enhancement**:
- 🔄 Comprehensive API endpoint coverage
- 🔄 Complete service layer implementations
- 🔄 Frontend component development
- 🔄 Integration testing suite

**For Next Phase**:
- Real-time notifications
- Advanced search and filtering
- Admin dashboard enhancements
- Performance optimization
