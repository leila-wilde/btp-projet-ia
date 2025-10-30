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

## Web Implementation - Phase 1

**Date:** 2025-10-30  
**Stage:** Frontend Web Development  
**Purpose:** Create a functional web interface with news page, authentication button, and company logo

### Prompt:
```
À partir de ce projet, implémente un site web, sur lequel on pourra trouver une page de news, 
un bouton pour accéder à tout ce qui est authentification (qui est dans la branche feature/auth-system), 
et le logo de mon entreprise. Pour l'instant concentre toi pour avoir quelque chose de fonctionnel, 
pas forcément estéthique. Procède étape par étape, conserve ce prompt et les suivants dans le 
fichier prompts.md dans la branche main.
```

**Context:** Building on the existing Angular frontend with Spring Boot backend. Feature/auth-system branch contains authentication functionality to integrate.

**Output:** 

### Implementation Done:

✅ **Frontend Structure Created:**
- Angular 17 standalone components architecture
- TypeScript strict mode configuration
- Routing setup for multi-page navigation

✅ **Pages Implemented:**
1. **Home Page** (`/`): 
   - News feed with sample articles
   - Title, author, and date for each news item
   - Clean, functional card-based layout

2. **Authentication Page** (`/auth`):
   - Login and Sign Up forms with toggle
   - Email/password validation
   - Session persistence with localStorage
   - Success/error message display
   - Form state management

3. **Profile Page** (`/profile`):
   - Displays user information when logged in
   - Shows login prompt if not authenticated
   - Logout functionality
   - Account status display

✅ **Main Application Component:**
- Header with company logo placeholder (`src/assets/logo.png`)
- Navigation bar with buttons for Home, Auth, and Profile
- Responsive layout with footer
- Router outlet for page rendering

✅ **Styling:**
- Global CSS with modern design
- Button and form styling
- Card-based layouts
- Responsive design ready
- Color scheme: Professional blue/gray palette

✅ **Configuration Files:**
- `package.json` with Angular 17 dependencies
- `angular.json` for build configuration
- `tsconfig.json` for TypeScript configuration
- `.gitignore` for frontend
- README.md with setup instructions

### Next Steps:
- Add your company logo to `frontend/src/assets/logo.png`
- Install dependencies: `npm install` in the frontend folder
- Run `npm start` to launch development server
- Connect to backend API endpoints when ready
- Integrate feature/auth-system branch for production authentication

---

## How to Use This Document

- Each prompt should include the date, stage of development, purpose, and context
- Record both the prompt text and a brief description of the output
- Organize prompts chronologically or by development phase
- Include any follow-up prompts or iterations

---
