# Quick Start Guide

## 🚀 Option 1: Docker (Recommended for Deployment)

```bash
cd /home/nyxx/Projects/btp-projet-ia
docker-compose up -d
```

**Wait 30 seconds for services to start.**

## 🚀 Option 2: Native Development (For Integration Testing)

### Prerequisites
- Java 21+ | Maven | Node.js 18+ | PostgreSQL running

### Terminal 1: Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
✓ Wait for: "Application started"

### Terminal 2: Frontend
```bash
cd frontend
npm install  # First time only
npm start
```
✓ Wait for: "Compiled successfully"
✓ Opens: http://localhost:4200

### Quick Integration Test (5 minutes)
1. Register new user at http://localhost:4200/auth/register
2. Login with your credentials
3. Open DevTools (F12) → Network tab
4. Click "Events" in navigation
5. Find GET /api/events request
6. Check Request Headers → **Authorization: Bearer eyJ...**
7. ✅ If Authorization header present = Integration working!

📖 **Full Testing Guide:** See [docs/INTEGRATION_TESTING_GUIDE.md](docs/INTEGRATION_TESTING_GUIDE.md)

## 🌐 Access Services

| Service | URL | Login |
|---------|-----|-------|
| Frontend | http://localhost:8081 | testuser / Test@123 |
| Backend API | http://localhost:8080 | - |
| Swagger Docs | http://localhost:8080/swagger-ui.html | - |
| pgAdmin | http://localhost:5050 | admin@example.com / admin |

## 🔐 Test API Login

**POST** `/api/auth/login`
```json
{
  "usernameOrEmail": "testuser",
  "password": "Test@123"
}
```

## 📊 View Database

1. Open pgAdmin: http://localhost:5050
2. Login: `admin@example.com` / `admin`
3. Right-click "Servers" → Create → Server
4. Fill in:
   - **Name:** archipellibre-db
   - **Host:** postgres
   - **Port:** 5432
   - **Database:** archipellibre
   - **User:** archipellibre
   - **Password:** changeme
5. Save and browse tables

## 📝 Create New User

**POST** `/api/auth/register`
```json
{
  "username": "newuser",
  "email": "newuser@test.com",
  "password": "Password123!"
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Services won't start | `docker-compose down && docker-compose up -d` |
| pgAdmin won't login | `docker-compose restart pgadmin && sleep 30` |
| API returns 403 | Use correct credentials: testuser / Test@123 |
| Can't connect to DB from pgAdmin | Use hostname "postgres" not localhost, port 5432 |

## 📚 Full Guides

- **Development**: See [DEVELOPMENT.md](DEVELOPMENT.md)
- **Testing & Deployment**: See [TESTING_DEPLOYMENT.md](TESTING_DEPLOYMENT.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Next Steps**: Read [DEVELOPMENT.md](DEVELOPMENT.md) to start coding.
