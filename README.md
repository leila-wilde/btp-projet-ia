# L'Archipel Libre

> "Des îlots de technologie au service du lien social."  
> Technology at the service of social connection.

## 🚀 Quick Start

```bash
docker-compose up -d
```

**Services**: Frontend (8081) | API (8080) | Swagger (8080/swagger-ui.html) | pgAdmin (5050)

👉 **[→ Read QUICK_START.md for detailed setup](QUICK_START.md)**

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| **[QUICK_START.md](QUICK_START.md)** | 5-minute setup, how to access services |
| **[DEVELOPMENT.md](DEVELOPMENT.md)** | Code structure, API endpoints, how to code |
| **[TESTING_DEPLOYMENT.md](TESTING_DEPLOYMENT.md)** | Testing, debugging, deploying to production |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design, code standards, best practices |

---

## 🎯 Project Overview

**L'Archipel Libre** is a community platform for organizing events, discussions, and collaborative workshops. Built with **Spring Boot** (backend), **Angular 17** (frontend), and **PostgreSQL** (database).

### Core Features

- 👤 **User Management**: Registration, authentication, roles (USER, MODERATOR, ADMIN)
- 📅 **Events**: Create, browse, register for community events
- 💬 **Forum**: Discussion threads with moderation capabilities
- 🛠️ **Workshops**: Community proposals with voting system

### Tech Stack

- **Backend**: Java 21, Spring Boot 3.2, PostgreSQL 15
- **Frontend**: Angular 17, NgRx, Material Design
- **DevOps**: Docker, Docker Compose, GitHub Actions
- **Testing**: JUnit 5, Jasmine/Karma

---

## 🔐 Test Credentials

| Service | User | Password |
|---------|------|----------|
| **API** | testuser | Test@123 |
| **pgAdmin** | admin@example.com | admin |

---

## 📋 Key Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and get JWT

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event
- `POST /api/events/{id}/register` - Register for event

### Forum
- `GET /api/forum/threads` - List discussion threads
- `POST /api/forum/threads` - Create thread
- `POST /api/forum/posts` - Reply to thread

### Workshops
- `GET /api/workshops` - List proposals
- `POST /api/workshops` - Propose workshop
- `POST /api/workshops/{id}/vote` - Vote on proposal

**Full API docs**: http://localhost:8080/swagger-ui.html

---

## 🛠️ Common Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Run tests
cd backend && mvn test
cd frontend && npm test

# Access database
docker exec -it archipellibre-db psql -U archipellibre -d archipellibre
```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Services won't start | Check Docker running, ports available |
| API returns 403 | Use correct credentials: testuser / Test@123 |
| pgAdmin won't login | Restart: `docker-compose restart pgadmin` |
| Database errors | Check logs: `docker-compose logs postgres` |

---

## 📞 Support

- **API Issues**: Check Swagger docs at http://localhost:8080/swagger-ui.html
- **Database Issues**: Use pgAdmin at http://localhost:5050 to debug
- **Frontend Issues**: Open browser console (F12) to see errors
- **Docker Issues**: Run `docker-compose ps` to check container status

---

## 🎯 Next Steps

1. **Read [QUICK_START.md](QUICK_START.md)** to get up and running (5 min)
2. **Read [DEVELOPMENT.md](DEVELOPMENT.md)** to understand the codebase (15 min)
3. **Start coding** - See MVP tasks in [DEVELOPMENT.md](DEVELOPMENT.md)

---

**Project Timeline**: MVP launch in 4 days  
**License**: Proprietary - L'Archipel Libre

---

**Last Updated**: December 1, 2025
