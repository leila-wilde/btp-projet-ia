/**
 * E2E Tests for Authentication
 * Tests user registration, login, and logout flows
 */

describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login page', () => {
    cy.visit('/login');
    cy.get('h2').should('contain', 'Login');
    cy.get('input#usernameOrEmail').should('exist');
    cy.get('input#password').should('exist');
  });

  it('should navigate to registration page', () => {
    cy.visit('/login');
    cy.get('a').contains('Don\'t have an account').click();
    cy.url().should('include', '/register');
    cy.get('h2').should('contain', 'Register');
  });

  it('should register a new user', () => {
    const timestamp = Date.now();
    const username = `testuser_${timestamp}`;
    const email = `test_${timestamp}@example.com`;
    const password = 'Password123!';

    cy.register(username, email, password);

    // Verify we're on login page after registration
    cy.url().should('include', '/login');
  });

  it('should login with valid credentials', () => {
    // First register a user
    const timestamp = Date.now();
    const username = `loginuser_${timestamp}`;
    const email = `login_${timestamp}@example.com`;
    const password = 'Password123!';

    cy.register(username, email, password);

    // Then login
    cy.login(username, password);

    // Verify we're logged in
    cy.url().should('include', '/dashboard');
  });

  it('should reject invalid login credentials', () => {
    cy.visit('/login');
    cy.get('input#usernameOrEmail').type('invaliduser');
    cy.get('input#password').type('wrongpassword');
    cy.get('button').contains('Login').click();

    // Should see error message or stay on login page
    cy.url().should('include', '/login');
  });

  it('should show validation errors on empty form', () => {
    cy.visit('/login');
    cy.get('button').contains('Login').click();

    // Should see validation errors
    cy.get('p').should('be.visible');
  });
});
