# BTP Projet IA - Virtual Start-up

A virtual start-up project developed entirely using generative AI, created by [Leila Wilde](https://github.com/leila-wilde) and [Louis Cordier](https://github.com/louis-cordier).

## 🎯 Project Overview

This project demonstrates the end-to-end development of a virtual start-up using generative AI throughout all stages, from initial planning and design to implementation and documentation.

## 📋 Project Goals

- Build a functional virtual start-up solution
- Document AI usage at every stage of development
- Showcase best practices for AI-assisted software development
- Create a replicable template for AI-driven projects

## 🏗️ Project Structure

```
btp-projet-ia/
├── frontend/           # Angular 17 web application
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── home/        # News feed page
│   │   │   │   ├── auth/        # Authentication page
│   │   │   │   └── profile/     # User profile page
│   │   │   ├── app.component.ts # Main layout with header/nav
│   │   │   └── app.routes.ts    # Routing configuration
│   │   ├── assets/              # Static assets (logo, images)
│   │   ├── index.html           # HTML entry point
│   │   ├── main.ts              # Bootstrap file
│   │   └── styles.css           # Global styles
│   ├── package.json
│   ├── angular.json
│   └── README.md
├── backend/            # Spring Boot backend
├── docs/               # Technical documentation
├── README.md           # Project overview and documentation
├── AGENTS.md           # AI agents and tools documentation
├── CHANGELOG.md        # Version history and changes
├── SETUP_GUIDE.md      # Platform setup and usage guide
├── conception.md       # Design and planning documentation
├── benchmarks.md       # Performance metrics and testing results
├── prompts.md          # All AI prompts used in the project
├── .gitignore          # Git ignore configuration
└── LICENSE             # Project license
```

## 🤖 AI-Assisted Development

This project is developed using generative AI tools. All prompts, decisions, and AI interactions are documented in the following files:

- **[prompts.md](./prompts.md)**: Complete record of all AI prompts used
- **[AGENTS.md](./AGENTS.md)**: Documentation of AI agents and their roles
- **[conception.md](./conception.md)**: Design decisions and planning process

## 📊 Documentation

- **[CHANGELOG.md](./CHANGELOG.md)**: Track all project changes and versions
- **[benchmarks.md](./benchmarks.md)**: Performance metrics and testing results
- **[conception.md](./conception.md)**: Detailed design and architecture documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+ (for frontend)
- Java 21+ and Maven (for backend) 
- Docker and Docker Compose (optional, for containerization)
- PostgreSQL 15+ (for database)

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:4200/`

**⚠️ Important:** Add your company logo at `frontend/src/assets/logo.png`

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Full Setup Guide

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions including:
- Logo configuration
- Development environment setup
- Building and deployment
- Troubleshooting

## 🌟 Current Features

### ✅ Web Platform (Frontend)
- **News Feed**: Display community news and updates on the home page
- **Authentication**: Login and sign-up functionality with form validation
- **User Profile**: User account management and logout
- **Responsive Navigation**: Header with company logo, title, and navigation buttons
- **Clean Design**: Functional, minimalist UI ready for styling

### ✅ Architecture
- Angular 17 with standalone components (no NgModules)
- TypeScript strict mode
- Component-based routing
- Local storage for session management (demo mode)
- Responsive CSS styling

## 📖 Usage

### Home Page (`/`)
Browse the latest news and updates from the community.

### Authentication (`/auth`)
- Click "Authentification" button to access login/signup
- Toggle between login and sign-up modes
- Demo mode uses local storage for session persistence

### Profile (`/profile`)
- View your account information when logged in
- Access logout functionality
- Redirects to login if not authenticated

## 👥 Team

[Leila Wilde](https://github.com/leila-wilde) and [Louis Cordier](https://github.com/louis-cordier) - student software developers exploring AI-assisted development.

## 📝 License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## 🚀 Technology Stack

### Frontend
- **Framework**: Angular 17
- **Language**: TypeScript 5.2
- **Styling**: CSS3
- **Routing**: Angular Router
- **Build Tool**: Angular CLI with esbuild

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 21
- **Database**: PostgreSQL 15
- **Authentication**: JWT
- **API**: RESTful

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git
- **CI/CD**: GitHub Actions

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)**: Comprehensive setup instructions
- **[AGENTS.md](./AGENTS.md)**: AI agents used in development
- **[prompts.md](./prompts.md)**: All AI prompts with context
- **[conception.md](./conception.md)**: Architecture and design decisions
- **[CHANGELOG.md](./CHANGELOG.md)**: Version history
- **[frontend/README.md](./frontend/README.md)**: Frontend-specific documentation

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

---

**Note:** This is a living document that will be updated as the project evolves.
