# L'Archipel Libre - Demo Data Guide

## Overview

When you run the application (not in test mode), the `DataInitializer` component automatically seeds the database with realistic demo data centered around the Provence region of France (Marseille, Aix-en-Provence, Avignon, Salon-de-Provence).

This allows you to immediately explore the platform with pre-populated content without manual setup.

## Demo Users

### Admin Account
- **Username**: `admin_provence`
- **Password**: `Admin123!`
- **Role**: Admin
- **Location**: Marseille, Provence

### Moderators
1. **Username**: `marie_marseille`
   - **Password**: `Marie123!`
   - **Role**: Moderator
   - **Location**: Marseille

2. **Username**: `pierre_aix`
   - **Password**: `Pierre123!`
   - **Role**: Moderator
   - **Location**: Aix-en-Provence

### Regular Users
1. **Username**: `jean_marseille`
   - **Password**: `Jean123!`
   - **Location**: Marseille - Vieux Port

2. **Username**: `sophie_aix`
   - **Password**: `Sophie123!`
   - **Location**: Aix-en-Provence

3. **Username**: `luc_avignon`
   - **Password**: `Luc123!`
   - **Location**: Avignon, Provence

4. **Username**: `alice_salon`
   - **Password**: `Alice123!`
   - **Location**: Salon-de-Provence

5. **Username**: `thomas_aubagne`
   - **Password**: `Thomas123!`
   - **Location**: Aubagne, Provence

## Demo Content

### Forum Threads (4 threads)
All discussions centered around technology, community, and digital sovereignty in Provence:

1. **Bienvenue à L'Archipel Libre!**
   - Category: Bienvenue
   - Creator: Jean Marseille
   - Description: Welcome message introducing the platform to locals

2. **Initiatives numériques à Marseille**
   - Category: Technologie
   - Creator: Sophie Aix
   - Pinned: Yes
   - Description: Discussion about tech projects and digital initiatives

3. **Événements culturels Aix-en-Provence**
   - Category: Culture
   - Creator: Marie Marseille (Moderator)
   - Description: Cultural events and social gatherings

4. **Challenges technologiques pour la souveraineté numérique**
   - Category: Souveraineté Numérique
   - Creator: Luc Avignon
   - Description: Digital sovereignty and data protection discussion

### Forum Posts (7 posts)
Realistic community discussions responding to threads above.

### Events (6 events)

All events are scheduled for December 2025 - January 2026 in Provence locations:

1. **Atelier Numérique - Les bases du code**
   - Location: Marseille - Centre Culturel
   - Date: December 15, 2025 (14:00-17:00)
   - Capacity: 50
   - Organizer: Marie Marseille

2. **Rencontre : Souveraineté Numérique en Provence**
   - Location: Aix-en-Provence - Café Polyglotte
   - Date: December 18, 2025 (19:00-21:00)
   - Capacity: 30
   - Organizer: Pierre Aix

3. **Festival d'Art Numérique**
   - Location: Marseille - Mucem
   - Date: December 20-22, 2025 (10:00-18:00)
   - Capacity: 200
   - Organizer: Admin

4. **Hackathon Social - Provence Digitale**
   - Location: Salon-de-Provence - Innovation Hub
   - Date: January 10-12, 2026 (9:00-17:00)
   - Capacity: 100
   - Organizer: Marie Marseille

5. **Marché du Samedi - Rencontres entre Entrepreneurs Locaux**
   - Location: Avignon - Place de l'Horloge
   - Date: December 6, 2025 (09:00-12:00)
   - Capacity: 50
   - Organizer: Luc Avignon

6. **Café Technique - Sécurité en ligne**
   - Location: Marseille - Café Victor
   - Date: December 7, 2025 (10:00-11:30)
   - Capacity: 20
   - Organizer: Jean Marseille

## Getting Started

### Start the Application

```bash
cd backend
mvn spring-boot:run
```

The application will automatically seed the database on startup (if it's empty).

### Access the API

Once the app is running:

1. **Login**: POST `/api/auth/login`
   ```json
   {
     "usernameOrEmail": "jean_marseille",
     "password": "Jean123!"
   }
   ```

2. **Get Token**: Response includes `accessToken` for authenticated requests

3. **Explore Endpoints**:
   - GET `/api/users/check/username?username=newuser` - Check username availability (public)
   - GET `/api/events` - View all events
   - GET `/api/forum/threads` - View forum discussions
   - POST `/api/forum/posts/{threadId}/posts` - Create forum post (requires auth)

### Reset Data

To clear demo data and start fresh:

**Option 1: Delete Database File** (if using H2)
```bash
rm test.mv.db
```

**Option 2: Using SQL (PostgreSQL)**
```sql
DELETE FROM forum_posts;
DELETE FROM forum_threads;
DELETE FROM event_registrations;
DELETE FROM events;
DELETE FROM users;
```

Then restart the application to regenerate seed data.

## Use Cases for Demo Data

### User Testing
- Test login/authentication with different roles
- Explore forum discussions as different users
- Register for events and test registration flow

### Feature Demonstration
- Show live forum discussions and moderation
- Demonstrate event management and filtering
- Present user management and admin features

### Development & Testing
- Quick way to populate test environment
- Realistic data for frontend integration
- Base for writing feature tests

## Content Location Context

All content is authentic to Provence communities:

- **Marseille**: Major port city, cultural hub (events at Mucem, Vieux Port)
- **Aix-en-Provence**: Historic city, university town (Café Polyglotte, town center)
- **Avignon**: Historic papal city (Place de l'Horloge)
- **Salon-de-Provence**: Industrial city with innovation focus
- **Aubagne**: Clay and pottery traditions, growing tech community

## Language

All demo content is in **French** to reflect the authentic Provence community context. The platform supports multilingual content and interface translation.

## Passwords

All demo passwords follow the pattern: `{Firstname}123!`
- Example: Marie → `Marie123!`
- Example: Jean → `Jean123!`

This is **only for demo purposes**. Real users should use strong, unique passwords in production.

---

For more information about L'Archipel Libre, see the main [README](../README.md).
