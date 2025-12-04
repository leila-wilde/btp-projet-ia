# Testing & Deployment Guide

## 🧪 Integration Testing (5-20 Minutes)

### Quick Test (5 Minutes)
```bash
# Terminal 1: Start Backend
cd backend && mvn spring-boot:run

# Terminal 2: Start Frontend  
cd frontend && npm start

# Browser: http://localhost:4200
```

**Test flow:**
1. Register user at /auth/register
2. Login with credentials
3. Open DevTools (F12) → Network tab
4. Navigate to Events page
5. Find GET /api/events request
6. Check Request Headers → **Authorization: Bearer eyJ...**
✓ If Authorization header present = Integration working!

### Thorough Testing (15-20 Minutes)

See full guide: [docs/INTEGRATION_TESTING_GUIDE.md](docs/INTEGRATION_TESTING_GUIDE.md)

**Covers:**
- ✅ Startup verification
- ✅ Registration & authentication
- ✅ JWT token injection
- ✅ Pagination & filtering
- ✅ CRUD operations
- ✅ Error handling
- ✅ Network monitoring
- ✅ Performance checks

### DevTools Inspection Checklist
- ☐ **Network tab:** All requests show 200-299 status
- ☐ **Network tab:** Authorization header present
- ☐ **Network tab:** Responses are valid JSON
- ☐ **Application tab:** auth_token in localStorage
- ☐ **Console tab:** No red error messages

### Success Indicators
✅ Backend on :8080 (no errors)
✅ Frontend on :4200 (compiled successfully)
✅ Can register user
✅ Tokens in localStorage
✅ Authorization header in requests
✅ Events/Forum/etc. pages load
✅ No console errors

---

## 🧪 Unit Testing

### Backend Tests
```bash
cd backend
mvn test              # Unit tests
mvn verify            # All tests + integration
mvn spring-boot:run   # Start for manual testing
```

**Frontend**:
```bash
cd frontend
npm test -- --watch=false --code-coverage  # All tests
npm test                                   # Watch mode
npm run lint                               # Code quality
```

### Test Coverage

- Backend: JUnit 5, 80%+ coverage
- Frontend: Jasmine/Karma, 67 test cases across 7 test suites
- Integration: Manual testing via Swagger & pgAdmin

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login returns JWT
- [ ] JWT can access protected endpoints
- [ ] Create event from frontend → verify in database
- [ ] Create forum post → appears in list
- [ ] Vote on workshop → count updates
- [ ] Admin can delete/moderate content
- [ ] Mobile responsive (test on phone)
- [ ] No console errors

## 🚀 Deployment

### Prerequisites

- Docker & Docker Compose installed
- Server/cloud account (if deploying remotely)
- Domain name (optional, for HTTPS)

### Local Deployment

```bash
# Build all services
docker-compose build

# Start everything
docker-compose up -d

# Verify
docker-compose ps
# All containers should show "Up"

# Check logs
docker-compose logs -f backend
```

### Verify Deployment

1. **Frontend**: http://localhost:8081 → Should load
2. **API**: http://localhost:8080/swagger-ui.html → Should be responsive
3. **Database**: Connect via pgAdmin, check tables have data
4. **Login**: Test with testuser / Test@123

### Production Checklist

- [ ] Environment variables set correctly
- [ ] Database backed up
- [ ] HTTPS enabled (if public)
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring/logging set up
- [ ] Admin user created
- [ ] Test data seeded

### Environment Variables

**Backend** (`.env` or `docker-compose.yml`):
```
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/archipellibre
SPRING_DATASOURCE_USERNAME=archipellibre
SPRING_DATASOURCE_PASSWORD=changeme
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBe256BitsOrMoreForHS512Algorithm
```

**Frontend** (`.env`):
```
API_URL=http://localhost:8080
```

### Backup & Restore

**Backup Database**:
```bash
docker exec archipellibre-db pg_dump -U archipellibre archipellibre > backup.sql
```

**Restore Database**:
```bash
docker exec -i archipellibre-db psql -U archipellibre archipellibre < backup.sql
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Services won't start | Check ports (8080, 8081, 5433, 5050 available) |
| Database connection refused | `docker-compose logs postgres`, check health |
| API returns 500 | Check backend logs: `docker-compose logs backend` |
| Frontend blank page | Clear cache, check console for errors |
| Database locked | Wait 30 seconds or restart postgres |

### Production Deployment

**Option 1: Digital Ocean / AWS / Azure**
```bash
# Push code to git
git push origin main

# SSH into server
ssh user@server

# Clone and run
git clone <repo>
cd btp-projet-ia
docker-compose -f docker-compose.prod.yml up -d
```

**Option 2: Heroku**
```bash
heroku create archipel-libre
git push heroku main
```

**Option 3: Docker Hub**
```bash
docker tag archipellibre-backend your-registry/archipellibre-backend
docker push your-registry/archipellibre-backend
# Update docker-compose to use your registry
```

### Monitor Production

```bash
# View logs
docker-compose logs -f

# Check resource usage
docker stats

# Restart failed service
docker-compose restart backend

# Update code and redeploy
git pull
docker-compose build
docker-compose up -d
```

## Performance Optimization

- Backend: Add @Transactional on services, use pagination
- Frontend: Lazy load modules, cache API responses
- Database: Add indexes on frequently queried columns
- Infrastructure: Enable gzip compression, use CDN for static files

## Security

- **Passwords**: Hashed with BCrypt (Spring Security)
- **API**: Protected with JWT tokens
- **CORS**: Configured for frontend domain only
- **SQL Injection**: Prevented via JPA/Hibernate ORM
- **XSS**: Angular auto-escapes templates

---

**Typical Deployment Flow**: Build → Test → Push to git → SSH to server → Pull → Restart services
