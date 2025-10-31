# L'Archipel Libre - Community Platform

A community-driven platform for collaborative learning, event sharing, and knowledge exchange. Developed entirely using generative AI by [Leila Wilde](https://github.com/leila-wilde) and [Louis Cordier](https://github.com/louis-cordier).

## 🌐 Project Overview

L'Archipel Libre enables community members to:
- **Register and manage personal profiles** with role-based access control
- **Create and browse community events** with an interactive calendar
- **Participate in discussion forums** with categorized threads
- **Propose and collaborate on workshops** with voting and feedback systems

## 🏗️ Technical Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 21
- **Database**: PostgreSQL 15
- **ORM**: JPA/Hibernate
- **Authentication**: JWT-based Spring Security
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 17
- **State Management**: NgRx
- **UI Components**: Angular Material
- **Styling**: SCSS with Flexbox/Grid

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: JUnit 5, Jasmine, Karma

## 🚀 Quick Start

### Prerequisites

- Java 21 or higher
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15 (or use Docker)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/leila-wilde/btp-projet-ia.git
   cd btp-projet-ia
   ```

2. **Run setup script**
   ```bash
   ./scripts/setup-dev-env.sh
   ```

3. **Start the backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Using Docker Compose

```bash
docker-compose up -d
```

Access the application:
   - Frontend: http://localhost:8081
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Database: localhost:5433

## 📁 Project Structure

```
btp-projet-ia/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/archipellibre/
│   │   │   │   ├── config/          # Security & app configuration
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── model/           # JPA entities
│   │   │   │   ├── repository/      # Data access layer
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── security/        # JWT & authentication
│   │   │   │   └── dto/             # Data transfer objects
│   │   │   └── resources/           # Application configs
│   │   └── test/                    # Unit & integration tests
│   └── pom.xml
│
├── frontend/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/               # Guards, interceptors, services
│   │   │   ├── shared/             # Reusable components
│   │   │   ├── features/           # Feature modules
│   │   │   │   ├── auth/           # Authentication
│   │   │   │   ├── events/         # Event management
│   │   │   │   ├── forum/          # Discussion forum
│   │   │   │   └── workshop/       # Workshop proposals
│   │   │   ├── store/              # NgRx state management
│   │   │   └── models/             # TypeScript interfaces
│   │   ├── assets/                 # Static assets
│   │   └── environments/           # Environment configs
│   └── package.json
│
├── docs/                    # Documentation
│   ├── prompts.md           # AI interaction logs
│   ├── repo-design.md       # Repository structure
│   ├── tech-stack.md        # Technology decisions
│   ├── database-schema.md   # Database design
│   └── system-design.md     # System architecture
│
├── scripts/                 # Utility scripts
│   ├── setup-dev-env.sh     # Development environment setup
│   └── run-tests.sh         # Test runner
│
├── .github/                 # GitHub configuration
│   ├── workflows/           # CI/CD pipelines
│   └── ISSUE_TEMPLATE/      # Issue templates
│
├── docker-compose.yml       # Docker orchestration
├── AGENTS.md               # AI agents documentation
└── README.md               # This file
```

## 🔑 Key Features

### User Management
- Secure email-based registration
- JWT token authentication
- Role-based access control (User, Moderator, Admin)
- Password reset functionality

### Event Management
- Create, edit, and delete events
- Interactive community calendar
- Event registration with capacity limits
- Event status tracking (Scheduled, In Progress, Completed, Cancelled)

### Discussion Forum
- Thread creation with categories
- Commenting system
- Thread pinning and locking
- Moderation tools for administrators

### Workshop Proposals
- Submit workshop ideas
- Community voting system
- Approval workflow
- Status tracking (Pending, Approved, Rejected, In Progress, Completed)

## 🧪 Testing

Run all tests:
```bash
./scripts/run-tests.sh
```

Backend tests only:
```bash
cd backend && mvn test
```

Frontend tests only:
```bash
cd frontend && npm test
```

## 📚 API Documentation

API documentation is available via Swagger UI at:
- Development: http://localhost:8080/swagger-ui.html
- OpenAPI spec: http://localhost:8080/v3/api-docs

### Main Endpoints

- **Auth**: `/api/auth/*` - Authentication (login, register)
- **Users**: `/api/users/*` - User management
- **Events**: `/api/events/*` - Event operations
- **Forum**: `/api/forum/*` - Discussion forums
- **Workshops**: `/api/workshops/*` - Workshop proposals

## 🤖 AI-Assisted Development

This project demonstrates comprehensive AI-assisted development. All AI interactions are documented:

- **[docs/INDEX.md](./docs/INDEX.md)**: Complete documentation index
- **[AGENTS.md](./AGENTS.md)**: AI agents and tools used
- **[docs/prompts.md](./docs/prompts.md)**: Complete prompt history
- **[docs/conception.md](./docs/conception.md)**: Design decisions

## 🛠️ Development

### Code Style

- Backend: Follow Java conventions, use Lombok for boilerplate reduction
- Frontend: Follow Angular style guide
- Comments: Only for complex logic requiring clarification

### Security Best Practices

- Passwords hashed with BCrypt
- JWT tokens for stateless authentication
- CORS configuration for frontend-backend communication
- Input validation on all endpoints
- SQL injection prevention via JPA/Hibernate

## 🚧 Roadmap

- [x] Project structure setup
- [x] Backend entities and repositories
- [x] JWT authentication system
- [x] Security configuration
- [ ] Event management endpoints
- [ ] Forum functionality
- [ ] Workshop proposal system
- [ ] Frontend components
- [ ] Integration tests
- [ ] Deployment configuration

## 👥 Team

[Leila Wilde](https://github.com/leila-wilde) and [Louis Cordier](https://github.com/louis-cordier) - Student software developers exploring AI-assisted development.

## 📝 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## 🤝 Contributing

Please read our contribution guidelines before submitting pull requests.

---

**Last Updated**: 2025-10-30

---

# L'Archipel Libre - Plateforme Communautaire

Une plateforme communautaire pour l'apprentissage collaboratif, le partage d'événements et l'échange de connaissances. Développée entièrement avec l'IA générative par [Leila Wilde](https://github.com/leila-wilde) et [Louis Cordier](https://github.com/louis-cordier).

## 🌐 Aperçu du Projet

L'Archipel Libre permet aux membres de la communauté de :
- **S'inscrire et gérer des profils personnels** avec contrôle d'accès basé sur les rôles
- **Créer et consulter des événements communautaires** avec un calendrier interactif
- **Participer à des forums de discussion** avec des fils de discussion catégorisés
- **Proposer et collaborer sur des ateliers** avec systèmes de vote et de feedback

## 🏗️ Stack Technique

### Backend
- **Framework**: Spring Boot 3.2.0
- **Langage**: Java 21
- **Base de données**: PostgreSQL 15
- **ORM**: JPA/Hibernate
- **Authentification**: Spring Security basé sur JWT
- **Documentation API**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 17
- **Gestion d'état**: NgRx
- **Composants UI**: Angular Material
- **Style**: SCSS avec Flexbox/Grid

### Infrastructure
- **Conteneurisation**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Tests**: JUnit 5, Jasmine, Karma

## 🚀 Démarrage Rapide

### Prérequis

- Java 21 ou supérieur
- Node.js 18+ et npm
- Docker et Docker Compose
- PostgreSQL 15 (ou utiliser Docker)

### Configuration de Développement

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/leila-wilde/btp-projet-ia.git
   cd btp-projet-ia
   ```

2. **Exécuter le script de configuration**
   ```bash
   ./scripts/setup-dev-env.sh
   ```

3. **Démarrer le backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Démarrer le frontend** (dans un nouveau terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Accéder à l'application**
   - Frontend: http://localhost:4200
   - API Backend: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Utilisation de Docker Compose

```bash
docker-compose up -d
```

Accéder à l'application:
   - Frontend: http://localhost:8081
   - API Backend: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Base de données: localhost:5433

## 📚 Documentation de l'API

La documentation de l'API est disponible via Swagger UI à :
- Développement: http://localhost:8080/swagger-ui.html
- Spécification OpenAPI: http://localhost:8080/v3/api-docs

### Points de Terminaison Principaux

- **Auth**: `/api/auth/*` - Authentification (connexion, inscription)
- **Users**: `/api/users/*` - Gestion des utilisateurs
- **Events**: `/api/events/*` - Opérations sur les événements
- **Forum**: `/api/forum/*` - Forums de discussion
- **Workshops**: `/api/workshops/*` - Propositions d'ateliers

## 👥 Équipe

[Leila Wilde](https://github.com/leila-wilde) et [Louis Cordier](https://github.com/louis-cordier) - Étudiants développeurs explorant le développement assisté par IA.

---

**Dernière Mise à Jour**: 2025-10-28
