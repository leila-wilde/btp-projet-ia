// Custom Cypress commands for L'Archipel Libre

/**
 * Login command
 * Usage: cy.login('username', 'password')
 */
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get('input[formControlName="usernameOrEmail"]').type(username);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

/**
 * Register command
 * Usage: cy.register('username', 'email@example.com', 'password')
 */
Cypress.Commands.add('register', (username: string, email: string, password: string) => {
  cy.visit('/register');
  cy.get('input[formControlName="username"]').type(username);
  cy.get('input[formControlName="email"]').type(email);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/login');
});

/**
 * Logout command
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=logout-btn]').click();
  cy.url().should('include', '/');
});

/**
 * Navigate to events page
 * Usage: cy.visitEvents()
 */
Cypress.Commands.add('visitEvents', () => {
  cy.visit('/events');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      register(username: string, email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      visitEvents(): Chainable<void>;
    }
  }
}

export {};
