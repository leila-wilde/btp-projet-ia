/**
 * E2E Tests for Events
 * Tests event creation, viewing, and registration
 */

describe('Events E2E Tests', () => {
  beforeEach(() => {
    // Register and login before each test
    const timestamp = Date.now();
    const username = `eventuser_${timestamp}`;
    const email = `event_${timestamp}@example.com`;
    const password = 'Password123!';

    cy.register(username, email, password);
    cy.login(username, password);
  });

  it('should display events page', () => {
    cy.visitEvents();
    cy.get('h1').should('contain', 'Events');
    cy.get('[data-cy=events-list]').should('exist');
  });

  it('should navigate to create event page', () => {
    cy.visitEvents();
    cy.get('a[data-cy=create-event-btn]').click();
    cy.url().should('include', '/events/create');
    cy.get('h1').should('contain', 'Create Event');
  });

  it('should create a new event', () => {
    cy.visit('/events/create');

    // Fill in event form
    cy.get('input[formControlName="title"]').type('Community Meetup');
    cy.get('input[formControlName="description"]').type('A great community event');
    cy.get('input[formControlName="location"]').type('Paris, France');
    cy.get('input[formControlName="maxParticipants"]').type('50');

    // Set dates
    cy.get('input[formControlName="startTime"]').type('2025-12-15T14:00');
    cy.get('input[formControlName="endTime"]').type('2025-12-15T16:00');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Should redirect to events list
    cy.url().should('include', '/events');
    cy.contains('Event created successfully').should('be.visible');
  });

  it('should view event details', () => {
    cy.visitEvents();

    // Click on first event in list
    cy.get('[data-cy=event-card]').first().click();

    // Should display event details
    cy.get('[data-cy=event-details]').should('exist');
    cy.get('[data-cy=event-title]').should('exist');
    cy.get('[data-cy=event-description]').should('exist');
    cy.get('[data-cy=register-btn]').should('exist');
  });

  it('should register for an event', () => {
    cy.visitEvents();

    // Click on first event
    cy.get('[data-cy=event-card]').first().click();

    // Register for event
    cy.get('[data-cy=register-btn]').click();

    // Should show success message
    cy.contains('Registered successfully').should('be.visible');

    // Button should change to "Registered"
    cy.get('[data-cy=register-btn]').should('be.disabled');
  });

  it('should filter events by status', () => {
    cy.visitEvents();

    // Select upcoming events filter
    cy.get('select[data-cy=status-filter]').select('SCHEDULED');

    // Should update list
    cy.get('[data-cy=events-list]').should('exist');
  });

  it('should search events', () => {
    cy.visitEvents();

    // Search for event
    cy.get('input[data-cy=search-input]').type('Meetup');

    // Should filter results
    cy.get('[data-cy=event-card]').should('exist');
  });

  it('should show pagination controls', () => {
    cy.visitEvents();

    // Should have pagination
    cy.get('[data-cy=pagination]').should('exist');
    cy.get('[data-cy=page-info]').should('contain', 'Page');
  });
});
