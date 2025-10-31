# L'Archipel Libre - Documentation Index

This document serves as a central hub for all project documentation. Use this guide to navigate project resources.

## 🚀 Getting Started

1. **[README.md](../README.md)** - Start here for project overview, quick start, and features
2. **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines and code standards
3. **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Current implementation status and what's completed

## 🤖 AI-Assisted Development

- **[AGENTS.md](../AGENTS.md)** - AI agents used, capabilities, and best practices learned
- **[prompts.md](./prompts.md)** - Complete documentation of all AI prompts used
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and project milestones

## 🏗️ Architecture & Design

- **[repo-design.md](./repo-design.md)** - Project structure and file organization
- **[system-design.md](./system-design.md)** - System architecture and design patterns
- **[authentication-guide.md](./authentication-guide.md)** - JWT, BCrypt, Spring Security implementation
- **[database-schema.md](./database-schema.md)** - Database design and entity relationships
- **[tech-stack.md](./tech-stack.md)** - Technology choices and justifications

## 💡 Project Planning

- **[conception.md](./conception.md)** - Project conception and planning documents

## 📊 Quick Reference

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 3.2, Java 21, PostgreSQL 15 |
| **Frontend** | Angular 17, NgRx, Angular Material |
| **DevOps** | Docker, GitHub Actions |
| **Testing** | JUnit 5, Jasmine, Karma |

### Core Modules

**Backend:**
- Authentication & Security (JWT, Spring Security)
- User Management (Registration, Profiles, Roles)
- Event Management (Create, Browse, Register)
- Discussion Forum (Threads, Posts, Moderation)
- Workshop Proposals (Voting, Approval Workflows)
- Admin Dashboard

**Frontend:**
- Auth Module (Login, Registration, JWT)
- Events Module (Listing, Calendar, Details)
- Forum Module (Threads, Posting, Browsing)
- Workshop Module (Proposals, Voting)
- User Module (Profile Management)

## 🔗 Important Links

### Development
- **Setup Scripts**: `scripts/setup-dev-env.sh`, `scripts/run-tests.sh`
- **Docker Configuration**: `docker-compose.yml`
- **GitHub Workflows**: `.github/workflows/`

### Documentation in README
- Project Overview
- Technical Stack Details
- API Documentation (Swagger)
- Development Guidelines
- Security Best Practices

### Database
- PostgreSQL 15 configuration in `backend/src/main/resources/`
- Schema defined in `docs/database-schema.md`
- JPA entities in `backend/src/main/java/.../model/`

## 📋 Working with Documentation

### Updating Documentation
1. Make changes to specific document
2. Update CHANGELOG.md with changes
3. Update this INDEX if adding new documentation
4. Ensure links are relative and correct

### Best Practices
- Keep documentation in sync with code changes
- Use bilingual approach (English/French) for user-facing docs
- Link related documents for easy navigation
- Update version info and dates regularly

## 🎯 Common Tasks

### Setting Up Development Environment
→ See [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) and [README.md](../README.md)

### Contributing Code
→ See [CONTRIBUTING.md](../CONTRIBUTING.md)

### Understanding Project Architecture
→ See [repo-design.md](./repo-design.md) and [system-design.md](./system-design.md)

### Learning About AI Development Process
→ See [AGENTS.md](../AGENTS.md) and [prompts.md](./prompts.md)

### Checking Database Schema
→ See [database-schema.md](./database-schema.md)

### Reviewing Technology Decisions
→ See [tech-stack.md](./tech-stack.md)

## 📞 Support Resources

- **Issues**: Check GitHub Issues for known problems
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: Reach out to maintainers on GitHub

## 📝 Notes

- All documentation uses Markdown format
- Bilingual content provided in English and French where applicable
- Diagrams and visual content referenced where helpful
- External links checked and maintained regularly

---

**Last Updated:** 2025-10-30  
**Version:** Aligned with project v0.1.0+
