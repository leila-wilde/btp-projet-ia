# Native Development Setup

For developing locally without Docker containers, follow this guide.

## Prerequisites

- Java 21+
- Maven 3.8+
- Node.js 18+
- PostgreSQL running in Docker (for database)

## Step 1: Start PostgreSQL (Docker)

Keep the database running in Docker while developing the application natively:

```bash
# If docker containers are running
docker-compose up -d postgres

# If you stopped everything, start database only
docker run -d \
  --name archipellibre-db \
  -e POSTGRES_USER=archipellibre \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=archipellibre \
  -p 5433:5432 \
  postgres:15-alpine

# Verify database is running
docker ps | grep postgres
```

## Step 2: Start Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Wait for:** `Application started`

**Verify:**
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

## Step 3: Start Frontend (Terminal 2)

```bash
cd frontend
npm install  # First time only
npm start
```

**Wait for:** `Compiled successfully`
**Browser opens:** http://localhost:4200

## Step 4: Quick Integration Test

1. Open http://localhost:4200 in browser
2. Register new user or login
3. Press F12 to open DevTools
4. Go to Network tab
5. Click "Events" in navigation
6. Look for GET /api/events request
7. Click it and check Request Headers
8. **Verify:** Authorization header present → `Bearer eyJ...`

**Result:** ✅ Integration working!

---

## Configuration Details

### Backend Profile: `dev`

Location: `backend/src/main/resources/application-dev.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/archipellibre  # Docker port
    username: archipellibre
    password: changeme
  jpa:
    hibernate:
      ddl-auto: update  # Auto-create/update schema
```

### Database Connection

- **Host:** localhost
- **Port:** 5433 (Docker)
- **Database:** archipellibre
- **Username:** archipellibre
- **Password:** changeme

### Frontend Config: `dev`

Location: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

## Stopping Everything

### Stop Backend
```bash
# In backend terminal: Ctrl+C
```

### Stop Frontend
```bash
# In frontend terminal: Ctrl+C
```

### Stop Database
```bash
# Keep running in Docker, or:
docker stop archipellibre-db
```

---

## Cleanup

### Reset Database
```bash
docker stop archipellibre-db
docker rm archipellibre-db
# Then restart as per Step 1
```

### Clean Build
```bash
# Backend
cd backend
mvn clean
rm -rf target

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Troubleshooting

### Backend won't start: "Port 8080 already in use"
```bash
# Check what's using port 8080
lsof -i :8080

# If Docker container, stop it
docker stop archipellibre-backend

# If another process, kill it
kill <PID>
```

### Database connection refused
```bash
# Verify database is running
docker ps | grep postgres

# Verify connection
psql -h localhost -p 5433 -U archipellibre -d archipellibre
# Password: changeme
```

### Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:8080/actuator/health

# Check CORS configuration in backend
# Location: backend/src/main/java/.../security/SecurityConfig.java
```

### npm start fails
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Tips

- **Keep database running:** Leave Docker running for quick restarts
- **Logs:** Check backend logs for errors: `tail -f /tmp/backend.log`
- **DevTools:** Always use DevTools to verify API integration
- **Rebuild:** After changing backend code, restart backend
- **Frontend changes:** Auto-reload without restart

---

## Full Stack (All-in-One)

For easier testing, you can still use Docker Compose for everything:

```bash
docker-compose up

# Stops:
docker-compose down
```

This is **recommended for final testing** before deployment.

---

**Status:** Ready for native development! 🚀
