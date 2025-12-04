// Cypress E2E support file
// Learn more about support files:
// https://on.cypress.io/support-file-syntax

// Import commands
import './commands';

// Disable uncaught exception handling for test stability
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  return false;
});
