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

## How to Use This Document

- Each prompt should include the date, stage of development, purpose, and context
- Record both the prompt text and a brief description of the output
- Organize prompts chronologically or by development phase
- Include any follow-up prompts or iterations

---
