# Prompts Documentation

This document contains all prompts used throughout the project development process, documenting our usage of generative AI at all stages.

## Initial Project Setup

**Date:** 2025-10-21  
**Stage:** Project Initialization  
**Purpose:** Create skeleton files for the project

### Prompt:
```
We are two student software developers. The goal of this project is to create a virtual start-up which we will build using generative AI. We'll use generative AI throughout and document our usage at all stages from planning & designing to coding. 
Generate skeleton files for the following:
- README.md 
- AGENTS.md 
- CHANGELOG.md 
- conception.md 
- benchmarks.md 
- prompts.md 
- .gitignore 
All prompt should be saved automatically in prompts.md (including this one)
```

**Context:** Setting up the basic structure for a virtual start-up project that will be developed with AI assistance.

**Output:** Created skeleton files for documentation and project structure.

---

---

## L'Archipel Libre - Full Project Setup

**Date:** 2025-10-28  
**Stage:** Complete Project Structure Initialization  
**Purpose:** Set up full-stack application structure for L'Archipel Libre community platform

### Prompt:
```
## 🌐 Project Overview
L'Archipel Libre is a community-driven platform designed to facilitate collaborative learning, event sharing, and knowledge exchange. The MVP will focus on creating a robust, user-friendly web application that enables community members to:
- Register and manage personal profiles
- Create and browse community events
- Participate in discussion forums
- Propose and collaborate on workshops and projects

## 🏗️ Technical Architecture
### Backend
- Framework: Spring Boot 3.x
- Language: Java 21
- Database: PostgreSQL 15
- ORM: JPA/Hibernate
- Authentication: JWT-based Spring Security

### Frontend
- Framework: Angular 17
- State Management: NgRx
- Styling: Angular Material
- Responsive Design: Flexbox/Grid

## 🔑 Key Project Requirements

### User Management
- Secure registration and authentication
- Profile creation and management
- Role-based access control (User, Moderator, Admin)

### Community Features
1. Event Management
   - Create, edit, delete events
   - Interactive community calendar
   - Event registration and tracking

2. Discussion Forum
   - Thread creation
   - Commenting system
   - Categorization of discussions
   - Moderation tools

3. Workshop Proposal System
   - Submission mechanism for new workshop ideas
   - Voting/feedback system
   - Basic approval workflow

[Full prompt content includes technical specifications, API endpoints, testing strategy, etc.]
```

**Context:** Creating the complete project structure for a community platform MVP with Spring Boot backend and Angular frontend, to be developed by a two-person team in 10 days.

**Output:** Complete project structure with backend models, controllers, services, repositories, frontend components, configuration files, and documentation.

---

## Documentation Fix - Frontend Port Configuration

**Date:** 2025-10-29  
**Stage:** Documentation Update  
**Purpose:** Fix port number in documentation to reflect actual frontend deployment configuration

### Prompt:
```
The frontend seems to be on port 8081. Fix the README.md and any other necessary documentation to give the correct port, set-up and launch instructions. Don't forget to log and document this prompt in prompts.md.
```

**Context:** The docker-compose.yml was correctly configured with port 8081 for the frontend (port 8081:80 mapping), but the README.md documentation was showing http://localhost as the access point for Docker Compose deployment, which was misleading. The development setup instructions also only mentioned localhost:4200 (ng serve default) without clarifying the Docker port.

**Changes Made:**
1. Updated README.md (English section) to clarify:
   - Docker Compose frontend access: http://localhost:8081
   - Database access: localhost:5433
   - Backend API access: http://localhost:8080
   
2. Updated README.md (French section) with equivalent clarifications

**Output:** Improved documentation with clear, accurate port information for both development (ng serve on 4200) and Docker Compose deployment (frontend on 8081, backend on 8080, database on 5433).

---

## User Authentication and Authorization Flow Review & Implementation

**Date:** 2025-10-31  
**Stage:** Security Implementation & Testing  
**Purpose:** Review and complete the authentication and authorization flow for L'Archipel Libre with end-to-end testing

