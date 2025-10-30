# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete backend implementation (Spring Boot 3.2, Java 21)
  - 6 core modules: Auth, User, Event, Forum, Workshop, Admin
  - JWT authentication with Spring Security
  - PostgreSQL database with JPA/Hibernate
  - Swagger/OpenAPI documentation
- Full-stack Angular 17 frontend
  - NgRx state management
  - Material UI components
  - 5 feature modules with responsive design
- Docker containerization and docker-compose orchestration
- GitHub Actions CI/CD pipelines
- Comprehensive bilingual documentation (EN/FR)
- Documentation Index (docs/INDEX.md) for better navigation

### Changed
- Enhanced AGENTS.md with:
  - Detailed tool categories and capabilities
  - AI usage statistics table with completion status
  - Best practices learned from AI-assisted development
  - Project achievements summary
  - Technology stack details
  - Features developed with AI assistance
  - Key learnings with AI strengths and challenges
- Updated documentation references across project
- Improved project structure documentation
- Added cross-references in README to new INDEX.md

---

## [0.1.0] - 2025-10-21

### Added
- Initial project setup
- Project documentation structure
- AI-assisted development framework

### Context
- Project initiated by two student software developers
- Goal: Create a virtual start-up using generative AI
- All development stages will be AI-assisted and documented

---

## How to Use This Changelog

### Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Version Format

This project uses Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

---

## Template for New Entries

```markdown
## [Version] - YYYY-MM-DD

### Added
- New features or capabilities

### Changed
- Changes to existing functionality

### Deprecated
- Features that will be removed in future versions

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security-related changes
```

---

**Note:** Maintain this file diligently. Every significant change should be documented here before release.
