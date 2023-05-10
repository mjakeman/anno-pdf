describe('Login functionality', () => {
  it('Error logging in with wrong credentials', () => {
    cy.visit('http://localhost:5173/login')
    cy.get('[data-cy="error-message"]').should('not.exist');
    cy.get('[data-cy="email-input"]').type('wrongemail@gmail.com');
    cy.get('[data-cy="password-input"]').type('123456');
    cy.get('[data-cy="Log in"]').click();
    cy.get('[data-cy="error-message"]').should('be.visible');

  })
})