### Prompt:
```
Review the complete user authentication and authorization flow for the 'L'Archipel Libre' project and implement any necessary files and code.
Review the User entity and repository, the spring Security Configuration, JWT Utilities & UserDetails and the JWT Authentication Filter.
The Spring Security Configuration SecurityConfig class must use Configuration and EnableWebSecurity, have a Bcrypt password encoderer bean, and a SecurityFilterChain bean configured to use JWT, permit public access to /api/auth/register and /api/auth/login etc.require authentication for all other requests (e.g., /api/v1/**).
The JwtAuthenticationFilter should read the Authorization header, validate the JWT, and if valid, load the UserDetails from the UserDetailsService and set the Authentication in the SecurityContextHolder.

### Authentication Controller
Make sure that the AuthController is mapped to /api/auth that has RegisterRequest and LoginRequest DTOs
    1. /register endpoint:
        ◦ Takes a RegisterRequest.
        ◦ Checks if the username/email already exists.
        ◦ Encodes the password with BCrypt.
        ◦ Saves the new User to the database with the USER role.
        ◦ Returns a 201 Created status.
    2. /login endpoint:
        ◦ Takes a LoginRequest.
        ◦ Uses AuthenticationManager to authenticate the user.
        ◦ If authentication is successful, generate a JWT and return it in a response (e.g., {"token": "..."}).
Check the necessary properties configuration for PostgreSQL database connection (datasource URL, username, password), JPA/Hibernate settings (e.g., ddl-auto=update), and the JWT secret key and expiration time.

### End-to-End Integration Test
Finally, create an integration test using @SpringBootTest and @AutoConfigureMockMvc. This test must:
    1. Use @Testcontainers or an embedded H2 database for testing.
    2. Call the /api/auth/register endpoint with a test user.
    3. Verify the response is 201 Created.
    4. Call the /api/auth/login endpoint with the new user's credentials.
    5. Verify the response is 200 OK and that a JWT token is returned in the body.
    6. Use the UserRepository to find the user and assert that their saved password is not plain text (i.e., it has been encoded).
```

**Context:** Ensuring L'Archipel Libre has a secure, complete authentication system with proper JWT validation, BCrypt password encoding, and comprehensive test coverage using H2 in-memory database for testing.

**Implementation Details:**

**Updated Files:**
1. **JwtTokenProvider.java**: 
   - Upgraded from JJWT 0.9.1 to 0.12.3 for Java 21 compatibility
   - Updated to use modern JJWT API (`.parser().verifyWith()` instead of deprecated `.setSigningKey()`)
   - Uses `Keys.hmacShaKeyFor()` for secure key generation
   - Comprehensive error handling for JWT validation

2. **AuthController.java**:
   - Fixed `/register` endpoint to return 201 Created status code
   - Full user validation (username/email uniqueness)
   - BCrypt password encoding before storage
   - Both `/register` and `/login` endpoints fully functional

3. **AuthControllerTest.java**:
   - Enhanced with 7 comprehensive test cases:
     - `shouldRegisterNewUser()` - validates 201 Created response
     - `shouldNotRegisterUserWithExistingUsername()` - validates duplicate prevention
     - `shouldNotRegisterUserWithExistingEmail()` - validates email uniqueness
     - `shouldLoginWithValidCredentials()` - validates token generation
     - `shouldLoginWithEmail()` - validates email-based login
     - `shouldNotLoginWithInvalidPassword()` - validates 403 Forbidden
     - `shouldVerifyPasswordIsEncoded()` - validates BCrypt hashing (new)

4. **backend/pom.xml**:
   - Updated JJWT from 0.9.1 to 0.12.3
   - Added proper Maven dependencies: jjwt-api, jjwt-impl, jjwt-jackson

5. **Test Configuration**:
   - Uses H2 in-memory database (application-test.yml)
   - Test profile with separate JWT secret and expiration
   - @ActiveProfiles("test") for test isolation

**Security Features:**
- JWT token generation with HS512 signature algorithm
- BCrypt password encoding with Spring Security
- Stateless session management
- CORS configuration for frontend integration
- Public endpoints: `/api/auth/**`, GET `/api/events/**`, GET `/api/forum/**`, GET `/api/workshops/**`
- Protected endpoints: All other routes require authentication
- Role-based authorization ready (USER, MODERATOR, ADMIN roles defined)

**Test Results:**
- All 7 tests passing
- 201 Created status verified for registration
- JWT token generation verified
- Password encoding (BCrypt) verified
- Duplicate prevention verified
- Email-based login verified

**Output:** Complete, tested authentication and authorization system with:
- ✅ Secure JWT implementation (JJWT 0.12.3)
- ✅ BCrypt password encoding
- ✅ Role-based access control foundation
- ✅ 7 passing integration tests
- ✅ H2 in-memory database for testing
- ✅ Spring Security SecurityFilterChain configuration
- ✅ Public/Protected endpoint differentiation
- ✅ UserDetailsService with dual username/email lookup

---

## How to Use This Document

- Each prompt should include the date, stage of development, purpose, and context
- Record both the prompt text and a brief description of the output
- Organize prompts chronologically or by development phase
- Include any follow-up prompts or iterations

---
