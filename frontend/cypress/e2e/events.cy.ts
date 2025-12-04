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
    cy.get('h2').should('be.visible');
  });

  it('should list events', () => {
    cy.visitEvents();
    // Check if there's a list or container with events
    cy.get('main').should('be.visible');
  });

  it('should navigate and display', () => {
    cy.visit('/events');
    cy.url().should('include', '/events');
  });
});
