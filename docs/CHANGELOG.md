# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Exception handling architecture via BaseApiController inheritance
  - Centralized exception handlers for ResourceNotFoundException, BusinessLogicException
  - Consistent ApiResponse format for all errors
  - Per-controller exception handling (avoids Springdoc compatibility issues)
- Comprehensive Exception Handling documentation (docs/EXCEPTION_HANDLING.md)
  - Architecture overview and design decisions
  - Error response format and status codes
  - Custom exception creation guide
  - Testing and troubleshooting
- Springdoc-OpenAPI configuration improvements
  - Swagger UI accessible at `/swagger-ui.html` ✅
  - Proper public endpoint configuration
  - Security endpoint authorization

### Changed
- Updated GlobalExceptionHandler to use per-controller pattern via BaseApiController
  - Removed non-functional @RestControllerAdvice (Springdoc 2.3.0 incompatible)
  - EventController, AuthController, UserController, ForumController now extend BaseApiController
- Server error handling configuration
  - Disabled whitelabel error pages
  - Added proper JSON error responses
  - Hidden stack traces for security
- Updated documentation
  - SWAGGER_UI_GUIDE.md: Added Springdoc 2.3.0 limitation note
  - authentication-guide.md: Updated public endpoints list
  - api-contracts-user.md: Updated Swagger URL references
  - docs/INDEX.md: Added Exception Handling documentation reference

### Fixed
- ✅ Swagger UI no longer returns 403 Forbidden
- ✅ Whitelabel error pages no longer appear
- ✅ All API errors return consistent JSON ApiResponse format
- ✅ Exception handlers properly registered via inheritance
- ✅ Springdoc 2.3.0 compatibility maintained (no 500 errors on /v3/api-docs)

### Important Notes
- Springdoc 2.3.0 with Spring Boot 3.5.0: Use `/swagger-ui.html` (not `/swagger-ui/`)
- Per-controller exception handling prevents global advice conflicts
- All errors hidden stack traces for security

### Complete Authentication and Authorization implementation
   - JWT token generation and validation (JJWT 0.12.3)
   - BCrypt password encoding with Spring Security
   - UserDetailsService with dual username/email lookup
   - JwtAuthenticationFilter for stateless authentication
   - Role-based access control foundation (USER, MODERATOR, ADMIN)
   - 7 comprehensive integration tests with 100% pass rate
   - H2 in-memory database for testing
- Comprehensive Authentication & Authorization Guide (docs/authentication-guide.md)
   - Implementation details and architecture overview
   - API endpoint documentation
   - Security best practices and troubleshooting
   - Frontend and backend integration examples
- Updated JJWT dependency from 0.9.1 to 0.12.3 for Java 21 compatibility

### Changed
- AuthController `/register` endpoint now returns 201 Created status (was 200 OK)
- JwtTokenProvider updated to use modern JJWT API (verifyWith/parseSignedClaims)
- Improved test assertions for password encoding verification

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
