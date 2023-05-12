/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
import {mount} from 'cypress/react18'


// Cypress.Commands.add('mount', (component, options) => {
//   return mount(component, options)
// })

Cypress.Commands.add('mount', mount)
Cypress.Commands.add('login', (email, password) => {
  cy.visit('http://localhost:5173/login');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="Login"]').click();
});

Cypress.Commands.add('logout', () => {
  cy.visit('http://localhost:5173/dash');
  cy.get('[data-cy="profile-toggle"]').click();
  cy.get('[data-cy="open-settings"]').click();
  cy.get('[data-cy="logout-button"]').click();
});

Cypress.Commands.add('deleteUser', (email) => {
  var token='';
  cy.request('POST', 
  `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${Cypress.env('API_TOKEN')}`
  , {
      email: "postmanuser@email.com",
      password: "password",
      returnSecureToken: true
  }).then((response) => {
      token = response.body.idToken;

      cy.request({
          method: 'DELETE',
          url: `http://localhost:8080/user`,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: {
            email: email
          }
      }).then((response) => {
        expect(response.status).to.eq(200);
        });
  });
  
});
Cypress.Commands.add('deleteFile', (documentId) => {
  var token='';
  cy.request('POST', 
  `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${Cypress.env('API_TOKEN')}`
  , {
      email: "postmanuser@email.com",
      password: "password",
      returnSecureToken: true
  }).then((response) => {
      token = response.body.idToken;

      cy.request({
          method: 'DELETE',
          url: `http://localhost:8080/documents/${documentId}/delete`,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
      }).then((response) => {
        expect(response.status).to.eq(200);
        });
  });
});

